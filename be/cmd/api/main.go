package main

import (
	"context"
	"log"
	"os"

	"prayerreq-backend/internal/controller/prayer"
	prayerRepo "prayerreq-backend/internal/controller/prayer/repository"
	"prayerreq-backend/internal/controller/user"
	userRepo "prayerreq-backend/internal/controller/user/repository"
	"prayerreq-backend/internal/database"
	"prayerreq-backend/internal/server"
)

func main() {
	// Database configuration
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "prayerreq"
	}

	// Initialize database connection
	db, err := database.New(mongoURI, dbName)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer func() {
		if err := db.Close(context.Background()); err != nil {
			log.Printf("Error closing database: %v", err)
		}
	}()

	log.Println("Connected to MongoDB successfully")

	// Initialize repositories
	var (
		prayerRepository = prayerRepo.NewMongoRepository(db.Database)
		userRepository   = userRepo.NewMongoRepository(db.Database)
	)

	// Initialize services
	var (
		prayerService = prayer.NewService(prayerRepository)
		userService   = user.NewService(userRepository)
	)

	// Initialize HTTP handlers
	var (
		prayerHandler = prayer.NewHTTPHandler(prayerService)
		userHandler   = user.NewHTTPHandler(userService)
	)

	// Initialize server
	srv := server.New(prayerHandler, userHandler)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(srv.Start(port))
}
