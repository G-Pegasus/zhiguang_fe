import type { ContentItem, SearchSuggestion } from "@/types/content";

export const categories = [
  "编程",
  "设计",
  "商业",
  "语言",
  "艺术",
  "健身",
  "摄影",
  "其他"
];

export const tabFilters = [
  { id: "latest", label: "最新" },
  { id: "popular", label: "最热" }
];

export const suggestions: SearchSuggestion[] = [
  { id: "python", label: "Python编程" },
  { id: "ui", label: "UI设计" },
  { id: "english", label: "英语学习" },
  { id: "fitness", label: "健身教程" },
  { id: "business", label: "商业思维" },
  { id: "video", label: "视频剪辑" },
  { id: "analysis", label: "数据分析" }
];

export const mockContents: ContentItem[] = [
  {
    id: "ai-backend",
    title: "从0到1开发后端服务",
    summary:
      "掌握现代后端开发的必备技能，从需求拆解、架构设计到上线监控，结合 TypeScript、NestJS 与云原生部署案例，带你构建可持续迭代的后台系统。",
    tags: ["后端", "TypeScript", "实战"],
    isFree: true,
    likes: 1,
    views: 5,
    mentor: { id: "kana", name: "刘同璟（Kana）" },
    kind: "article",
    category: "编程",
    createdAt: "2025-10-26",
    body: `Hello～ 这几天在抖音和站站总刷到 AI coding 的视频，我觉得你们自己也有必要来感受一下其中的魅力，或者验证一下现在的 AI coding 是否靠谱。

第一章：需求分析与技术选型
- 业务理解与实体设计
- 技术栈组合：TypeScript + NestJS + Prisma
- 云服务与部署考量

第二章：编码与质量保障
- 模块化设计
- 自动化测试与 CI/CD
- 可观测性与报警体系

第三章：上线与迭代
- 用户反馈闭环
- 数据驱动迭代
- 团队协作与知识沉淀`
  },
  {
    id: "english-love",
    title: "英语口语每日练习",
    summary:
      "每天 15 分钟，和外教一起练习生活与旅行常用口语，让英语成为自然而然的表达方式。",
    tags: ["英语", "口语", "日常交流"],
    isFree: true,
    likes: 0,
    views: 2102,
    mentor: { id: "anna", name: "Anna老师" },
    kind: "course",
    category: "语言",
    createdAt: "2025-08-12",
    coverImage: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "python-basics",
    title: "Python从入门到精通",
    summary:
      "从语法基础到对象编程，再到自动化脚本与数据分析，带你用 21 天时间掌握 Python 的核心能力。",
    tags: ["Python", "编程", "入门"],
    isFree: true,
    likes: 1,
    views: 1255,
    mentor: { id: "zhang", name: "张老师" },
    kind: "course",
    category: "编程",
    createdAt: "2025-10-28",
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    body: `本课程将带你从零开始学习 Python 编程。

第一章：Python基础
- 变量和数据类型
- 控制流程
- 函数定义

第二章：面向对象编程
- 类和对象
- 继承和多态
- 魔法方法

第三章：实战项目
- Web 爬虫
- 数据分析
- 自动化脚本`
  },
  {
    id: "ui-beginner",
    title: "UI设计零基础教程",
    summary: "掌握界面设计的基础流程与视觉语言，配合 Figma 实战案例，逐步搭建你的设计体系。",
    tags: ["UI设计", "Figma", "视觉设计"],
    isFree: true,
    likes: 0,
    views: 893,
    mentor: { id: "li", name: "李设计师" },
    kind: "course",
    category: "设计",
    createdAt: "2025-09-02",
    coverImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "lightroom",
    title: "摄影后期Lightroom全攻略",
    summary:
      "系统掌握 Lightroom 的调色逻辑与预设管理，用一套流程搞定人像、风光与商业摄影的后期处理。",
    tags: ["Lightroom", "摄影后期"],
    isFree: true,
    likes: 0,
    views: 568,
    mentor: { id: "sun", name: "Sun摄影师" },
    kind: "course",
    category: "摄影",
    createdAt: "2025-04-22",
    coverImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "business-guide",
    title: "商业思维与创业指南",
    summary:
      "从市场洞察、商业模式到融资沟通，带你理解优秀创业者的核心能力，构建可持续的大局观。",
    tags: ["商业策略", "创业", "增长"],
    isFree: true,
    likes: 0,
    views: 1102,
    mentor: { id: "chen", name: "陈导师" },
    kind: "course",
    category: "商业",
    createdAt: "2025-02-18",
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "fitness-bootcamp",
    title: "健身晨练全身课程",
    summary: "科学搭配燃脂与力量训练，30 分钟激活全身肌肉，打造自律好状态。",
    tags: ["健身", "训练营"],
    isFree: true,
    likes: 0,
    views: 742,
    mentor: { id: "gao", name: "高教练" },
    kind: "video",
    category: "健身",
    createdAt: "2025-07-11",
    coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80"
  }
];

export const learningEmptyState = {
  title: "还没有购买内容",
  description: "去首页探索优质内容吧",
  actionLabel: "前往首页"
};
