import React from 'react';

// Using a fast model for interactive scheduling
export const AI_MODEL = 'gemini-3-flash-preview';

export const INITIAL_RULES = `1. 周一至周四通常每天一场直播。
2. 场地通常在 "3F Lab" 或 "1F Lab" 之间轮换。
3. 平台通常是 "视频号/小红书"，游戏类可能涉及 "B站/抖音"。
4. 尽量保证人员排班均衡，不要让同一个人连续工作太久。
5. PS部门人员主要负责重要场次，PT部门人员协助。`;

export const INITIAL_STAFF = `PS部门:
梅子玉, 侯晖, 宋硕, 宗亭

PT部门:
霍雨佳, 闫宇锋, 温琳琳, 徐莉莉, 李浩, 赵明喆, 包煜焯, 刘洁, 季姓羽, 姜禹含, 刘长琦, 孙鹏`;

export const INITIAL_FRIDAY_CONFIG = `下午场 (15:30-17:30):
类型: 游戏 / 打印
平台: B站/抖音 (游戏), 视频号 (打印)

晚场 (19:00-21:00):
类型: 联播 / 电脑专场
平台: 视频号/小红书`;

export const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export const MONTH_NAMES = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

// Map activity types to colors
export const EVENT_TYPE_COLORS: Record<string, string> = {
  '联播': 'bg-green-600/20 border-green-500/50 text-green-200',
  '游戏': 'bg-purple-600/20 border-purple-500/50 text-purple-200',
  '打印': 'bg-orange-500/20 border-orange-400/50 text-orange-200',
  '电脑专场': 'bg-blue-600/20 border-blue-500/50 text-blue-200',
  'default': 'bg-slate-700/50 border-slate-600 text-slate-300'
};

export const DEFAULT_EVENT_COLOR = 'bg-slate-700/50 border-slate-600 text-slate-300';
