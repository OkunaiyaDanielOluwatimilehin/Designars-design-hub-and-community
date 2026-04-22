
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export enum Category {
  UI_UX = 'UI/UX',
  BRANDING = 'Branding',
  LOGO = 'Logo Design',
  GRAPHIC_DESIGN = 'Graphic Design',
  MOTION_DESIGN = 'Motion Design'
}

export interface DesignBrief {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  points: number;
  image: string;
  deliverables: string[];
  tools: string[];
  submissionCount: number;
  isPublished?: boolean;
  likes?: number;
  commentsCount?: number;
  shares?: number;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  votes: number;
  timestamp: string;
  comments: Comment[];
  status?: 'pending' | 'approved' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
  challengesCompleted: number;
  rank: number;
  bio?: string;
  location?: string;
  skills: string[];
  joinedDate: string;
  website?: string;
  twitter?: string;
  github?: string;
  notifications: boolean;
  isPublic: boolean;
  role?: 'backend-developer' | 'designer' | 'admin';
}

export interface UserRanking extends User {}

export type TimeRange = 'week' | 'month' | 'year';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  image: string;
  publishedAt: string;
  readTime: string;
  likes?: number;
  commentsCount?: number;
  shares?: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'Tools' | 'Assets' | 'Inspiration' | 'Learning' | 'Accessibility';
  image?: string;
  tags: string[];
  likes?: number;
  commentsCount?: number;
  shares?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Freelance' | 'Remote';
  salary?: string;
  url: string;
  postedAt: string;
  logo?: string;
  likes?: number;
  commentsCount?: number;
  shares?: number;
}
