import { create } from 'zustand';
import { ElementData, UserProgress } from '../types';
import { api } from '../services/api';
import elementsData from '../data/elements.json';

interface AtomixState {
  elements: ElementData[];
  selectedElement: ElementData | null;
  activeTab: 'home' | 'visualizer' | 'tutor' | 'quiz' | 'dashboard' | 'periodicTable' | 'admin_dashboard' | 'content_dashboard' | 'blog' | 'leaderboard' | 'course';
  language: 'en' | 'bn';
  progress: UserProgress;
  isLoading: boolean;
  aiExplanation: string | null;
  isAILoading: boolean;
  aiCache: Record<string, string>;
  isAIPanelOpen: boolean;
  zoomLevel: number;
  activeCategory: string | null;
  hoveredSeries: 'lanthanide' | 'actinide' | null;
  searchResults: ElementData[];
  electronSpeed: number;
  backgroundType: 'grid' | 'black';
  visualizationMode: 'bohr' | 'quantum';
  
  // Actions
  fetchElements: () => Promise<void>;
  setSelectedElement: (el: ElementData | null) => void;
  setSearchResults: (results: ElementData[]) => void;
  fetchAIExplanation: (element: ElementData) => Promise<void>;
  setActiveTab: (tab: 'home' | 'visualizer' | 'tutor' | 'quiz' | 'dashboard' | 'periodicTable' | 'admin_dashboard' | 'content_dashboard' | 'blog' | 'leaderboard' | 'course') => void;
  setLanguage: (lang: 'en' | 'bn') => void;
  syncProgress: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  incrementQuizzes: () => Promise<void>;
  setAIPanelOpen: (isOpen: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  setElectronSpeed: (speed: number) => void;
  setBackgroundType: (type: 'grid' | 'black') => void;
  setVisualizationMode: (mode: 'bohr' | 'quantum') => void;
  setActiveCategory: (category: string | null) => void;
  setHoveredSeries: (series: 'lanthanide' | 'actinide' | null) => void;
}

export const useStore = create<AtomixState>((set, get) => ({
  elements: elementsData as ElementData[],
  selectedElement: (elementsData as ElementData[])[5], // Default to Carbon
  activeTab: 'home',
  language: 'bn',
  isLoading: false,
  aiExplanation: null,
  isAILoading: false,
  aiCache: {},
  isAIPanelOpen: false,
  zoomLevel: 1,
  activeCategory: null,
  hoveredSeries: null,
  searchResults: [],
  electronSpeed: 1,
  backgroundType: 'grid',
  visualizationMode: 'bohr',
  progress: {
    solvedQuizzes: 0,
    learnedElements: [],
    points: 0,
    badges: [],
    quizHistory: []
  },

  fetchElements: async () => {
    try {
      const elements = await api.getElements();
      set({ elements });
    } catch (err) {
      console.warn("Falling back to local elements data", err);
    }
  },

  setSelectedElement: (selectedElement) => {
    set({ selectedElement, aiExplanation: null });
    if (selectedElement) {
      // Check cache first
      const cached = get().aiCache[selectedElement.symbol];
      if (cached) {
        set({ aiExplanation: cached, isAILoading: false });
        return;
      }
      get().fetchAIExplanation(selectedElement);
    }
  },

  setSearchResults: (searchResults) => set({ searchResults }),

  fetchAIExplanation: async (element) => {
    // Prevent hammered requests
    if (get().isAILoading) return;

    set({ isAILoading: true });
    try {
      const response = await api.getAIExplanation(`Explain the element ${element.name} (${element.symbol}) in a concise, scientific but engaging way. Mention its key properties, common uses, and why it's unique.`);
      
      set(state => ({ 
        aiExplanation: response,
        aiCache: { ...state.aiCache, [element.symbol]: response }
      }));
    } catch (err) {
      console.error("Failed to fetch AI explanation", err);
      set({ aiExplanation: "Unable to retrieve quantum data for this element. System core might be overwhelmed." });
    } finally {
      set({ isAILoading: false });
    }
  },
  setActiveTab: (activeTab) => set({ activeTab }),
  setLanguage: (language) => set({ language }),

  syncProgress: async () => {
    try {
      const data = await api.getProgress();
      set({ progress: data });
    } catch (err) {
      console.error("Sync failed", err);
    }
  },

  updatePoints: async (points) => {
    try {
      const newPoints = get().progress.points + points;
      const data = await api.updateProgress({ points: newPoints });
      set({ progress: data });
    } catch (err) {
      console.error("Failed to update points", err);
    }
  },

  incrementQuizzes: async () => {
    try {
      const newCount = get().progress.solvedQuizzes + 1;
      const data = await api.updateProgress({ solvedQuizzes: newCount });
      set({ progress: data });
    } catch (err) {
      console.error("Failed to increment quizzes", err);
    }
  },
  setAIPanelOpen: (isAIPanelOpen) => set({ isAIPanelOpen }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setElectronSpeed: (electronSpeed) => set({ electronSpeed }),
  setBackgroundType: (backgroundType) => set({ backgroundType }),
  setVisualizationMode: (visualizationMode) => set({ visualizationMode }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setHoveredSeries: (hoveredSeries) => set({ hoveredSeries })
}));
