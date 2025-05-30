package repository

import (
	"context"
	"prayerreq-backend/internal/controller/prayer/data"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// Repository defines the interface for prayer request data access
type Repository interface {
	CreatePrayerRequest(ctx context.Context, req *data.PrayerRequest) error
	GetPrayerRequestByID(ctx context.Context, id string) (*data.PrayerRequest, error)
	GetPrayerRequests(ctx context.Context) ([]*data.PrayerRequest, error)
	UpdatePrayerRequest(ctx context.Context, id string, req *data.PrayerRequest) error
	DeletePrayerRequest(ctx context.Context, id string) error
	IncrementPrayCount(ctx context.Context, id string) error
	// New methods for enhanced functionality
	SearchPrayerRequests(ctx context.Context, query string) ([]*data.PrayerRequest, error)
	GetPrayerRequestsByCategory(ctx context.Context, category string) ([]*data.PrayerRequest, error)
	GetRecentPrayerRequests(ctx context.Context, limit int) ([]*data.PrayerRequest, error)
	GetPrayerStats(ctx context.Context) (*data.PrayerStats, error)
	// Comment methods
	CreateComment(ctx context.Context, comment *data.Comment) error
	GetCommentsByPrayerID(ctx context.Context, prayerID string) ([]*data.Comment, error)
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

// SearchPrayerRequests searches prayer requests by title and description
func (r *mongoRepository) SearchPrayerRequests(ctx context.Context, query string) ([]*data.PrayerRequest, error) {
	filter := bson.M{
		"$or": []bson.M{
			{"title": bson.M{"$regex": query, "$options": "i"}},
			{"description": bson.M{"$regex": query, "$options": "i"}},
			{"tags": bson.M{"$in": []string{query}}},
		},
	}

	cursor, err := r.collection.Find(ctx, filter)
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

// GetPrayerRequestsByCategory gets prayer requests by category
func (r *mongoRepository) GetPrayerRequestsByCategory(ctx context.Context, category string) ([]*data.PrayerRequest, error) {
	filter := bson.M{"category": category}

	cursor, err := r.collection.Find(ctx, filter)
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

// GetRecentPrayerRequests gets recent prayer requests
func (r *mongoRepository) GetRecentPrayerRequests(ctx context.Context, limit int) ([]*data.PrayerRequest, error) {
	opts := options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(int64(limit))
	cursor, err := r.collection.Find(ctx, bson.M{}, opts)
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

// GetPrayerStats gets prayer statistics
func (r *mongoRepository) GetPrayerStats(ctx context.Context) (*data.PrayerStats, error) {
	// Get total count
	totalCount, err := r.collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	// Get answered prayers count
	answeredCount, err := r.collection.CountDocuments(ctx, bson.M{"is_answered": true})
	if err != nil {
		return nil, err
	}

	// Get urgent prayers count
	urgentCount, err := r.collection.CountDocuments(ctx, bson.M{"priority": "urgent"})
	if err != nil {
		return nil, err
	}

	// Get total pray count using aggregation
	pipeline := []bson.M{
		{"$group": bson.M{"_id": nil, "total": bson.M{"$sum": "$pray_count"}}},
	}
	cursor, err := r.collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var totalPrayCount int
	if cursor.Next(ctx) {
		var result struct {
			Total int `bson:"total"`
		}
		if err := cursor.Decode(&result); err != nil {
			return nil, err
		}
		totalPrayCount = result.Total
	}

	// Get categories count
	categoryPipeline := []bson.M{
		{"$group": bson.M{"_id": "$category", "count": bson.M{"$sum": 1}}},
	}
	categoryCursor, err := r.collection.Aggregate(ctx, categoryPipeline)
	if err != nil {
		return nil, err
	}
	defer categoryCursor.Close(ctx)

	categoriesCount := make(map[string]int)
	for categoryCursor.Next(ctx) {
		var result struct {
			ID    string `bson:"_id"`
			Count int    `bson:"count"`
		}
		if err := categoryCursor.Decode(&result); err != nil {
			return nil, err
		}
		categoriesCount[result.ID] = result.Count
	}

	return &data.PrayerStats{
		TotalPrayers:    int(totalCount),
		TotalPrayCount:  totalPrayCount,
		AnsweredPrayers: int(answeredCount),
		UrgentPrayers:   int(urgentCount),
		CategoriesCount: categoriesCount,
		RecentActivity:  []data.ActivityItem{}, // Placeholder for now
	}, nil
}

// CreateComment creates a new comment
func (r *mongoRepository) CreateComment(ctx context.Context, comment *data.Comment) error {
	commentsCollection := r.collection.Database().Collection("comments")
	_, err := commentsCollection.InsertOne(ctx, comment)
	return err
}

// GetCommentsByPrayerID gets comments for a prayer request
func (r *mongoRepository) GetCommentsByPrayerID(ctx context.Context, prayerID string) ([]*data.Comment, error) {
	objectID, err := bson.ObjectIDFromHex(prayerID)
	if err != nil {
		return nil, err
	}

	commentsCollection := r.collection.Database().Collection("comments")
	cursor, err := commentsCollection.Find(ctx, bson.M{"prayer_request_id": objectID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var comments []*data.Comment
	for cursor.Next(ctx) {
		var comment data.Comment
		if err := cursor.Decode(&comment); err != nil {
			return nil, err
		}
		comments = append(comments, &comment)
	}

	return comments, cursor.Err()
}
