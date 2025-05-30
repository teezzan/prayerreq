package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// DB represents the database connection
type DB struct {
	Client   *mongo.Client
	Database *mongo.Database
}

// New creates a new database connection
func New(uri, dbName string) (*DB, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}

	// Test the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}

	db := client.Database(dbName)

	return &DB{
		Client:   client,
		Database: db,
	}, nil
}

// Close closes the database connection
func (d *DB) Close(ctx context.Context) error {
	return d.Client.Disconnect(ctx)
}
