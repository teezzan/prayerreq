package repository

import (
	"context"
	"prayerreq-backend/internal/controller/user/data"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Repository defines the interface for user data access
type Repository interface {
	CreateUser(ctx context.Context, user *data.User) error
	GetUserByID(ctx context.Context, id string) (*data.User, error)
	GetUserByEmail(ctx context.Context, email string) (*data.User, error)
	GetUsers(ctx context.Context) ([]*data.User, error)
	UpdateUser(ctx context.Context, id string, user *data.User) error
	DeleteUser(ctx context.Context, id string) error
}

// mongoRepository implements Repository interface using MongoDB
type mongoRepository struct {
	collection *mongo.Collection
}

// NewMongoRepository creates a new MongoDB repository for users
func NewMongoRepository(db *mongo.Database) Repository {
	return &mongoRepository{
		collection: db.Collection("users"),
	}
}

// CreateUser creates a new user
func (r *mongoRepository) CreateUser(ctx context.Context, user *data.User) error {
	_, err := r.collection.InsertOne(ctx, user)
	return err
}

// GetUserByID retrieves a user by ID
func (r *mongoRepository) GetUserByID(ctx context.Context, id string) (*data.User, error) {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var user data.User
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// GetUserByEmail retrieves a user by email
func (r *mongoRepository) GetUserByEmail(ctx context.Context, email string) (*data.User, error) {
	var user data.User
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// GetUsers retrieves all users
func (r *mongoRepository) GetUsers(ctx context.Context) ([]*data.User, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []*data.User
	for cursor.Next(ctx) {
		var user data.User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, &user)
	}

	return users, cursor.Err()
}

// UpdateUser updates a user
func (r *mongoRepository) UpdateUser(ctx context.Context, id string, user *data.User) error {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.ReplaceOne(ctx, bson.M{"_id": objectID}, user)
	return err
}

// DeleteUser deletes a user
func (r *mongoRepository) DeleteUser(ctx context.Context, id string) error {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}
