<div align="center">

  <h1>🧘 MediaPipe Pose Estimation</h1>
  <p>Real-time pose estimation and facial expression detection web application built with React 19, Vite 7, and MediaPipe. Detect 33 body landmarks with smooth skeleton visualization and recognize emotions through facial analysis.</p>

  ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/sumitsahoo/mediapipe-pose-estimation/deploy.yml)
  ![GitHub deployments](https://img.shields.io/github/deployments/sumitsahoo/mediapipe-pose-estimation/github-pages)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
</div>

## 👨🏻‍💻 Live Demo

[sumitsahoo.github.io/mediapipe-pose-estimation](https://sumitsahoo.github.io/mediapipe-pose-estimation)

## 🚀 Features

- **⚡️ Real-time Detection**: Smooth 30fps pose landmark detection using MediaPipe
- **🎯 33 Body Landmarks**: Detects all major body joints including face, arms, torso, and legs
- **😊 Facial Expression Detection**: Recognizes emotions (happy, sad, angry, neutral) with emoji display
- **🎭 Face Mesh Visualization**: Real-time facial landmark overlay with glow effects
- **📱 Responsive Design**: Works seamlessly on both mobile and desktop devices
- **🔄 Camera Switching**: Toggle between front and back cameras on mobile
- **🎨 Beautiful UI**: Modern, minimal design with smooth animations
- **🌙 Dark Mode**: Automatic dark/light theme based on system preference
- **🔒 Privacy First**: All processing happens locally in the browser

## 🏗️ Project Structure

```
src/
├── components/
│   ├── PoseDetector/           # Main pose detection component
│   │   ├── PoseDetector.jsx    # Video feed and canvas overlay
│   │   ├── DetectorControls.jsx # Start/stop and camera controls
│   │   ├── StatusIndicator.jsx # Detection status display
│   │   ├── EmotionIndicator.jsx # Facial emotion emoji display
│   │   └── FaceMesh.jsx        # Face landmark visualization
│   ├── icons/                  # SVG icon components
│   ├── ErrorBoundary.jsx       # Error handling wrapper
│   └── Particles.jsx           # Animated background
├── hooks/
│   ├── usePoseDetection.js     # MediaPipe pose integration hook
│   └── useFaceExpression.js    # MediaPipe face expression hook
├── constants/
│   ├── camera.js               # Camera configuration
│   ├── pose.js                 # Pose detection settings
│   └── face.js                 # Face detection settings
├── utils/
│   ├── poseHelpers.js          # Camera and device utilities
│   └── frameBuster.js          # Security utility
├── App.jsx                     # Root component
├── main.jsx                    # Entry point
└── main.css                    # Global styles & themes
```

## 🛠️ Tech Stack

- **Core**: React 19, Vite 7
- **AI/ML**: @mediapipe/tasks-vision (PoseLandmarker, FaceLandmarker)
- **Styling**: Tailwind CSS 4, DaisyUI 5
- **Tools**: Biome (lint & format)

## 📦 Quick Start

```bash
# Clone the repository
git clone https://github.com/sumitsahoo/mediapipe-pose-estimation.git
cd mediapipe-pose-estimation

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Use

1. **Start Detection**: Click the camera button to begin pose and face detection
2. **Position Yourself**: Stand in view of the camera (full body works best for pose)
3. **View Skeleton**: Watch as your body landmarks are tracked in real-time
4. **See Your Emotion**: Your facial expression is analyzed and shown as an emoji (😊 😢 😠 😐)
5. **Face Mesh**: Facial landmarks are visualized with glowing overlay effects
6. **Switch Camera**: On mobile, use the rotate button to switch cameras
7. **Stop Detection**: Click the stop button to end the session

## ⚙️ Configuration

### Camera Settings

Adjust camera resolution in `src/constants/camera.js`:

```javascript
export const MOBILE_CAMERA_SETTINGS = {
  height: { ideal: 720 },
  width: { ideal: 1280 },
};
```

### Pose Detection Settings

Customize detection parameters in `src/constants/pose.js`:

```javascript
export const POSE_CONFIG = {
  numPoses: 1,
  minPoseDetectionConfidence: 0.5,
  minPosePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
};
```

### Drawing Styles

Modify skeleton visualization in `src/constants/pose.js`:

```javascript
export const DRAWING_STYLES = {
  landmarkColor: "#5dd4c0",
  landmarkRadius: 5,
  connectionColor: "#8de67c",
  connectionWidth: 3,
};
```

### Face Detection Settings

Customize face detection in `src/constants/face.js`:

```javascript
export const FACE_CONFIG = {
  numFaces: 1,
  minFaceDetectionConfidence: 0.5,
  minFacePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
  outputFaceBlendshapes: true,
};
```

## 🌐 Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

Requires:
- WebGL support
- WebAssembly support
- getUserMedia API (camera access)

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |
| `npm run check` | Run all Biome checks |

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Base path for deployment (use "/" for root)
VITE_APP_BASE_PATH=/
```

## 🙏🏻 Attributions

- [MediaPipe](https://ai.google.dev/edge/mediapipe) - ML solutions by Google
- [DaisyUI](https://daisyui.com/) - Tailwind CSS components
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## 📜 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using MediaPipe and React
