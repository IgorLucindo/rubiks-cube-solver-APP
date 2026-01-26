export class VideoCapture {
    constructor(videoId, canvasId) {
        this.video = document.getElementById(videoId);
        this.canvasId = canvasId;
        
        // State flags
        this.isRunning = false;

        // OpenCV Objects (Initialize as null)
        this.cap = null;
        this.src = null;
        this.dst = null;
        
        // Processing Helpers
        this.gray = null;
        this.blurred = null;
        this.edges = null;
        this.contours = null;
        this.hierarchy = null;
        this.approx = null;

        // Bind the processing loop to 'this' context
        this.processLoop = this.processLoop.bind(this);
    }


    start() {
        document.getElementById('status').innerHTML = "Requesting Camera Access...";
        
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
                this.video.srcObject = stream;
                this.video.play();
                
                // Initialize OpenCV objects once video metadata (dimensions) is loaded
                this.video.onloadedmetadata = () => {
                    this.initOpenCvObjects();
                    this.isRunning = true;
                    this.processLoop();
                };
            })
            .catch((err) => {
                console.error("Camera Error:", err);
                document.getElementById('status').innerHTML = "Error: " + err;
            });
    }


    initOpenCvObjects() {
        const width = this.video.videoWidth;
        const height = this.video.videoHeight;

        // Core Mats
        this.cap = new cv.VideoCapture(this.video);
        this.src = new cv.Mat(height, width, cv.CV_8UC4);
        this.dst = new cv.Mat(height, width, cv.CV_8UC4);

        // Helpers
        this.gray = new cv.Mat();
        this.blurred = new cv.Mat();
        this.edges = new cv.Mat();
        this.contours = new cv.MatVector();
        this.hierarchy = new cv.Mat();
        this.approx = new cv.Mat();

        document.getElementById('status').innerHTML = "Running... Show your cube!";
    }


    processLoop() {
        if (!this.isRunning) return;

        try {
            // 1. Capture Frame
            this.cap.read(this.src);

            // 2. Pre-process (Gray + Blur)
            cv.cvtColor(this.src, this.gray, cv.COLOR_RGBA2GRAY);
            cv.GaussianBlur(this.gray, this.blurred, {width: 5, height: 5}, 0);

            // 3. Detect Edges (Canny)
            cv.Canny(this.blurred, this.edges, 75, 200);

            // 4. Find Contours
            cv.findContours(this.edges, this.contours, this.hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

            // 5. Draw on output (Copy source to destination first)
            this.src.copyTo(this.dst);

            for (let i = 0; i < this.contours.size(); ++i) {
                let cnt = this.contours.get(i);
                let peri = cv.arcLength(cnt, true);
                
                // Approximate polygon
                cv.approxPolyDP(cnt, this.approx, 0.02 * peri, true);

                // Filter for squares (4 sides, convex, reasonable size)
                if (this.approx.rows === 4 && 
                    cv.isContourConvex(this.approx) && 
                    cv.contourArea(this.approx) > 1000) {
                    
                    // Draw red contour [255, 0, 0, 255]
                    cv.drawContours(this.dst, this.contours, i, [255, 0, 0, 255], 3);
                }
            }

            // 6. Display
            cv.imshow(this.canvasId, this.dst);

            // Loop
            requestAnimationFrame(this.processLoop);

        } catch (err) {
            console.error("OpenCV Error:", err);
            this.isRunning = false; // Stop loop on error
        }
    }

    
    stop() {
        this.isRunning = false;
        // Cleanup memory
        if (this.src) this.src.delete();
        if (this.dst) this.dst.delete();
        if (this.gray) this.gray.delete();
        if (this.blurred) this.blurred.delete();
        if (this.edges) this.edges.delete();
        if (this.contours) this.contours.delete();
        if (this.hierarchy) this.hierarchy.delete();
        if (this.approx) this.approx.delete();
    }
}