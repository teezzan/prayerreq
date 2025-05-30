# 🕌 Prayer Requests Platform

A beautiful and simple platform where Muslims can request prayers from their brothers and sisters, especially those visiting holy places like Makkah and Madinah for Hajj, Umrah, or other pilgrimages.

## ✨ Features

- **Simple & Clean Interface**: Easy-to-use design focused on the spiritual purpose
- **No Account Required**: Anyone can submit prayer requests or mark them as prayed for
- **Islamic Design**: Beautiful green-themed design with Quranic verses
- **Real-time Updates**: See how many people have prayed for each request
- **Location Support**: Optional location field for those in holy places
- **Urgent Requests**: Mark urgent requests with a special badge
- **Responsive Design**: Works beautifully on all devices

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd prayerreq
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 How It Works

1. **Submit a Prayer Request**: Users can submit their prayer requests with their name, the prayer they need, and optionally their location
2. **Browse Requests**: All prayer requests are displayed in a beautiful card layout
3. **Pray for Others**: Users can click "I Prayed for This" to show they've included that request in their prayers
4. **Track Impact**: See how many people have prayed for each request

## 🌟 Perfect For

- Muslims going for Hajj pilgrimage
- Umrah visitors
- People visiting Makkah or Madinah
- Anyone seeking prayers from the community
- Those wanting to pray for others

## 📚 Islamic Context

This platform is inspired by the beautiful Islamic tradition of asking for prayers from those visiting holy places. When someone goes for Hajj or Umrah, their community often asks them to pray for various needs, as prayers made in holy places are considered especially blessed.

> "And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me." - Quran 2:186

## 🔮 Future Enhancements

- User authentication system
- Prayer categories (health, success, guidance, etc.)
- Email notifications
- Mobile app
- Multi-language support (Arabic, Urdu, etc.)
- Prayer time integration
- Location-based filtering

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤲 Duas

May Allah accept all the prayers submitted through this platform and grant what is best for everyone. Ameen.

---

_"And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."_ - Quran 65:3

# Prayer Request Application

A full-stack prayer request application with a React/TypeScript frontend and Go backend using MongoDB.

## Project Structure

This is a monorepo containing both frontend and backend applications:

```
prayerreq/
├── fe/                    # Frontend (React/TypeScript/Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── be/                    # Backend (Go/MongoDB/Chi)
│   ├── data/              # Data models
│   ├── repository/        # Data access layer
│   ├── service/           # Business logic
│   ├── main.go
│   ├── route.go
│   └── docker-compose.yml
├── docker-compose.yml     # MongoDB setup
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm (for frontend)
- Go 1.19+ (for backend)
- Docker and Docker Compose (for MongoDB)

### 1. Start MongoDB

```bash
cd be
docker-compose up -d
```

### 2. Start Backend

```bash
cd be
go mod tidy
go run main.go route.go
```

The API will be available at `http://localhost:8080`

### 3. Start Frontend

```bash
cd fe
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Features

### Backend (Go)

- ✅ RESTful API with Chi router
- ✅ MongoDB integration with official Go driver
- ✅ Clean architecture (Repository + Service layers)
- ✅ CORS support for frontend integration
- ✅ Prayer request CRUD operations
- ✅ User management
- ✅ Health check endpoint

### Frontend (React/TypeScript)

- ⚛️ React 18 with TypeScript
- ⚡ Vite for fast development
- 🎨 Modern UI components
- 📱 Responsive design

## API Endpoints

### Prayer Requests

- `GET /api/v1/prayers` - Get all prayer requests
- `POST /api/v1/prayers` - Create a prayer request
- `GET /api/v1/prayers/{id}` - Get specific prayer request
- `PUT /api/v1/prayers/{id}` - Update prayer request
- `DELETE /api/v1/prayers/{id}` - Delete prayer request

### Users

- `GET /api/v1/users` - Get all users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{id}` - Get specific user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

## Database Management

Access MongoDB via Mongo Express at `http://localhost:8081`

- Username: `admin`
- Password: `password`

## Technology Stack

### Backend

- **Language**: Go 1.19+
- **Router**: [Chi](https://github.com/go-chi/chi)
- **Database**: MongoDB with [official Go driver](https://github.com/mongodb/mongo-go-driver)
- **Architecture**: Clean Architecture (Repository + Service pattern)

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS/SCSS (configurable)

## Development

### Adding New Features

#### Backend

1. Define data models in `be/data/struct.go`
2. Add repository methods in `be/repository/repository.go`
3. Implement business logic in `be/service/service.go`
4. Add routes in `be/route.go`

#### Frontend

1. Create components in `fe/src/components/`
2. Add pages in `fe/src/pages/`
3. Update routing as needed

### Environment Configuration

#### Backend (.env in be/ directory)

```env
MONGODB_URI=mongodb://localhost:27017
PORT=8080
DB_NAME=prayerreq
ENVIRONMENT=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
