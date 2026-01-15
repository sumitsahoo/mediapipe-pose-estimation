import { memo } from "react";

/**
 * Status indicator component
 * Shows the current detection state and landmark count
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isDetecting - Whether detection is active
 * @param {boolean} props.landmarksDetected - Whether landmarks are currently detected
 */
const StatusIndicator = ({ isDetecting, landmarksDetected }) => {
	if (!isDetecting) return null;

	return (
		<div
			className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
				landmarksDetected ? "bg-success/20 border border-success/30" : "bg-base-100/20 border border-white/10"
			}`}
		>
			{/* Pulsing indicator dot */}
			<div
				className={`w-2 h-2 rounded-full ${
					landmarksDetected ? "bg-success animate-pulse" : "bg-warning animate-pulse"
				}`}
			/>
			<span className={`text-sm font-medium ${landmarksDetected ? "text-success" : "text-white/80"}`}>
				{landmarksDetected ? "Pose Detected" : "Searching..."}
			</span>
		</div>
	);
};

export default memo(StatusIndicator);
