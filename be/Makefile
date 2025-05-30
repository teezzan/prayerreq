.PHONY: build run test clean docker-up docker-down dev install-godotenv dev-env

# Install godotenv for loading .env files
install-godotenv:
	go get github.com/joho/godotenv

# Build the application
build:
	go build -o bin/prayerreq-api cmd/api/main.go

# Run the application
run: build
	./bin/prayerreq-api

# Run in development mode with .env file loaded
dev: install-godotenv
	@if [ -f .env ]; then \
		export $$(grep -v '^#' .env | grep -v '^$$' | xargs) && go run cmd/api/main.go; \
	else \
		echo "Warning: .env file not found, running without environment variables"; \
		go run cmd/api/main.go; \
	fi

# Run in development mode with environment variables explicitly loaded
dev-env:
	@if [ -f .env ]; then \
		export $$(grep -v '^#' .env | grep -v '^$$' | xargs) && go run cmd/api/main.go; \
	else \
		echo "Error: .env file not found"; \
		exit 1; \
	fi

# Test the application
test:
	go test ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Start MongoDB with Docker Compose
docker-up:
	docker-compose up -d

# Stop MongoDB
docker-down:
	docker-compose down

# Show logs from MongoDB
docker-logs:
	docker-compose logs -f mongodb

# Format code
fmt:
	go fmt ./...

# Lint code (requires golangci-lint)
lint:
	golangci-lint run

# Run all quality checks
check: fmt lint test

# Help
help:
	@echo "Available commands:"
	@echo "  build          - Build the application"
	@echo "  run            - Build and run the application"
	@echo "  dev            - Run in development mode (loads .env file)"
	@echo "  dev-env        - Run in development mode (requires .env file)"
	@echo "  install-godotenv - Install godotenv package"
	@echo "  test           - Run tests"
	@echo "  clean          - Clean build artifacts"
	@echo "  docker-up      - Start MongoDB with Docker Compose"
	@echo "  docker-down    - Stop MongoDB"
	@echo "  docker-logs    - Show MongoDB logs"
	@echo "  fmt            - Format code"
	@echo "  lint           - Lint code"
	@echo "  check          - Run all quality checks" 