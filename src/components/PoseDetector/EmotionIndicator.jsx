import { memo, useEffect, useState } from "react";
import { EMOTIONS } from "../../constants/face";

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
            }, 150);
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

    return (
        <div className="absolute top-6 right-6 z-30 animate-fade-in">
            <div
                className={`
                    flex flex-col items-center gap-1 p-3 rounded-2xl
                    transition-all duration-300 ease-out
                    ${isAnimating ? "scale-90 opacity-70" : "scale-100 opacity-100"}
                `}
                style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 0 20px ${emotionData.color}40`,
                }}
            >
                {/* Emoji */}
                <span
                    className={`
                        leading-none select-none block
                        transition-transform duration-300 ease-out
                        ${isAnimating ? "scale-50" : "scale-100"}
                    `}
                    style={{
                        fontSize: "4rem",
                        filter: `drop-shadow(0 0 12px ${emotionData.color}80)`,
                    }}
                >
                    {emotionData.emoji}
                </span>

                {/* Label */}
                <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: emotionData.color }}
                >
                    {emotionData.label}
                </span>
            </div>
        </div>
    );
};

export default memo(EmotionIndicator);
