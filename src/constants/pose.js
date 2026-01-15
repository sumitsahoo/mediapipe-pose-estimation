/**
 * Pose detection configuration constants
 * Settings for MediaPipe pose landmarker
 */

/**
 * MediaPipe model URL
 * Using the lite model for better performance on web
 * @constant {string}
 */
export const POSE_MODEL_URL =
	"https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

/**
 * MediaPipe WASM files CDN URL
 * @constant {string}
 */
export const WASM_CDN_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

/**
 * Canvas 2D context options optimized for frequent reading
 * @constant {Object}
 */
export const CANVAS_CONTEXT_OPTIONS = {
	willReadFrequently: true,
	alpha: true,
	desynchronized: true,
};

/**
 * Pose landmarker configuration
 * @constant {Object}
 */
export const POSE_CONFIG = {
	numPoses: 1,
	minPoseDetectionConfidence: 0.5,
	minPosePresenceConfidence: 0.5,
	minTrackingConfidence: 0.5,
	outputSegmentationMasks: false,
};

/**
 * Detection interval in milliseconds
 * @constant {number}
 */
export const DETECTION_INTERVAL_MS = 33; // ~30fps

/**
 * Pose landmark connections for drawing skeleton
 * Based on MediaPipe's POSE_CONNECTIONS
 * @constant {Array<[number, number]>}
 */
export const POSE_CONNECTIONS = [
	// Face
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 7],
	[0, 4],
	[4, 5],
	[5, 6],
	[6, 8],
	// Torso
	[9, 10],
	[11, 12],
	[11, 23],
	[12, 24],
	[23, 24],
	// Left arm
	[11, 13],
	[13, 15],
	[15, 17],
	[15, 19],
	[15, 21],
	[17, 19],
	// Right arm
	[12, 14],
	[14, 16],
	[16, 18],
	[16, 20],
	[16, 22],
	[18, 20],
	// Left leg
	[23, 25],
	[25, 27],
	[27, 29],
	[27, 31],
	[29, 31],
	// Right leg
	[24, 26],
	[26, 28],
	[28, 30],
	[28, 32],
	[30, 32],
];

/**
 * Landmark names for reference
 * @constant {string[]}
 */
export const LANDMARK_NAMES = [
	"nose",
	"left_eye_inner",
	"left_eye",
	"left_eye_outer",
	"right_eye_inner",
	"right_eye",
	"right_eye_outer",
	"left_ear",
	"right_ear",
	"mouth_left",
	"mouth_right",
	"left_shoulder",
	"right_shoulder",
	"left_elbow",
	"right_elbow",
	"left_wrist",
	"right_wrist",
	"left_pinky",
	"right_pinky",
	"left_index",
	"right_index",
	"left_thumb",
	"right_thumb",
	"left_hip",
	"right_hip",
	"left_knee",
	"right_knee",
	"left_ankle",
	"right_ankle",
	"left_heel",
	"right_heel",
	"left_foot_index",
	"right_foot_index",
];

/**
 * Drawing styles for pose visualization
 * @constant {Object}
 */
export const DRAWING_STYLES = {
	landmarkColor: "#5dd4c0",
	landmarkRadius: 5,
	connectionColor: "#8de67c",
	connectionWidth: 3,
	confidenceThreshold: 0.5,
};
