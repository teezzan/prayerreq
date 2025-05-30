package prayer

import (
	"encoding/json"
	"net/http"
	"time"

	"prayerreq-backend/internal/controller/prayer/data"
	"prayerreq-backend/internal/controller/prayer/repository"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// Service handles prayer request business logic
type Service struct {
	repo repository.Repository
}

// NewService creates a new prayer service
func NewService(repo repository.Repository) *Service {
	return &Service{
		repo: repo,
	}
}

// GetPrayers handles GET /api/v1/prayers
func (s *Service) GetPrayers(w http.ResponseWriter, r *http.Request) {
	prayers, err := s.repo.GetPrayerRequests(r.Context())
	if err != nil {
		http.Error(w, "Failed to get prayers: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prayers)
}

// CreatePrayer handles POST /api/v1/prayers
func (s *Service) CreatePrayer(w http.ResponseWriter, r *http.Request) {
	var input data.CreatePrayerRequestInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Create prayer request
	prayer := &data.PrayerRequest{
		ID:          bson.NewObjectID(),
		Title:       input.Title,
		Description: input.Description,
		UserName:    input.UserName,
		IsAnonymous: input.IsAnonymous,
		Priority:    input.Priority,
		Category:    input.Category,
		Tags:        input.Tags,
		PrayCount:   0,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := s.repo.CreatePrayerRequest(r.Context(), prayer); err != nil {
		http.Error(w, "Failed to create prayer: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(prayer)
}

// GetPrayerByID handles GET /api/v1/prayers/{id}
func (s *Service) GetPrayerByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	prayer, err := s.repo.GetPrayerRequestByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Prayer not found: "+err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prayer)
}

// UpdatePrayer handles PUT /api/v1/prayers/{id}
func (s *Service) UpdatePrayer(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Get existing prayer
	prayer, err := s.repo.GetPrayerRequestByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Prayer not found: "+err.Error(), http.StatusNotFound)
		return
	}

	var input data.UpdatePrayerRequestInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Update fields if provided
	if input.Title != nil {
		prayer.Title = *input.Title
	}
	if input.Description != nil {
		prayer.Description = *input.Description
	}
	if input.IsAnswered != nil {
		prayer.IsAnswered = *input.IsAnswered
	}
	if input.Priority != nil {
		prayer.Priority = *input.Priority
	}
	if input.Category != nil {
		prayer.Category = *input.Category
	}
	if input.Tags != nil {
		prayer.Tags = input.Tags
	}
	prayer.UpdatedAt = time.Now()

	if err := s.repo.UpdatePrayerRequest(r.Context(), id, prayer); err != nil {
		http.Error(w, "Failed to update prayer: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prayer)
}

// DeletePrayer handles DELETE /api/v1/prayers/{id}
func (s *Service) DeletePrayer(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := s.repo.DeletePrayerRequest(r.Context(), id); err != nil {
		http.Error(w, "Failed to delete prayer: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// IncrementPrayCount handles POST /api/v1/prayers/{id}/pray
func (s *Service) IncrementPrayCount(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := s.repo.IncrementPrayCount(r.Context(), id); err != nil {
		http.Error(w, "Failed to increment pray count: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Prayer count incremented"}`))
}

// SearchPrayers handles GET /api/v1/prayers/search?q=query
func (s *Service) SearchPrayers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}

	prayers, err := s.repo.SearchPrayerRequests(r.Context(), query)
	if err != nil {
		http.Error(w, "Failed to search prayers: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prayers)
}

// GetPrayersByCategory handles GET /api/v1/prayers/category/{category}
func (s *Service) GetPrayersByCategory(w http.ResponseWriter, r *http.Request) {
	category := chi.URLParam(r, "category")

	prayers, err := s.repo.GetPrayerRequestsByCategory(r.Context(), category)
	if err != nil {
		http.Error(w, "Failed to get prayers by category: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prayers)
}

// GetRecentPrayers handles GET /api/v1/prayers/recent?limit=10
func (s *Service) GetRecentPrayers(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 10 // default
	if limitStr != "" {
		if parsedLimit, err := json.Number(limitStr).Int64(); err == nil {
			limit = int(parsedLimit)
		}
	}

	prayers, err := s.repo.GetRecentPrayerRequests(r.Context(), limit)
	if err != nil {
		http.Error(w, "Failed to get recent prayers: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prayers)
}

// GetPrayerStats handles GET /api/v1/prayers/stats
func (s *Service) GetPrayerStats(w http.ResponseWriter, r *http.Request) {
	stats, err := s.repo.GetPrayerStats(r.Context())
	if err != nil {
		http.Error(w, "Failed to get prayer stats: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// AddComment handles POST /api/v1/prayers/{id}/comments
func (s *Service) AddComment(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var input data.CreateCommentInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate prayer request exists
	_, err := s.repo.GetPrayerRequestByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Prayer request not found: "+err.Error(), http.StatusNotFound)
		return
	}

	prayerID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid prayer ID: "+err.Error(), http.StatusBadRequest)
		return
	}

	comment := &data.Comment{
		ID:              bson.NewObjectID(),
		PrayerRequestID: prayerID,
		UserName:        input.UserName,
		Message:         input.Message,
		IsAnonymous:     input.IsAnonymous,
		CreatedAt:       time.Now(),
	}

	if err := s.repo.CreateComment(r.Context(), comment); err != nil {
		http.Error(w, "Failed to create comment: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(comment)
}

// GetComments handles GET /api/v1/prayers/{id}/comments
func (s *Service) GetComments(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	comments, err := s.repo.GetCommentsByPrayerID(r.Context(), id)
	if err != nil {
		http.Error(w, "Failed to get comments: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}
