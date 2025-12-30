import { GoogleGenAI, Type } from "@google/genai";
import { ScheduleDay } from '../types';
import { AI_MODEL } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSchedule = async (
  rules: string,
  staffList: string,
  fridayConfig: string,
  year: number,
  month: number
): Promise<ScheduleDay[]> => {
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString('zh-CN', { month: 'long' });

  const prompt = `
    你是一个专业的直播排班助手。请根据以下信息为我生成一个详细的月度排班表。
    
    上下文:
    - 年份: ${year}
    - 月份: ${month + 1}月
    - 本月总天数: ${daysInMonth}
    
    1. 【基础规则】:
    "${rules}"
    
    2. 【人员池 (PS/PT)】:
    请从以下名单中分配"主播"和"后台(导播)"。请注意合理搭配，确保名字准确无误。
    "${staffList}"
    
    3. 【周五特殊配置】:
    周五通常有特殊的排班模式，请严格参考以下配置：
    "${fridayConfig}"
    
    任务:
    为本月（1号到${daysInMonth}号）生成每天的排班计划。
    每天可以有 0 个、1 个或多个直播事件（ScheduleEvent）。
    
    每个事件必须包含以下字段（请使用中文生成）：
    - timeSlot: 时间段 (例如 "15:30-17:30")
    - activityType: 直播类型 (例如 "联播", "游戏", "打印", "电脑专场")
    - hosts: 主播人员 (例如 "梅子玉/侯晖")
    - backstage: 后台/导播人员 (例如 "孔繁颖")
    - venue: 场地 (例如 "3F Lab", "1F Lab")
    - platform: 直播平台 (例如 "视频号/小红书")

    如果某天没有安排（例如周末休息），则该天的 events 数组为空即可。
  `;

  try {
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "你是一个排班助手，只返回符合 JSON 结构的排班数据。请确保 JSON 格式合法且不包含 Markdown 代码块标记。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER, description: "几号 (1-31)" },
              events: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timeSlot: { type: Type.STRING, description: "时间段" },
                    activityType: { type: Type.STRING, description: "类型简写" },
                    hosts: { type: Type.STRING, description: "主播名单" },
                    backstage: { type: Type.STRING, description: "后台名单" },
                    venue: { type: Type.STRING, description: "场地" },
                    platform: { type: Type.STRING, description: "平台" }
                  },
                  required: ["timeSlot", "activityType", "hosts", "backstage", "venue", "platform"]
                }
              }
            },
            required: ["day", "events"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text) as ScheduleDay[];
    // Ensure every day has a unique ID for events if missing
    data.forEach(d => {
      d.events?.forEach((e, idx) => {
        e.id = `${d.day}-${idx}-${Date.now()}`;
      });
    });

    return data;

  } catch (error) {
    console.error("Error generating schedule:", error);
    throw error;
  }
};
