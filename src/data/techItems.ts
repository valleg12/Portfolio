import {
  SiPython, SiPostgresql, SiPandas, SiScikitlearn, SiOpenai, SiGit, SiNotion,
} from 'react-icons/si'
import { TbBrain, TbBrandAzure, TbLayoutDashboard, TbChartBar, TbFileSpreadsheet } from 'react-icons/tb'
import type { IconType } from 'react-icons'

export interface TechItem {
  name: string
  icon: IconType
  color: string
  category: 'IA' | 'Data' | 'Business' | 'Tools'
  level: number
}

export const TECH_ITEMS: TechItem[] = [
  { name: 'Python',       icon: SiPython,         color: '#3b82f6', category: 'Data',     level: 85 },
  { name: 'SQL',          icon: SiPostgresql,      color: '#f59e0b', category: 'Data',     level: 80 },
  { name: 'Pandas',       icon: SiPandas,          color: '#6366f1', category: 'Data',     level: 75 },
  { name: 'Scikit-learn', icon: SiScikitlearn,     color: '#f97316', category: 'IA',       level: 70 },
  { name: 'GPT API',      icon: SiOpenai,          color: '#10b981', category: 'IA',       level: 90 },
  { name: 'LangChain',    icon: TbBrain,           color: '#8b5cf6', category: 'IA',       level: 75 },
  { name: 'Power BI',     icon: TbLayoutDashboard, color: '#f97316', category: 'Business', level: 85 },
  { name: 'Tableau',      icon: TbChartBar,        color: '#0ea5e9', category: 'Business', level: 80 },
  { name: 'Excel/Sheets', icon: TbFileSpreadsheet, color: '#22c55e', category: 'Business', level: 90 },
  { name: 'Azure',        icon: TbBrandAzure,      color: '#0078d4', category: 'Tools',    level: 60 },
  { name: 'Git',          icon: SiGit,             color: '#f97316', category: 'Tools',    level: 75 },
  { name: 'Notion',       icon: SiNotion,          color: '#e2e8f0', category: 'Tools',    level: 95 },
]
