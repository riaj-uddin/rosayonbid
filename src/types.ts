export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string; // This will act as English name
  nameEn?: string;
  nameBn?: string;
  latinName?: string;
  group: number | null;
  period: number | null;
  category: string;
  atomicMass: number;
  electronegativity: number | null;
  electronConfiguration: string;
  shells: number[];
  color: string;
  xpos: number;
  ypos: number;
  state?: 'gas' | 'liquid' | 'solid' | 'unknown';
  image?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProgress {
  solvedQuizzes: number;
  learnedElements: string[];
  points: number;
  badges: Badge[];
  quizHistory: { date: string; score: number }[];
}
