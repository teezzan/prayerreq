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
		// Basic CRUD operations
		r.Get("/", h.service.GetPrayers)
		r.Post("/", h.service.CreatePrayer)

		// Specific utility endpoints
		r.Get("/search", h.service.SearchPrayers)
		r.Get("/stats", h.service.GetPrayerStats)
		r.Get("/recent", h.service.GetRecentPrayers)

		// Category routes
		r.Route("/category", func(r chi.Router) {
			r.Get("/{category}", h.service.GetPrayersByCategory)
		})

		// Individual prayer operations - these should be last
		r.Route("/{id}", func(r chi.Router) {
			r.Get("/", h.service.GetPrayerByID)
			r.Put("/", h.service.UpdatePrayer)
			r.Delete("/", h.service.DeletePrayer)
			r.Post("/pray", h.service.IncrementPrayCount)
			r.Post("/comments", h.service.AddComment)
			r.Get("/comments", h.service.GetComments)
		})
	})
}
