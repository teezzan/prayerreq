package user

import (
	"github.com/go-chi/chi/v5"
)

// NewHTTPHandler creates a new HTTP handler for users
func NewHTTPHandler(service *Service) *HTTPHandler {
	return &HTTPHandler{
		service: service,
	}
}

// HTTPHandler handles HTTP requests for users
type HTTPHandler struct {
	service *Service
}

// RegisterRoutes registers user routes
func (h *HTTPHandler) RegisterRoutes(r chi.Router) {
	r.Route("/users", func(r chi.Router) {
		r.Get("/", h.service.GetUsers)
		r.Post("/", h.service.CreateUser)
		r.Get("/{id}", h.service.GetUserByID)
		r.Put("/{id}", h.service.UpdateUser)
		r.Delete("/{id}", h.service.DeleteUser)
	})
}
