import { memo, useEffect, useRef } from "react";
import { DrawingUtils, FaceLandmarker } from "@mediapipe/tasks-vision";
import { EMOTIONS } from "../../constants/face";

/** Face mesh color palette */
const COLORS = {
    mesh: "rgba(93, 212, 192, 0.05)",       // Very subtle teal mesh
    contour: "rgba(93, 212, 192, 0.4)",     // Soft teal contours
    eye: "#3dd9c1",                          // Bright teal for eyes
    eyebrow: "rgba(141, 230, 124, 0.8)",    // Soft green for brows
    lip: "rgba(93, 212, 192, 0.6)",         // Teal lips
    oval: "rgba(93, 212, 192, 0.2)",        // Subtle face outline
};

/**
 * FaceMesh visualization component
 * Draws facial landmarks using MediaPipe DrawingUtils with glow effects
 */
const FaceMesh = ({ faceLandmarks, emotion, videoRef, isDetecting }) => {
    const canvasRef = useRef(null);
    const drawingUtilsRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !videoRef?.current || !isDetecting) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext("2d");

        // Match canvas size to video
        if (video.videoWidth && video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        // Initialize DrawingUtils once
        if (!drawingUtilsRef.current) {
            drawingUtilsRef.current = new DrawingUtils(ctx);
        }

        const draw = drawingUtilsRef.current;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!faceLandmarks?.length) return;

        // Get emotion-based iris color
        const irisColor = emotion?.type ? (EMOTIONS[emotion.type]?.color || COLORS.eye) : COLORS.eye;

        /**
         * Helper to draw connectors with optional glow effect
         */
        const drawFeature = (landmarks, config) => {
            const { color, lineWidth, glow = false, glowColor = color } = config;

            if (glow) {
                ctx.shadowColor = glowColor;
                ctx.shadowBlur = 6;
            }

            draw.drawConnectors(faceLandmarks, landmarks, { color, lineWidth });

            if (glow) {
                ctx.shadowBlur = 0;
            }
        };

        // Draw all facial features
        // Background mesh (very subtle)
        drawFeature(FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: COLORS.mesh, lineWidth: 0.3 });

        // Face outline
        drawFeature(FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: COLORS.oval, lineWidth: 1.5 });

        // Contours (nose, etc.)
        drawFeature(FaceLandmarker.FACE_LANDMARKS_CONTOURS, { color: COLORS.contour, lineWidth: 1 });

        // Eyebrows with glow
        drawFeature(FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: COLORS.eyebrow, lineWidth: 2.5, glow: true });
        drawFeature(FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: COLORS.eyebrow, lineWidth: 2.5, glow: true });

        // Eyes with glow
        drawFeature(FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: COLORS.eye, lineWidth: 2, glow: true });
        drawFeature(FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: COLORS.eye, lineWidth: 2, glow: true });

        // Irises with stronger glow (emotion-colored)
        ctx.shadowBlur = 12;
        drawFeature(FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: irisColor, lineWidth: 2.5, glow: true, glowColor: irisColor });
        drawFeature(FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: irisColor, lineWidth: 2.5, glow: true, glowColor: irisColor });
        ctx.shadowBlur = 0;

        // Lips with glow
        drawFeature(FaceLandmarker.FACE_LANDMARKS_LIPS, { color: COLORS.lip, lineWidth: 2, glow: true });

    }, [faceLandmarks, emotion, videoRef, isDetecting]);

    if (!isDetecting) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover z-26 pointer-events-none"
        />
    );
};

export default memo(FaceMesh);
