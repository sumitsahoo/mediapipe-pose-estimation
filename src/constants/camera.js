/**
 * Camera configuration constants
 * Device-specific camera settings for optimal pose detection
 */

/**
 * Camera facing modes
 * @constant {Object}
 */
export const FACING_MODE = {
	ENVIRONMENT: "environment",
	USER: "user",
};

/**
 * Default camera resolution settings (shared between mobile and desktop)
 * @constant {Object}
 */
const DEFAULT_RESOLUTION = {
	height: { ideal: 720 },
	width: { ideal: 1280 },
};

/**
 * Camera resolution settings for mobile devices
 * @constant {Object}
 */
export const MOBILE_CAMERA_SETTINGS = DEFAULT_RESOLUTION;

/**
 * Camera resolution settings for desktop devices
 * @constant {Object}
 */
export const DESKTOP_CAMERA_SETTINGS = DEFAULT_RESOLUTION;

/**
 * Camera constraint defaults
 * @constant {Object}
 */
export const CAMERA_DEFAULTS = {
	focusMode: "continuous",
	focusDistance: 0,
	exposureMode: "continuous",
	frameRate: { ideal: 30, max: 60 },
};

/**
 * Zoom levels for different camera modes
 * @constant {Object}
 */
export const ZOOM_LEVELS = {
	FRONT: 1,
	BACK: 1,
};

/**
 * Local storage key for camera ID
 * @constant {string}
 */
export const STORAGE_KEY_CAMERA_ID = "pose_camera_id";
