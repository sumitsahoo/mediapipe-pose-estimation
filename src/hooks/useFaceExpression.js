/**
 * Custom hook for face expression detection using MediaPipe
 * Analyzes facial blendshapes to determine emotional expression
 *
 * @module useFaceExpression
 */

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { EMOTION_SMOOTHING, FACE_CONFIG, FACE_MODEL_URL } from "../constants/face";
import { WASM_CDN_URL } from "../constants/pose";

/** Detection loop interval in ms (~15fps) */
const DETECTION_INTERVAL = 66;

/** Initial delay before starting detection (ms) */
const DETECTION_START_DELAY = 1000;

/**
 * Convert blendshapes array to Map for O(1) lookups
 * @param {Array} blendshapes - MediaPipe blendshapes result
 * @returns {Map} Map of blendshape name to score
 */
const createBlendshapeMap = (blendshapes) => {
    if (!blendshapes?.[0]?.categories) return new Map();
    return new Map(blendshapes[0].categories.map(({ categoryName, score }) => [categoryName, score]));
};

/**
 * Get average of left/right blendshape pairs
 * @param {Map} bs - Blendshape map
 * @param {string} baseName - Base name without Left/Right suffix
 * @returns {number} Average score
 */
const getSymmetricAverage = (bs, baseName) => {
    const left = bs.get(`${baseName}Left`) || 0;
    const right = bs.get(`${baseName}Right`) || 0;
    return (left + right) / 2;
};

/**
 * Analyze blendshapes to determine dominant emotion
 * Uses weighted scoring across multiple facial markers
 *
 * @param {Array} blendshapes - MediaPipe blendshapes
 * @param {Object} prevScores - Previous emotion scores for smoothing
 * @returns {Object|null} Detected emotion with type, confidence, and scores
 */
const analyzeEmotion = (blendshapes, prevScores) => {
    if (!blendshapes?.length) return null;

    const bs = createBlendshapeMap(blendshapes);
    const get = (name) => bs.get(name) || 0;

    // Calculate symmetric averages for key facial features
    const smile = getSymmetricAverage(bs, "mouthSmile");
    const frown = getSymmetricAverage(bs, "mouthFrown");
    const browDown = getSymmetricAverage(bs, "browDown");
    const browOuterUp = getSymmetricAverage(bs, "browOuterUp");
    const eyeSquint = getSymmetricAverage(bs, "eyeSquint");
    const cheekSquint = getSymmetricAverage(bs, "cheekSquint");
    const noseSneer = getSymmetricAverage(bs, "noseSneer");
    const mouthPress = getSymmetricAverage(bs, "mouthPress");
    const mouthDimple = getSymmetricAverage(bs, "mouthDimple");
    const mouthStretch = getSymmetricAverage(bs, "mouthStretch");
    const mouthUpperUp = getSymmetricAverage(bs, "mouthUpperUp");
    const mouthLowerDown = getSymmetricAverage(bs, "mouthLowerDown");
    const eyeLookDown = getSymmetricAverage(bs, "eyeLookDown");
    const browInnerUp = get("browInnerUp");
    const mouthRollLower = get("mouthRollLower");
    const jawOpen = get("jawOpen");

    // Calculate raw emotion scores
    const rawScores = { happy: 0, sad: 0, angry: 0, neutral: 0 };

    // HAPPY: smile + cheek squint (Duchenne smile) + dimples
    if (smile > 0.2 || cheekSquint > 0.15) {
        rawScores.happy = smile * 2.0 + cheekSquint * 1.5 + mouthDimple * 0.8 + eyeSquint * 0.5 + mouthStretch * 0.3;
    }

    // SAD: inner brow raise + mouth frown + outer brow up
    if (browInnerUp > 0.15 || frown > 0.12 || (browOuterUp > 0.1 && frown > 0.08)) {
        rawScores.sad = browInnerUp * 2.0 + frown * 1.8 + browOuterUp * 1.0 + eyeLookDown * 0.6 + mouthLowerDown * 0.5 + mouthPress * 0.3;
    }

    // ANGRY: brow down + nose sneer + eye squint + mouth press
    if (browDown > 0.15 || noseSneer > 0.12 || (browDown > 0.1 && mouthPress > 0.15)) {
        rawScores.angry = browDown * 2.5 + noseSneer * 2.0 + eyeSquint * 0.8 + mouthPress * 0.8 + mouthUpperUp * 0.6 + mouthRollLower * 0.4 - jawOpen * 0.3;
    }

    // NEUTRAL: when all emotion indicators are low
    const maxScore = Math.max(rawScores.happy, rawScores.sad, rawScores.angry);
    const totalActivity = smile + frown + browDown + browInnerUp + noseSneer + cheekSquint;

    if (maxScore < 0.15 && totalActivity < 0.3) {
        rawScores.neutral = 1.0 - totalActivity;
    } else if (maxScore < 0.25) {
        rawScores.neutral = Math.max(0, 0.4 - maxScore);
    }

    // Apply temporal smoothing for stable output
    const smoothedScores = Object.fromEntries(
        Object.entries(rawScores).map(([key, value]) => [
            key,
            prevScores[key] * EMOTION_SMOOTHING + value * (1 - EMOTION_SMOOTHING),
        ])
    );

    // Find dominant emotion
    const [type, confidence] = Object.entries(smoothedScores).reduce(
        (max, curr) => (curr[1] > max[1] ? curr : max)
    );

    return { type, confidence, scores: smoothedScores };
};

/**
 * Custom hook for face expression detection
 *
 * @param {React.RefObject} videoRef - Reference to video element
 * @param {boolean} isDetecting - Whether detection is active
 * @returns {Object} { emotion, faceLandmarks, isInitialized }
 */
export const useFaceExpression = (videoRef, isDetecting) => {
    const [emotion, setEmotion] = useState(null);
    const [faceLandmarks, setFaceLandmarks] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const faceLandmarkerRef = useRef(null);
    const timeoutRef = useRef(null);
    const isActiveRef = useRef(false);
    const emotionScoresRef = useRef({ happy: 0, sad: 0, angry: 0, neutral: 0 });

    // Initialize FaceLandmarker on mount
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (faceLandmarkerRef.current) return;

            try {
                console.log("Initializing FaceLandmarker...");
                const vision = await FilesetResolver.forVisionTasks(WASM_CDN_URL);
                if (cancelled) return;

                const landmarker = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: { modelAssetPath: FACE_MODEL_URL, delegate: "GPU" },
                    runningMode: "VIDEO",
                    ...FACE_CONFIG,
                });

                if (cancelled) {
                    landmarker.close();
                    return;
                }

                faceLandmarkerRef.current = landmarker;
                setIsInitialized(true);
                console.log("FaceLandmarker initialized successfully");
            } catch (error) {
                console.error("Failed to initialize FaceLandmarker:", error);
            }
        };

        init();
        return () => { cancelled = true; };
    }, []);

    // Detection loop
    useEffect(() => {
        // Reset state when detection stops
        if (!isDetecting || !isInitialized) {
            isActiveRef.current = false;
            setEmotion(null);
            setFaceLandmarks(null);
            emotionScoresRef.current = { happy: 0, sad: 0, angry: 0, neutral: 0 };
            return;
        }

        isActiveRef.current = true;
        console.log("Starting face expression detection loop");

        const detect = () => {
            const video = videoRef.current;
            const landmarker = faceLandmarkerRef.current;

            if (!isActiveRef.current || !landmarker || !video) return;

            // Only process if video has valid data
            if (video.readyState >= 2 && video.videoWidth > 0) {
                try {
                    const results = landmarker.detectForVideo(video, performance.now());

                    // Update face landmarks
                    setFaceLandmarks(results.faceLandmarks?.[0] || null);

                    // Analyze emotion from blendshapes
                    if (results.faceBlendshapes?.length) {
                        const detected = analyzeEmotion(results.faceBlendshapes, emotionScoresRef.current);
                        if (detected) {
                            emotionScoresRef.current = detected.scores;
                            setEmotion(detected);
                        }
                    }
                } catch (error) {
                    console.error("Face detection error:", error);
                }
            }

            // Schedule next frame
            if (isActiveRef.current) {
                timeoutRef.current = setTimeout(detect, DETECTION_INTERVAL);
            }
        };

        // Start detection after delay to ensure video is ready
        timeoutRef.current = setTimeout(detect, DETECTION_START_DELAY);

        return () => {
            isActiveRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [isDetecting, isInitialized, videoRef]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            faceLandmarkerRef.current?.close();
            faceLandmarkerRef.current = null;
        };
    }, []);

    return { emotion, faceLandmarks, isInitialized };
};
