package user

import (
	"encoding/json"
	"net/http"
	"time"

	"prayerreq-backend/internal/controller/user/data"
	"prayerreq-backend/internal/controller/user/repository"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// Service handles user business logic
type Service struct {
	repo repository.Repository
}

// NewService creates a new user service
func NewService(repo repository.Repository) *Service {
	return &Service{
		repo: repo,
	}
}

// GetUsers handles GET /api/v1/users
func (s *Service) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := s.repo.GetUsers(r.Context())
	if err != nil {
		http.Error(w, "Failed to get users: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// CreateUser handles POST /api/v1/users
func (s *Service) CreateUser(w http.ResponseWriter, r *http.Request) {
	var input data.CreateUserInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	user := &data.User{
		ID:        bson.NewObjectID(),
		Email:     input.Email,
		Name:      input.Name,
		Avatar:    input.Avatar,
		IsActive:  true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.repo.CreateUser(r.Context(), user); err != nil {
		http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

// GetUserByID handles GET /api/v1/users/{id}
func (s *Service) GetUserByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	user, err := s.repo.GetUserByID(r.Context(), id)
	if err != nil {
		http.Error(w, "User not found: "+err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// UpdateUser handles PUT /api/v1/users/{id}
func (s *Service) UpdateUser(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Get existing user
	user, err := s.repo.GetUserByID(r.Context(), id)
	if err != nil {
		http.Error(w, "User not found: "+err.Error(), http.StatusNotFound)
		return
	}

	var input data.UpdateUserInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Update fields if provided
	if input.Email != nil {
		user.Email = *input.Email
	}
	if input.Name != nil {
		user.Name = *input.Name
	}
	if input.Avatar != nil {
		user.Avatar = *input.Avatar
	}
	if input.IsActive != nil {
		user.IsActive = *input.IsActive
	}
	user.UpdatedAt = time.Now()

	if err := s.repo.UpdateUser(r.Context(), id, user); err != nil {
		http.Error(w, "Failed to update user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// DeleteUser handles DELETE /api/v1/users/{id}
func (s *Service) DeleteUser(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := s.repo.DeleteUser(r.Context(), id); err != nil {
		http.Error(w, "Failed to delete user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
