# Deployment Guide

## Deploying to Render

### Prerequisites

- A Render account
- Your code pushed to a GitHub repository
- MongoDB Atlas account (for production database)

### Steps

1. **Connect your GitHub repository to Render**

   - Go to your Render dashboard
   - Click "New" > "Web Service"
   - Connect your GitHub repository

2. **Configure the service**

   - **Build Command**: `docker build -t prayerreq-backend .`
   - **Start Command**: `./main`
   - **Environment**: `Docker`
   - **Region**: Choose your preferred region

3. **Set Environment Variables**
   In the Render dashboard, add these environment variables:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   DB_NAME=prayerreq
   PORT=8080
   ENVIRONMENT=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Environment Variables

| Variable      | Description                               | Example                                        |
| ------------- | ----------------------------------------- | ---------------------------------------------- |
| `MONGODB_URI` | MongoDB connection string                 | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `DB_NAME`     | Database name                             | `prayerreq`                                    |
| `PORT`        | Port number (automatically set by Render) | `8080`                                         |
| `ENVIRONMENT` | Environment type                          | `production`                                   |

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get the connection string
5. Add your Render service's IP to the whitelist (or use 0.0.0.0/0 for all IPs)

### CORS Configuration

The backend is configured with wildcard CORS (`*`) to allow connections from any frontend domain, including your Vercel deployment.

### Health Check

Your deployed service will have a health check endpoint at:

```
https://your-service-name.onrender.com/health
```

### API Base URL

Your API will be available at:

```
https://your-service-name.onrender.com/api/v1
```

Make sure to update your frontend's API configuration to point to this URL for production.
