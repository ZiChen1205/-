
import { GoogleGenAI } from "@google/genai";
import { NewsItem } from "../types";

const API_KEY = process.env.API_KEY || "";

/**
 * 驗證網址是否為深層連結（而非首頁或搜尋頁面）
 */
const isValidDeepLink = (url: string): boolean => {
  if (!url || !url.startsWith('http')) return false;
  try {
    const parsedUrl = new URL(url);
    // 排除搜尋引擎跳轉或已知無效路徑
    if (parsedUrl.hostname.includes('google.com') || parsedUrl.hostname.includes('bing.com')) return false;
    
    // 檢查路徑深度：如果是首頁，pathname 通常只有 '/' 或很短的固定字串
    const pathSegments = parsedUrl.pathname.split('/').filter(s => s.length > 0);
    
    // 大多數新聞詳細頁路徑至少包含兩段（如 /news/article-title）或一段很長的路徑
    if (pathSegments.length === 0) return false;
    if (pathSegments.length === 1 && pathSegments[0].length < 10) return false;
    
    return true;
  } catch (e) {
    return false;
  }
};

export const fetchNewsFromGemini = async (): Promise<NewsItem[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    你是一位嚴謹的科技新聞分析師，請執行以下任務：
    1. 搜尋過去 7 天內全球最重要的 10 則「國際新能源」相關動態。
    2. **【關鍵準則：找不到原文就不要放】**：
       - 每則新聞**必須**配備能直接開啟該報導內容的「精確原始文章網址 (Deep Link)」。
       - 如果你無法確認某則新聞的具體詳細頁面連結，請**直接捨棄**該則新聞，改找其他具備有效連結的消息。
       - **嚴格禁止回傳媒體首頁網址**（如 reuters.com）或搜尋引擎跳轉網址。
       - 寧可回傳少於 10 則高品質且連結正確的新聞，也不要回傳連結錯誤的新聞。
    
    3. 來源要求：
       - 優先選擇 Bloomberg, Reuters, Financial Times, Wall Street Journal, NYT, CNBC, TechCrunch, Electrek 等。
       - 包含社群媒體 (X, Reddit) 時，必須是具備具體討論內容的貼文連結。

    4. 所有輸出必須為「繁體中文」。
    5. 輸出格式為 JSON 陣列，物件包含：
       - title: 新聞標題
       - source: 媒體名稱
       - sourceType: "Authority" 或 "Social"
       - url: **精確的文章詳細頁面網址**
       - date: YYYY-MM-DD
       - category: 新聞分類
       - keyPoints: 三則要點摘要 (Array)
       - expertPerspective: 一則產業專家觀點

    請直接回傳 JSON，不要包含任何說明文字或 Markdown 格式標籤。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "";
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        // 在回傳前進行二次過濾，確保前端只顯示連結有效的新聞
        const verifiedItems = parsed
          .filter(item => isValidDeepLink(item.url))
          .map((item, idx) => ({
            ...item,
            id: `${Date.now()}-${idx}`
          }));
        
        return verifiedItems;
      }
    } catch (e) {
      console.error("JSON 解析失敗:", e);
      const match = jsonString.match(/\[[\s\S]*\]/);
      if (match) {
        const rawItems = JSON.parse(match[0]);
        return rawItems
          .filter((item: any) => isValidDeepLink(item.url))
          .map((item: any, idx: number) => ({
            ...item,
            id: `${Date.now()}-${idx}`
          }));
      }
    }
    
    throw new Error("未能獲取符合連結要求的新聞數據");
  } catch (error) {
    console.error("Gemini 服務錯誤:", error);
    throw error;
  }
};
