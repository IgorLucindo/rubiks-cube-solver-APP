import { VideoCapture } from "./classes/video_capture.js";


// Define the startup function
function startApp() {
    console.log("OpenCV is ready. Starting App...");
    // Instantiate the class with the IDs of your video and canvas elements
    const videoCap = new VideoCapture('videoInput', 'canvasOutput');
    videoCap.start();
    
    // Optional: Handle cleanup when user closes tab
    window.onunload = () => videoCap.stop();
}


// 1. Attach to window so the HTML script tag can call it
window._onOpenCvReady = startApp;

// 2. Fallback: If OpenCV loaded faster than this module, 'onload' might have missed.
// Check if 'cv' is already defined globally.
if (typeof cv !== 'undefined' && cv.Mat) {
    startApp();
}