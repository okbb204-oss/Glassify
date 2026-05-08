import { GoogleGenAI } from '@google/genai';
import { crafts } from '../data/crafts';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Construct context from crafts data
const contextData = crafts.map(c => `- ${c.nameAR} (${c.nameEN || c.nameFR}): ${c.shortDescription}`).join('\n');

const systemInstruction = `أنت "حرفة"، المساعد الذكي لمنصة "حرفتي" الجزائرية للتكوين المهني واكتشاف الميولات الحرفية. تجيب عن أسئلة الحرف، التوجيه المهني، محتوى المنصة، ومراكز التكوين في الجزائر. أجب بالفصحى المبسطة الدافئة، أو بالإنجليزية المهنية. لا تجب عن أسئلة خارج نطاق الحرف والتكوين المهني. لا تخترع معلومات غير موجودة. كن موجزاً ومفيداً. المنصة غير حكومية ومستقلة، أنشأها Terki Abdelhak بمساعدة Djamel Boudehedje تحت إشراف CFPA Zeghiche - Jdiouia.

معلومات الحرف المتوفرة للمساعدة:
${contextData}`;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export async function sendChatMessage(messages: ChatMessage[], newMessage: string): Promise<string> {
  const startTime = Date.now();
  console.log(`[ChatService] New request at ${new Date(startTime).toISOString()}`);
  console.log(`[ChatService] User Message: ${newMessage}`);

  if (!apiKey) {
    console.error("[ChatService] API Key is missing");
    throw new Error("error_401");
  }

  const history: any[] = messages.slice(-5).map(m => ({ // Context limited to last 5 messages as requested
    role: m.role,
    parts: [{ text: m.content }]
  }));
  
  const formattedMessages = [
      ...history,
      { role: 'user', parts: [{ text: newMessage }] }
  ];

  async function attempt(retryCount429 = 0, retryCount5xx = 0): Promise<string> {
    try {
      const generatePromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedMessages,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('error_timeout')), 15000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]) as any;

      if (!response.text) {
        throw new Error("Received empty response from the AI model.");
      }

      const duration = Date.now() - startTime;
      console.log(`[ChatService] Response received in ${duration}ms`);
      return response.text;
    } catch (error: any) {
      console.error(`[ChatService] Error in attempt (429: ${retryCount429}, 5xx: ${retryCount5xx}):`, error);
      
      const errorMessage = error?.message?.toLowerCase() || '';
      const status = error?.status || 500;
      
      if (errorMessage === 'error_timeout') {
         throw new Error('error_timeout');
      }

      const is401 = errorMessage.includes('401') || errorMessage.includes('unauthenticated') || status === 401 || errorMessage.includes('api key');
      if (is401) {
        throw new Error('error_401');
      }

      const is429 = errorMessage.includes('429') || errorMessage.includes('quota') || status === 429;
      if (is429) {
         if (retryCount429 < 1) { // Wait 5s and retry 1 time for 429
            console.log("[ChatService] Rate limited (429), waiting 5s and retrying...");
            await new Promise(res => setTimeout(res, 5000));
            return attempt(retryCount429 + 1, retryCount5xx);
         }
         throw new Error('error_429');
      }

      // Default all other errors as 5xx, retry 3 times with 3s delay
      if (retryCount5xx < 3) {
        console.log("[ChatService] Server error, waiting 3s and retrying...");
        await new Promise(res => setTimeout(res, 3000));
        return attempt(retryCount429, retryCount5xx + 1);
      }
      
      throw new Error('error_5xx');
    }
  }

  return attempt();
}
