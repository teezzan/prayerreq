package data

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// User represents a user in the system
type User struct {
	ID        bson.ObjectID `json:"id" bson:"_id,omitempty"`
	Email     string        `json:"email" bson:"email"`
	Name      string        `json:"name" bson:"name"`
	Avatar    string        `json:"avatar" bson:"avatar"`
	IsActive  bool          `json:"is_active" bson:"is_active"`
	CreatedAt time.Time     `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time     `json:"updated_at" bson:"updated_at"`
}

// CreateUserInput represents input for creating a user
type CreateUserInput struct {
	Email  string `json:"email" validate:"required,email"`
	Name   string `json:"name" validate:"required"`
	Avatar string `json:"avatar"`
}

// UpdateUserInput represents input for updating a user
type UpdateUserInput struct {
	Email    *string `json:"email" validate:"omitempty,email"`
	Name     *string `json:"name"`
	Avatar   *string `json:"avatar"`
	IsActive *bool   `json:"is_active"`
}
