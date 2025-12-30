export interface ScheduleEvent {
  id?: string; // Optional for local management
  timeSlot: string; // e.g., "15:30-17:30"
  activityType: string; // e.g., "联播", "游戏", "打印", "电脑专场"
  hosts: string; // e.g., "梅子玉/侯晖"
  backstage: string; // e.g., "孔繁颖"
  venue: string; // e.g., "3F Lab"
  platform: string; // e.g., "视频号/小红书"
}

export interface ScheduleDay {
  day: number; // 1-31
  events: ScheduleEvent[];
}

export interface MonthData {
  year: number;
  month: number; // 0-11
  days: ScheduleDay[];
}
