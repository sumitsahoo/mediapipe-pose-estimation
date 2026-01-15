import { memo, useEffect, useState } from "react";
import { EMOTIONS } from "../../constants/face";

/** Transition duration for emotion animation (ms) */
const ANIMATION_DURATION = 150;

/**
 * Emotion indicator component
 * Displays detected facial expression as an animated emoji
 *
 * @param {Object} props - Component props
 * @param {Object} props.emotion - Current emotion { type, confidence }
 * @param {boolean} props.isDetecting - Whether detection is active
 * @param {boolean} props.faceDetected - Whether a face is currently detected
 */
const EmotionIndicator = ({ emotion, isDetecting, faceDetected }) => {
	const [displayedEmotion, setDisplayedEmotion] = useState(null);
	const [isAnimating, setIsAnimating] = useState(false);

	// Handle emotion transitions with animation
	useEffect(() => {
		if (!emotion?.type || !faceDetected) return;

		// Animate if emotion type changed
		if (displayedEmotion?.type !== emotion.type) {
			setIsAnimating(true);
			const timeout = setTimeout(() => {
				setDisplayedEmotion(emotion);
				setIsAnimating(false);
			}, ANIMATION_DURATION);
			return () => clearTimeout(timeout);
		}

		setDisplayedEmotion(emotion);
	}, [emotion, displayedEmotion?.type, faceDetected]);

	// Reset when detection stops or face is lost
	useEffect(() => {
		if (!isDetecting || !faceDetected) {
			setDisplayedEmotion(null);
		}
	}, [isDetecting, faceDetected]);

	// Early return if nothing to show
	if (!isDetecting || !faceDetected) return null;

	const emotionToShow = displayedEmotion || emotion;
	const emotionData = emotionToShow?.type ? EMOTIONS[emotionToShow.type] : null;
	if (!emotionData) return null;

	const { emoji, label, color } = emotionData;

	return (
		<div className="animate-fade-in">
			<div
				className={`
                    flex flex-col items-center justify-center gap-1 p-2 rounded-2xl
                    min-w-[70px] md:min-w-[80px]
                    transition-all duration-300 ease-out
                    ${isAnimating ? "scale-90 opacity-70" : "scale-100 opacity-100"}
                `}
				style={{
					background: "rgba(0, 0, 0, 0.5)",
					backdropFilter: "blur(12px)",
					boxShadow: `0 0 20px ${color}40`,
				}}
			>
				{/* Emoji */}
				<span
					className={`
                        leading-none select-none block text-5xl md:text-6xl
                        transition-transform duration-300 ease-out
                        ${isAnimating ? "scale-50" : "scale-100"}
                    `}
					style={{
						filter: `drop-shadow(0 0 12px ${color}80)`,
					}}
				>
					{emoji}
				</span>

				{/* Label */}
				<span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
					{label}
				</span>
			</div>
		</div>
	);
};

export default memo(EmotionIndicator);
