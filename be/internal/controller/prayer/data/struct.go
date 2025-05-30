package data

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// PrayerRequest represents a prayer request in the system
type PrayerRequest struct {
	ID          bson.ObjectID `json:"id" bson:"_id,omitempty"`
	Title       string        `json:"title" bson:"title"`
	Description string        `json:"description" bson:"description"`
	UserID      bson.ObjectID `json:"user_id" bson:"user_id"`
	UserName    string        `json:"user_name" bson:"user_name"`
	IsAnonymous bool          `json:"is_anonymous" bson:"is_anonymous"`
	IsAnswered  bool          `json:"is_answered" bson:"is_answered"`
	Priority    string        `json:"priority" bson:"priority"` // "low", "medium", "high", "urgent"
	Category    string        `json:"category" bson:"category"`
	Tags        []string      `json:"tags" bson:"tags"`
	PrayCount   int           `json:"pray_count" bson:"pray_count"`
	CreatedAt   time.Time     `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at" bson:"updated_at"`
}

// Prayer represents a prayer made for a request
type Prayer struct {
	ID              bson.ObjectID `json:"id" bson:"_id,omitempty"`
	PrayerRequestID bson.ObjectID `json:"prayer_request_id" bson:"prayer_request_id"`
	UserID          bson.ObjectID `json:"user_id" bson:"user_id"`
	UserName        string        `json:"user_name" bson:"user_name"`
	Message         string        `json:"message" bson:"message"`
	IsAnonymous     bool          `json:"is_anonymous" bson:"is_anonymous"`
	CreatedAt       time.Time     `json:"created_at" bson:"created_at"`
}

// CreatePrayerRequestInput represents input for creating a prayer request
type CreatePrayerRequestInput struct {
	Title       string   `json:"title" validate:"required"`
	Description string   `json:"description" validate:"required"`
	UserName    string   `json:"user_name"`
	IsAnonymous bool     `json:"is_anonymous"`
	Priority    string   `json:"priority"`
	Category    string   `json:"category"`
	Tags        []string `json:"tags"`
}

// UpdatePrayerRequestInput represents input for updating a prayer request
type UpdatePrayerRequestInput struct {
	Title       *string  `json:"title"`
	Description *string  `json:"description"`
	IsAnswered  *bool    `json:"is_answered"`
	Priority    *string  `json:"priority"`
	Category    *string  `json:"category"`
	Tags        []string `json:"tags"`
}

// Comment represents a comment/message on a prayer request
type Comment struct {
	ID              bson.ObjectID `json:"id" bson:"_id,omitempty"`
	PrayerRequestID bson.ObjectID `json:"prayer_request_id" bson:"prayer_request_id"`
	UserName        string        `json:"user_name" bson:"user_name"`
	Message         string        `json:"message" bson:"message"`
	IsAnonymous     bool          `json:"is_anonymous" bson:"is_anonymous"`
	CreatedAt       time.Time     `json:"created_at" bson:"created_at"`
}

// PrayerStats represents prayer request statistics
type PrayerStats struct {
	TotalPrayers    int            `json:"total_prayers"`
	TotalPrayCount  int            `json:"total_pray_count"`
	AnsweredPrayers int            `json:"answered_prayers"`
	UrgentPrayers   int            `json:"urgent_prayers"`
	CategoriesCount map[string]int `json:"categories_count"`
	RecentActivity  []ActivityItem `json:"recent_activity"`
}

// ActivityItem represents a recent activity item
type ActivityItem struct {
	Type      string    `json:"type"` // "prayer_created", "prayer_answered", "pray_count_increased"
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}

// CreateCommentInput represents input for creating a comment
type CreateCommentInput struct {
	Message     string `json:"message" validate:"required"`
	UserName    string `json:"user_name"`
	IsAnonymous bool   `json:"is_anonymous"`
}
