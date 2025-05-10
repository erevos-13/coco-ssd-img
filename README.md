# Face Detection with React, TensorFlow.js, and Webcam

This project is a React application that performs real-time face detection using your webcam. It leverages [TensorFlow.js](https://www.tensorflow.org/js) and the [MediaPipe Face Detector](https://github.com/tensorflow/tfjs-models/tree/master/face-detection) model to identify faces in the video stream and draw bounding boxes around them.

> **Note:** This project can also be easily extended to use the [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) model from TensorFlow.js for general object detection.

## What is COCO-SSD?

**COCO-SSD** (Single Shot MultiBox Detector trained on the COCO dataset) is a real-time object detection model available in TensorFlow.js. It can detect and localize multiple objects in images or video streams, such as people, cars, animals, and more. The model is pre-trained on the [COCO dataset](https://cocodataset.org/), which contains over 300,000 images and 80 object categories. Using COCO-SSD, you can build applications that recognize and draw bounding boxes around a wide variety of objects, not just faces.

## Features

- Real-time face detection using your device's webcam
- Bounding boxes drawn on detected faces
- Start and stop webcam controls
- Built with React and Vite for fast development

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/coco-ssd-img.git
   cd coco-ssd-img
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App

Start the development server:

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Click "Start Camera" to begin face detection.

## Project Structure

- `src/App.jsx` — Main React component handling webcam, face detection, and UI.
- `src/utils.js` — Utility functions for drawing and webcam management.
- `src/App.css` — Basic styles for the app.

## How It Works

- Loads the MediaPipe Face Detector model from TensorFlow.js.
- Starts the webcam and streams video to a `<video>` element.
- Runs face detection on each video frame and draws bounding boxes on a `<canvas>` overlay.

## Acknowledgements

- [TensorFlow.js](https://www.tensorflow.org/js)
- [MediaPipe Face Detection Model](https://github.com/tensorflow/tfjs-models/tree/master/face-detection)
- [COCO-SSD Model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)

## License

MIT
