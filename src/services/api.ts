import { UserProgress, ElementData } from '../types';
import { geminiService } from './geminiService';

const API_BASE = '/api';

class ApiService {
  private token: string | null = localStorage.getItem('atomix_auth_token');

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('atomix_auth_token', token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('atomix_auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // --- Elements ---
  async getElements(): Promise<ElementData[]> {
    return this.request<ElementData[]>('/elements');
  }

  // --- Auth ---
  async login(credentials: any) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(data.token);
    return data;
  }

  // --- AI ---
  async getAIExplanation(concept: string): Promise<string> {
    return geminiService.generateExplanation(concept);
  }

  // --- Progress ---
  async getProgress(): Promise<UserProgress> {
    return this.request<UserProgress>('/progress');
  }

  async updateProgress(update: Partial<UserProgress>): Promise<UserProgress> {
    return this.request<UserProgress>('/progress', {
      method: 'POST',
      body: JSON.stringify(update),
    });
  }
}

export const api = new ApiService();
