/**
 * Utility functions for pose detection and camera management
 * @module poseHelpers
 */

import {
    CAMERA_DEFAULTS,
    DESKTOP_CAMERA_SETTINGS,
    FACING_MODE,
    MOBILE_CAMERA_SETTINGS,
    STORAGE_KEY_CAMERA_ID,
    ZOOM_LEVELS,
} from "../constants/camera";

/**
 * Detect if the current device is a mobile phone or tablet
 * @returns {boolean} True if device is a phone/tablet
 */
export const isPhone = () =>
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/**
 * Determine the best rear camera for detection based on various criteria
 * Prioritizes: main/wide camera > highest resolution
 * @returns {Promise<string|null>} Device ID of the best rear camera or null
 */
export const getBestRearCamera = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");

    if (videoDevices.length === 0) return null;
    if (videoDevices.length === 1) return videoDevices[0].deviceId;

    let bestCamera = null;
    let bestScore = -1;

    for (const device of videoDevices) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: device.deviceId } },
            });

            const videoTrack = stream.getVideoTracks()[0];
            const capabilities = videoTrack.getCapabilities();
            const settings = videoTrack.getSettings();

            // Stop the stream immediately
            for (const track of stream.getTracks()) {
                track.stop();
            }

            // Skip front-facing cameras
            if (settings.facingMode === "user") continue;

            let score = 0;
            const label = device.label.toLowerCase();

            // Priority 1: Identify main/wide camera by label
            if (
                label.includes("back camera") &&
                !label.includes("ultra") &&
                !label.includes("telephoto")
            ) {
                score += 100;
            } else if (label.includes("wide") && !label.includes("ultra")) {
                score += 90;
            } else if (label.includes("camera 0") || label.includes("main")) {
                score += 80;
            }

            // Priority 2: Resolution
            if (capabilities?.width?.max && capabilities?.height?.max) {
                const resolution = capabilities.width.max * capabilities.height.max;
                score += Math.min(resolution / 1000000, 20);
            }

            if (score > bestScore) {
                bestScore = score;
                bestCamera = device.deviceId;
            }
        } catch (error) {
            console.warn(`Could not access camera: ${device.label}`, error);
        }
    }

    return bestCamera;
};

/**
 * Get best rear camera ID from localStorage or detect it
 * Caches the result in localStorage for future use
 * @returns {Promise<string|null>} Cached or newly detected camera ID
 */
export const getAndSetCameraId = async () => {
    let cameraId = localStorage.getItem(STORAGE_KEY_CAMERA_ID);
    if (!cameraId) {
        cameraId = await getBestRearCamera();
        if (cameraId) {
            localStorage.setItem(STORAGE_KEY_CAMERA_ID, cameraId);
        }
    }
    return cameraId;
};

/**
 * Get optimized media constraints for camera access
 * Automatically adjusts settings based on device type and facing mode
 * @param {string} facingMode - Camera facing mode ('user' or 'environment')
 * @returns {Promise<MediaStreamConstraints>} Media constraints object
 */
export const getMediaConstraints = async (facingMode) => {
    const baseSettings = isPhone()
        ? MOBILE_CAMERA_SETTINGS
        : DESKTOP_CAMERA_SETTINGS;

    const customConstraints = {
        audio: false,
        video: {
            ...baseSettings,
            ...CAMERA_DEFAULTS,
            facingMode,
            zoom:
                facingMode === FACING_MODE.USER ? ZOOM_LEVELS.FRONT : ZOOM_LEVELS.BACK,
        },
    };

    // For back camera on mobile, try to use best camera
    if (facingMode === FACING_MODE.ENVIRONMENT && isPhone()) {
        const cameraId = await getAndSetCameraId();
        if (cameraId) {
            customConstraints.video.deviceId = cameraId;
        }
    }

    return customConstraints;
};

/**
 * Stop all media tracks in a stream
 * @param {MediaStream} stream - MediaStream to stop
 */
export const stopAllTracks = (stream) => {
    for (const track of stream?.getTracks() ?? []) track.stop();
};

/**
 * Check if browser supports MediaPipe and getUserMedia
 * @returns {Object} Support status and missing features
 */
export const checkBrowserSupport = () => {
    const support = {
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        webGL: (() => {
            try {
                const canvas = document.createElement("canvas");
                return !!(
                    window.WebGLRenderingContext &&
                    (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
                );
            } catch {
                return false;
            }
        })(),
        wasm: typeof WebAssembly === "object",
    };

    return {
        isSupported: support.getUserMedia && support.webGL && support.wasm,
        support,
    };
};
