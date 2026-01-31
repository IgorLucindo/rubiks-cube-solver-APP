import { VideoCapture } from "./classes/video_capture.js";
import { VirtualCube } from "./classes/virtual_cube.js";


const videoCap = new VideoCapture('videoInput', 'canvasOutput');
const virtualCube = new VirtualCube();


function mainLoop() {
    // Get State from Cube
    const expectedColor = virtualCube.getExpectedCenterColor();
    const isComplete = virtualCube.isComplete();

    // Pass State to Camera
    const faceColors = videoCap.loop(expectedColor, isComplete);

    // Update Cube Logic
    virtualCube.loop(faceColors);

    requestAnimationFrame(mainLoop);
}


// Startup Sequence
window.cvReady.then(() => {
    console.log("OpenCV Ready. Initializing...");
    videoCap.start().then(() => {
        console.log("Camera Started. Beginning Global Loop.");
        mainLoop();
    }).catch(err => {
        console.error("Failed to start camera:", err);
    });
});