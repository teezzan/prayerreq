// API configuration
const API_BASE_URL = "http://localhost:8080/api/v1";

// Types
export interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  user_id: string;
  user_name: string;
  is_anonymous: boolean;
  is_answered: boolean;
  priority: string;
  category: string;
  tags: string[];
  pray_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePrayerRequestInput {
  title: string;
  description: string;
  user_name?: string;
  is_anonymous: boolean;
  priority?: string;
  category?: string;
  tags?: string[];
}

export interface PrayerStats {
  total_prayers: number;
  total_pray_count: number;
  answered_prayers: number;
  urgent_prayers: number;
  categories_count: Record<string, number>;
  recent_activity: any[];
}

// API Service class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Generic fetch wrapper
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Prayer Request API methods
  async getPrayerRequests(): Promise<PrayerRequest[]> {
    return this.request<PrayerRequest[]>("/prayers");
  }

  async getPrayerRequest(id: string): Promise<PrayerRequest> {
    return this.request<PrayerRequest>(`/prayers/${id}`);
  }

  async createPrayerRequest(
    data: CreatePrayerRequestInput
  ): Promise<PrayerRequest> {
    return this.request<PrayerRequest>("/prayers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePrayerRequest(
    id: string,
    data: Partial<PrayerRequest>
  ): Promise<PrayerRequest> {
    return this.request<PrayerRequest>(`/prayers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePrayerRequest(id: string): Promise<void> {
    return this.request<void>(`/prayers/${id}`, {
      method: "DELETE",
    });
  }

  async incrementPrayCount(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/prayers/${id}/pray`, {
      method: "POST",
    });
  }

  async searchPrayerRequests(query: string): Promise<PrayerRequest[]> {
    return this.request<PrayerRequest[]>(
      `/prayers/search?q=${encodeURIComponent(query)}`
    );
  }

  async getPrayersByCategory(category: string): Promise<PrayerRequest[]> {
    return this.request<PrayerRequest[]>(`/prayers/category/${category}`);
  }

  async getRecentPrayers(limit: number = 10): Promise<PrayerRequest[]> {
    return this.request<PrayerRequest[]>(`/prayers/recent?limit=${limit}`);
  }

  async getPrayerStats(): Promise<PrayerStats> {
    return this.request<PrayerStats>("/prayers/stats");
  }

  // Comment API methods
  async getComments(prayerId: string): Promise<any[]> {
    return this.request<any[]>(`/prayers/${prayerId}/comments`);
  }

  async addComment(prayerId: string, data: any): Promise<any> {
    return this.request<any>(`/prayers/${prayerId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// Create and export API instance
export const api = new ApiService(API_BASE_URL);

// Helper function to transform backend data to frontend format
export function transformPrayerRequest(backendData: PrayerRequest): any {
  return {
    id: backendData.id,
    name: backendData.is_anonymous ? "" : backendData.user_name,
    request: backendData.description,
    title: backendData.title,
    location: "", // Not in backend model yet
    createdAt: new Date(backendData.created_at),
    prayedFor: backendData.pray_count,
    isUrgent: backendData.priority === "urgent",
    isAnonymous: backendData.is_anonymous,
    category: backendData.category || "other",
    prayedByUser: false, // This would need user session management
    authorId: backendData.user_id,
    savedBy: [], // This would need user session management
  };
}

// Helper function to transform frontend data to backend format
export function transformToBackendFormat(
  frontendData: any
): CreatePrayerRequestInput {
  return {
    title: frontendData.title || frontendData.request.substring(0, 50) + "...",
    description: frontendData.request,
    user_name: frontendData.isAnonymous ? "" : frontendData.name,
    is_anonymous: frontendData.isAnonymous,
    priority: frontendData.isUrgent ? "urgent" : "medium",
    category: frontendData.category || "other",
    tags: frontendData.tags || [],
  };
}
