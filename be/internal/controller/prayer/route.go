package prayer

import (
	"github.com/go-chi/chi/v5"
)

// NewHTTPHandler creates a new HTTP handler for prayer requests
func NewHTTPHandler(service *Service) *HTTPHandler {
	return &HTTPHandler{
		service: service,
	}
}

// HTTPHandler handles HTTP requests for prayer requests
type HTTPHandler struct {
	service *Service
}

// RegisterRoutes registers prayer request routes
func (h *HTTPHandler) RegisterRoutes(r chi.Router) {
	r.Route("/prayers", func(r chi.Router) {
		r.Get("/", h.service.GetPrayers)
		r.Post("/", h.service.CreatePrayer)
		r.Get("/{id}", h.service.GetPrayerByID)
		r.Put("/{id}", h.service.UpdatePrayer)
		r.Delete("/{id}", h.service.DeletePrayer)
		r.Post("/{id}/pray", h.service.IncrementPrayCount)
	})
}
