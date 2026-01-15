import { useFaceExpression } from "../../hooks/useFaceExpression";
import { usePoseDetection } from "../../hooks/usePoseDetection";
import { isPhone } from "../../utils/poseHelpers";
import EmotionIndicator from "./EmotionIndicator";
import FaceMesh from "./FaceMesh";
import IconBody from "../icons/IconBody";
import DetectorControls from "./DetectorControls";
import StatusIndicator from "./StatusIndicator";

/**
 * Main PoseDetector component
 * Provides real-time pose estimation using MediaPipe
 * Displays video feed with skeleton overlay and facial expression detection
 */
const PoseDetector = () => {
	const {
		detectionState: { isDetecting, isLoading, landmarksDetected },
		videoRef,
		canvasRef,
		handleStartDetection,
		handleStopDetection,
		handleSwitchCamera,
	} = usePoseDetection();

	// Face expression detection with landmarks
	const { emotion, faceLandmarks } = useFaceExpression(videoRef, isDetecting);

	const isPhoneDevice = isPhone();

	return (
		<div className="relative w-full h-dvh flex justify-center items-center overflow-hidden backdrop-blur-none">
			{/* Video Feed Container */}
			<div className="absolute inset-0 flex justify-center items-center">
				{/* Placeholder icon when not detecting */}
				<IconBody className="absolute z-10 w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] text-primary opacity-30" />

				{/* Video element for camera feed */}
				<video
					title="Pose Detection Camera"
					ref={videoRef}
					autoPlay
					muted
					playsInline
					className="w-full h-full object-cover drop-shadow-xl relative z-20"
				/>

				{/* Canvas overlay for pose visualization */}
				<canvas
					ref={canvasRef}
					className="absolute inset-0 w-full h-full object-cover z-25 pointer-events-none"
					style={{
						transform: "scaleX(1)",
						objectFit: "cover",
					}}
				/>

				{/* Face mesh overlay */}
				<FaceMesh faceLandmarks={faceLandmarks} emotion={emotion} videoRef={videoRef} isDetecting={isDetecting} />
			</div>

			{/* Top Indicators Bar */}
			{isDetecting && (
				<div className="absolute top-4 left-0 right-0 z-30 px-4 safe-area-inset-top">
					<div className="flex items-start justify-between gap-3">
						{/* Status Indicator - left side */}
						<div className="flex-shrink-0">
							<StatusIndicator isDetecting={isDetecting} landmarksDetected={landmarksDetected} />
						</div>
						{/* Emotion Indicator - right side */}
						<div className="flex-shrink-0">
							<EmotionIndicator emotion={emotion} isDetecting={isDetecting} faceDetected={!!faceLandmarks} />
						</div>
					</div>
				</div>
			)}

			{/* Detection Glow Effect */}
			{isDetecting && landmarksDetected && (
				<div className="absolute inset-0 pointer-events-none z-15">
					<div className="absolute inset-0 border-4 border-success/30 rounded-lg animate-pulse-detection" />
				</div>
			)}

			{/* Control Buttons */}
			<DetectorControls
				isDetecting={isDetecting}
				isLoading={isLoading}
				shouldShowRotateButton={isDetecting && isPhoneDevice}
				onStart={handleStartDetection}
				onStop={handleStopDetection}
				onSwitchCamera={handleSwitchCamera}
			/>
		</div>
	);
};

export default PoseDetector;
