import { useState, useEffect } from "react";
import {
  api,
  transformPrayerRequest,
  transformToBackendFormat,
} from "../services/api";

export interface PrayerRequest {
  id: string;
  name: string;
  request: string;
  title?: string;
  location?: string;
  createdAt: Date;
  prayedFor: number;
  isUrgent?: boolean;
  isAnonymous?: boolean;
  category: string;
  prayedByUser?: boolean;
  authorId?: string;
  savedBy?: string[];
}

export interface NewPrayerRequest {
  name: string;
  request: string;
  location: string;
  isUrgent: boolean;
  isAnonymous: boolean;
  category: string;
}

export function usePrayerRequests() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load prayer requests from API
  const loadPrayerRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendData = await api.getPrayerRequests();
      const transformedData = backendData.map(transformPrayerRequest);
      setPrayerRequests(transformedData);
    } catch (err) {
      console.error("Failed to load prayer requests:", err);
      setError("Failed to load prayer requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new prayer request
  const createPrayerRequest = async (
    newRequest: NewPrayerRequest
  ): Promise<boolean> => {
    try {
      setError(null);
      const backendData = transformToBackendFormat(newRequest);
      const createdRequest = await api.createPrayerRequest(backendData);
      const transformedRequest = transformPrayerRequest(createdRequest);

      setPrayerRequests((prev) => [transformedRequest, ...prev]);
      return true;
    } catch (err) {
      console.error("Failed to create prayer request:", err);
      setError("Failed to create prayer request. Please try again.");
      return false;
    }
  };

  // Increment pray count
  const incrementPrayCount = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await api.incrementPrayCount(id);

      setPrayerRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? {
                ...request,
                prayedFor: request.prayedFor + 1,
                prayedByUser: true,
              }
            : request
        )
      );
      return true;
    } catch (err) {
      console.error("Failed to increment pray count:", err);
      setError("Failed to record prayer. Please try again.");
      return false;
    }
  };

  // Delete prayer request
  const deletePrayerRequest = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await api.deletePrayerRequest(id);

      setPrayerRequests((prev) => prev.filter((request) => request.id !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete prayer request:", err);
      setError("Failed to delete prayer request. Please try again.");
      return false;
    }
  };

  // Search prayer requests
  const searchPrayerRequests = async (
    query: string
  ): Promise<PrayerRequest[]> => {
    try {
      setError(null);
      const backendData = await api.searchPrayerRequests(query);
      return backendData.map(transformPrayerRequest);
    } catch (err) {
      console.error("Failed to search prayer requests:", err);
      setError("Failed to search prayer requests. Please try again.");
      return [];
    }
  };

  // Get prayers by category
  const getPrayersByCategory = async (
    category: string
  ): Promise<PrayerRequest[]> => {
    try {
      setError(null);
      const backendData = await api.getPrayersByCategory(category);
      return backendData.map(transformPrayerRequest);
    } catch (err) {
      console.error("Failed to get prayers by category:", err);
      setError("Failed to get prayers by category. Please try again.");
      return [];
    }
  };

  // Load prayer requests on mount
  useEffect(() => {
    loadPrayerRequests();
  }, []);

  return {
    prayerRequests,
    loading,
    error,
    createPrayerRequest,
    incrementPrayCount,
    deletePrayerRequest,
    searchPrayerRequests,
    getPrayersByCategory,
    refetch: loadPrayerRequests,
  };
}
