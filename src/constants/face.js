/**
 * Face detection configuration constants
 * Settings for MediaPipe face landmarker and expression detection
 */

/**
 * MediaPipe Face Landmarker model URL
 * @constant {string}
 */
export const FACE_MODEL_URL =
	"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

/**
 * Face landmarker configuration options
 * @constant {Object}
 */
export const FACE_CONFIG = {
	numFaces: 1,
	minFaceDetectionConfidence: 0.5,
	minFacePresenceConfidence: 0.5,
	minTrackingConfidence: 0.5,
	outputFaceBlendshapes: true,
	outputFacialTransformationMatrixes: false,
};

/**
 * Emotion types with display properties
 * Each emotion has an emoji, label, and theme colors
 * @constant {Object}
 */
export const EMOTIONS = {
	happy: {
		emoji: "😊",
		label: "Happy",
		color: "#8de67c",
	},
	sad: {
		emoji: "😢",
		label: "Sad",
		color: "#4db3ff",
	},
	angry: {
		emoji: "😠",
		label: "Angry",
		color: "#ff6b47",
	},
	neutral: {
		emoji: "😐",
		label: "Neutral",
		color: "#5dd4c0",
	},
};

/**
 * Smoothing factor for emotion transitions (0-1)
 * Lower = faster response, higher = smoother transitions
 * @constant {number}
 */
export const EMOTION_SMOOTHING = 0.3;
