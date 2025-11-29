# GIS Application Project

Full-stack GIS application project with frontend and backend.

## Tech Stack

### Frontend
- Vue 3
- TypeScript
- Element Plus
- Pinia
- Webpack
- OpenLayers
- ECharts
- Cesium

### Backend
- Python FastAPI
- Uvicorn

## Project Structure

```
gis/
├── frontend/          # Frontend project
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   ├── dist/         # Build output
│   └── package.json  # Frontend dependencies
├── backend/          # Backend project
│   ├── app/         # Application code
│   └── main.py      # Entry point
└── README.md        # Project documentation
```

## Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Frontend service will run on http://localhost:8080

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend API will run on http://localhost:8000

API documentation: http://localhost:8000/docs

## Development Notes

- Frontend uses Webpack for bundling with hot module replacement
- Backend uses FastAPI with automatic API documentation generation
- Frontend and backend communicate via CORS for cross-origin requests

## Features

- User authentication system (Admin/Regular user)
- GIS travel records and notes management
- OpenLayers map integration
- Backend map tile proxy service (supports Gaode, OpenStreetMap, Tianditu)
- Travel route drawing
- Data statistics and visualization

