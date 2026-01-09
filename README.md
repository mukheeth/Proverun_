# Proverum

A full-stack healthcare management application built with React and FastAPI.

## Features

- Executive Dashboard
- Sales Dashboard
- Clinical Detail View
- Market Access VAC
- Operations & Supply Chain
- Finance & Revenue
- Patient Management
- Physician Management
- Enrollment Management
- Invoice Management
- VAC Requests
- Notifications Center
- Settings & Profile Management

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Radix UI Components
- Recharts for data visualization
- Axios for API calls

### Backend
- FastAPI
- MongoDB (Motor - Async MongoDB driver)
- Python 3.x

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.8 or higher
- MongoDB instance (local or cloud)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the backend directory:
```env
MONGO_URL=your_mongodb_connection_string
DB_NAME=your_database_name
```

6. Start the server:
```bash
python server.py
```

The API will be available at `http://localhost:8000`

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/build` directory.

### Backend

The backend is ready for production deployment. Make sure to:
- Set up proper environment variables
- Configure CORS settings for your domain
- Use a production MongoDB instance
- Set up proper authentication and security

## Deployment

This project is configured for GitHub deployment. See the `.github/workflows` directory for deployment workflows.

### GitHub Pages Deployment

The frontend can be deployed to GitHub Pages using the included GitHub Actions workflow.

### Manual Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to your hosting service

3. Deploy the backend to a service like:
   - Heroku
   - Railway
   - Render
   - AWS
   - DigitalOcean

## Project Structure

```
Proverum/
├── frontend/          # React frontend application
│   ├── public/        # Static files
│   ├── src/           # Source code
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── lib/         # Utility functions
│   └── package.json
├── backend/           # FastAPI backend
│   ├── server.py      # Main server file
│   └── requirements.txt
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, please open an issue in the GitHub repository.
