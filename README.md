# HydroLens

HydroLens is a comprehensive groundwater data exploration platform that provides AI-powered insights into India's groundwater resources. The application features a dual-backend architecture with Node.js for authentication and chat services, and FastAPI for additional APIs and Google OAuth integration.

## Features

- **AI-Powered Chat**: Natural language queries about groundwater data
- **Google OAuth Authentication**: Secure login with Google accounts
- **Multilingual Support**: Interface and responses in multiple languages
- **Real-time Data Visualization**: Interactive groundwater data exploration
- **User Management**: Registration and authentication system

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design with dark mode support

### Backend
- **Node.js/Express**: Authentication, user management, chat API
- **FastAPI/Python**: Google OAuth, additional API endpoints
- **MongoDB**: User data and chat history storage

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sih-2025
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   ```

   This will install both Node.js and Python dependencies.

3. **Environment Configuration**

   Copy the `.env` file and update the values:
   ```bash
   cp .env .env.local
   ```

   Update the following variables in `.env`:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

4. **Google OAuth Setup**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:8000/auth/callback` to authorized redirect URIs
   - Download the client secret JSON file and place it in `hydrolensBE/client_secret.json`

## Usage

### Development

1. **Start the Python backend (FastAPI)**
   ```bash
   npm run python-dev
   ```

2. **Start the Node.js backend (Express)**
   ```bash
   npm run dev
   ```

3. **Open the application**
   - Frontend: Open `index.html` in your browser
   - API endpoints will be available at:
     - Node.js: `http://localhost:3000`
     - Python: `http://localhost:8000`

### Production

```bash
npm start
```

## API Endpoints

### Authentication (Node.js - Port 3000)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Chat (Node.js - Port 3000)
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Get chat history

### OAuth (Python - Port 8000)
- `GET /auth/login` - Initiate Google OAuth
- `GET /auth/callback` - OAuth callback

### Chat (Python - Port 8000)
- `GET /chat/start` - Start chat session

## Project Structure

```
sih-2025/
├── index.html              # Main landing page
├── script.js               # Frontend JavaScript
├── style.css               # Application styles
├── server.js               # Main server entry point
├── package.json            # Node.js dependencies and scripts
├── .env                    # Environment variables
├── README.md               # This file
├── test-setup.js           # Setup validation script
├── hydrolensBE/            # Python backend
│   ├── main.py            # FastAPI application
│   ├── api.py             # OAuth routes
│   ├── chatroute.py       # Chat routes
│   ├── requirements.txt   # Python dependencies
│   └── client_secret.json # Google OAuth credentials
└── server/                 # Node.js backend
    └── acc/
        └── script/
            ├── server.js          # Express server
            ├── routes/
            │   ├── authRoutes.js  # Auth routes
            │   └── chatRoutes.js  # Chat routes
            ├── controllers/
            │   ├── authcontroller.js  # Auth logic
            │   └── chatController.js  # Chat logic
            └── models/            # MongoDB models
                ├── User.js        # User model
                └── Chat.js        # Chat model
```

## Testing

Run the setup validation script:
```bash
npm run test
```

This will check:
- Required files exist
- Dependencies are installed
- Environment variables are configured
- Database connection is working

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Updates

- **v1.0.0 (Initial Release)**: Launched HydroLens with AI-powered chat, Google OAuth authentication, and groundwater data exploration features.
- **Recent Improvements**: Enhanced error handling, JWT validation, chat history loading from MongoDB, and UI responsiveness.

## FAQ

### What is HydroLens?
HydroLens is a comprehensive groundwater data exploration platform that provides AI-powered insights into India's groundwater resources using natural language queries.

### How do I install and run the application?
Follow the installation steps in the README: clone the repo, run `npm run setup`, configure environment variables, and start the servers with `npm run python-dev` and `npm run dev`.

### What are the main features?
- AI-powered chat for groundwater data queries
- Google OAuth authentication
- Multilingual support
- Real-time data visualization
- User management

### What tech stack is used?
Frontend: HTML5, CSS3, JavaScript. Backend: Node.js/Express for auth and chat, FastAPI/Python for OAuth and APIs, MongoDB for data storage.

### How to contribute?
Fork the repository, create a feature branch, make changes, run tests, and submit a pull request.

## Support

For questions or issues, please create an issue in the repository or contact the development team.
