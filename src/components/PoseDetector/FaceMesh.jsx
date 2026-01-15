import { memo, useCallback, useEffect, useRef } from "react";
import { DrawingUtils, FaceLandmarker } from "@mediapipe/tasks-vision";
import { EMOTIONS } from "../../constants/face";

/** Face mesh color palette */
const COLORS = {
	mesh: "rgba(93, 212, 192, 0.05)", // Very subtle teal mesh
	contour: "rgba(93, 212, 192, 0.4)", // Soft teal contours
	eye: "#3dd9c1", // Bright teal for eyes
	eyebrow: "rgba(141, 230, 124, 0.8)", // Soft green for brows
	lip: "rgba(93, 212, 192, 0.6)", // Teal lips
	oval: "rgba(93, 212, 192, 0.2)", // Subtle face outline
};

/** Face landmark sets for drawing */
const FACE_FEATURES = [
	{ landmarks: FaceLandmarker.FACE_LANDMARKS_TESSELATION, color: COLORS.mesh, lineWidth: 0.3 },
	{ landmarks: FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, color: COLORS.oval, lineWidth: 1.5 },
	{ landmarks: FaceLandmarker.FACE_LANDMARKS_CONTOURS, color: COLORS.contour, lineWidth: 1 },
	{ landmarks: FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, color: COLORS.eyebrow, lineWidth: 2.5, glow: true },
	{ landmarks: FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, color: COLORS.eyebrow, lineWidth: 2.5, glow: true },
	{ landmarks: FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, color: COLORS.eye, lineWidth: 2, glow: true },
	{ landmarks: FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, color: COLORS.eye, lineWidth: 2, glow: true },
	{ landmarks: FaceLandmarker.FACE_LANDMARKS_LIPS, color: COLORS.lip, lineWidth: 2, glow: true },
];

/**
 * FaceMesh visualization component
 * Draws facial landmarks using MediaPipe DrawingUtils with glow effects
 */
const FaceMesh = ({ faceLandmarks, emotion, videoRef, isDetecting }) => {
	const canvasRef = useRef(null);
	const ctxRef = useRef(null);
	const drawingUtilsRef = useRef(null);

	/**
	 * Sync canvas dimensions with video element
	 * Returns true if canvas is ready for drawing
	 */
	const syncCanvasSize = useCallback(() => {
		const canvas = canvasRef.current;
		const video = videoRef?.current;
		if (!canvas || !video) return false;

		const { videoWidth, videoHeight } = video;
		if (!videoWidth || !videoHeight) return false;

		// Only resize if dimensions changed (avoids clearing canvas unnecessarily)
		if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
			canvas.width = videoWidth;
			canvas.height = videoHeight;
			// Reset context and drawing utils after resize
			ctxRef.current = canvas.getContext("2d");
			drawingUtilsRef.current = ctxRef.current ? new DrawingUtils(ctxRef.current) : null;
		}

		return !!ctxRef.current && !!drawingUtilsRef.current;
	}, [videoRef]);

	// Initialize canvas context when component mounts or detection starts
	useEffect(() => {
		if (!isDetecting || !canvasRef.current) return;

		const canvas = canvasRef.current;
		ctxRef.current = canvas.getContext("2d");
		if (ctxRef.current) {
			drawingUtilsRef.current = new DrawingUtils(ctxRef.current);
		}

		return () => {
			// Clear canvas when detection stops
			if (ctxRef.current && canvas) {
				ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
			}
		};
	}, [isDetecting]);

	// Draw face landmarks when they update
	useEffect(() => {
		if (!isDetecting) return;

		// Ensure canvas is properly sized
		if (!syncCanvasSize()) return;

		const ctx = ctxRef.current;
		const draw = drawingUtilsRef.current;
		const canvas = canvasRef.current;

		if (!ctx || !draw || !canvas) return;

		// Clear previous frame
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Exit if no landmarks to draw
		if (!faceLandmarks?.length) return;

		// Get emotion-based iris color
		const irisColor = emotion?.type ? EMOTIONS[emotion.type]?.color || COLORS.eye : COLORS.eye;

		// Draw all static facial features
		for (const { landmarks, color, lineWidth, glow } of FACE_FEATURES) {
			if (glow) {
				ctx.shadowColor = color;
				ctx.shadowBlur = 6;
			}
			draw.drawConnectors(faceLandmarks, landmarks, { color, lineWidth });
			if (glow) {
				ctx.shadowBlur = 0;
			}
		}

		// Draw irises with stronger glow (emotion-colored)
		ctx.shadowColor = irisColor;
		ctx.shadowBlur = 12;
		draw.drawConnectors(faceLandmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: irisColor, lineWidth: 2.5 });
		draw.drawConnectors(faceLandmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: irisColor, lineWidth: 2.5 });
		ctx.shadowBlur = 0;
	}, [faceLandmarks, emotion, isDetecting, syncCanvasSize]);

	if (!isDetecting) return null;

	return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-[26] pointer-events-none" />;
};

export default memo(FaceMesh);
