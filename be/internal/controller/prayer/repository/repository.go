package repository

import (
	"context"
	"prayerreq-backend/internal/controller/prayer/data"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Repository defines the interface for prayer request data access
type Repository interface {
	CreatePrayerRequest(ctx context.Context, req *data.PrayerRequest) error
	GetPrayerRequestByID(ctx context.Context, id string) (*data.PrayerRequest, error)
	GetPrayerRequests(ctx context.Context) ([]*data.PrayerRequest, error)
	UpdatePrayerRequest(ctx context.Context, id string, req *data.PrayerRequest) error
	DeletePrayerRequest(ctx context.Context, id string) error
	IncrementPrayCount(ctx context.Context, id string) error
}

// mongoRepository implements Repository interface using MongoDB
type mongoRepository struct {
	collection *mongo.Collection
}

// NewMongoRepository creates a new MongoDB repository for prayers
func NewMongoRepository(db *mongo.Database) Repository {
	return &mongoRepository{
		collection: db.Collection("prayer_requests"),
	}
}

// CreatePrayerRequest creates a new prayer request
func (r *mongoRepository) CreatePrayerRequest(ctx context.Context, req *data.PrayerRequest) error {
	_, err := r.collection.InsertOne(ctx, req)
	return err
}

// GetPrayerRequestByID retrieves a prayer request by ID
func (r *mongoRepository) GetPrayerRequestByID(ctx context.Context, id string) (*data.PrayerRequest, error) {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var req data.PrayerRequest
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&req)
	if err != nil {
		return nil, err
	}

	return &req, nil
}

// GetPrayerRequests retrieves all prayer requests
func (r *mongoRepository) GetPrayerRequests(ctx context.Context) ([]*data.PrayerRequest, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var requests []*data.PrayerRequest
	for cursor.Next(ctx) {
		var req data.PrayerRequest
		if err := cursor.Decode(&req); err != nil {
			return nil, err
		}
		requests = append(requests, &req)
	}

	return requests, cursor.Err()
}

// UpdatePrayerRequest updates a prayer request
func (r *mongoRepository) UpdatePrayerRequest(ctx context.Context, id string, req *data.PrayerRequest) error {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.ReplaceOne(ctx, bson.M{"_id": objectID}, req)
	return err
}

// DeletePrayerRequest deletes a prayer request
func (r *mongoRepository) DeletePrayerRequest(ctx context.Context, id string) error {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}

// IncrementPrayCount increments the pray count for a prayer request
func (r *mongoRepository) IncrementPrayCount(ctx context.Context, id string) error {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.UpdateOne(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$inc": bson.M{"pray_count": 1}},
	)
	return err
}
