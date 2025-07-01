# React Web Tester for ZZC Scheduler

A React-based web application for testing and monitoring the ZZC Scheduler service. This app provides a modern, responsive interface for submitting tasks, monitoring their progress, and viewing generated images.

## Features

- **Real-time Task Monitoring**: Continuously tracks the latest task data from `/api/v1/tasks`
- **Interactive UI**: Modern React interface with the same styling and components as the original web tester
- **Batch Testing**: Submit multiple tasks at once with configurable batch sizes
- **Image Gallery**: View all generated images with task details
- **System Monitoring**: Real-time display of worker status, queue length, and task statistics
- **Export Functionality**: Export test results as JSON files
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- ZZC Scheduler service running (default: http://localhost:8080)

## Installation

1. Navigate to the project directory:
   ```bash
   cd /Users/hezzze/Documents/projects/zzc_scheduler/examples/react-web-tester
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. The app will automatically reload when you make changes to the source code.

## Building for Production

1. Create a production build:
   ```bash
   npm run build
   ```

2. The optimized build will be created in the `build/` directory.

## Deployment as SPA

### Option 1: Static File Server

1. After building, serve the `build/` directory using any static file server:
   ```bash
   # Using Python's built-in server
   cd build
   python3 -m http.server 3000
   
   # Using Node.js serve package
   npx serve -s build -p 3000
   
   # Using nginx (copy build contents to nginx web root)
   cp -r build/* /var/www/html/
   ```

### Option 2: Docker Deployment

1. Create a `Dockerfile` in the project root:
   ```dockerfile
   FROM node:16-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Build and run the Docker container:
   ```bash
   docker build -t react-web-tester .
   docker run -p 3000:80 react-web-tester
   ```

### Option 3: GitHub Pages Deployment

The project is configured for GitHub Pages deployment:

1. **Manual Deployment**:
   ```bash
   npm run deploy
   ```

2. **Automatic Deployment**: 
   - Push changes to the main/master branch
   - GitHub Actions will automatically build and deploy
   - Live site: https://hezzze.github.io/zzc_task_monitor

3. **Configuration**:
   - Homepage URL is set in `package.json`
   - GitHub Actions workflow in `.github/workflows/deploy.yml`
   - Deploys to `gh-pages` branch automatically

### Option 4: Other Cloud Deployment

- **Netlify**: Connect your Git repository and deploy automatically
- **Vercel**: Deploy with zero configuration
- **AWS S3 + CloudFront**: Host static files with CDN

## Configuration

### Scheduler URL

The app connects to the ZZC Scheduler service. You can configure the default URL by:

1. **Environment Variables**: Create a `.env` file in the project root:
   ```
   REACT_APP_SCHEDULER_URL=http://your-scheduler-url:port
   ```

2. **Runtime Configuration**: Use the connection settings in the app's sidebar to change the URL dynamically.

### Proxy Configuration

For development, the app includes a proxy configuration in `package.json` that forwards API requests to `http://localhost:8080`. Modify this if your scheduler runs on a different port.

## API Integration

The app integrates with the following ZZC Scheduler endpoints:

- `GET /health` - Check scheduler health and worker status
- `GET /api/v1/stats` - Get system statistics
- `GET /api/v1/tasks` - List all tasks
- `GET /api/v1/tasks/{id}` - Get specific task details
- `POST /api/v1/tasks` - Submit new tasks

## Project Structure

```
react-web-tester/
├── public/
│   ├── index.html
│   └── default_workflow.json
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Application styles
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests (if any)
- `npm run eject` - Eject from Create React App (irreversible)

## Features Overview

### Connection Management
- Connect to any ZZC Scheduler instance
- Real-time connection status indicator
- Automatic health checks

### Task Testing
- **Single Test**: Submit individual tasks with custom or random prompts
- **Batch Test**: Submit multiple tasks simultaneously
- **Custom Prompts**: Enter your own prompts or use random ones
- **Progress Monitoring**: Real-time task status updates

### System Monitoring
- Worker count and status
- Queue length
- Total task statistics
- Auto-refresh every 30 seconds

### Image Gallery
- Grid layout of all generated images
- Click to view detailed task information
- Task status indicators
- Responsive design for different screen sizes

### Data Management
- Load existing tasks from the scheduler
- Clear gallery and task history
- Export results as JSON files
- Persistent task tracking

## Troubleshooting

### Common Issues

1. **Connection Failed**: Ensure the ZZC Scheduler service is running and accessible
2. **CORS Errors**: Configure CORS settings in your scheduler service
3. **Images Not Loading**: Check that image URLs are accessible from the browser
4. **Build Errors**: Ensure all dependencies are installed with `npm install`

### Development Tips

- Use browser developer tools to monitor network requests
- Check the console for error messages
- Verify the scheduler API endpoints are responding correctly
- Test with different scheduler URLs and configurations

## Contributing

This React app maintains feature parity with the original web tester while providing a modern, maintainable codebase. When adding new features:

1. Follow React best practices and hooks patterns
2. Maintain responsive design principles
3. Keep the UI consistent with the existing design
4. Add proper error handling and user feedback
5. Test with different scheduler configurations

## License

This project is part of the ZZC Scheduler system and follows the same licensing terms.