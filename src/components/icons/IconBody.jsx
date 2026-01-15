import Icon from "./Icon";

/**
 * Body/pose icon
 * Represents human body pose detection
 */
const IconBody = (props) => (
	<Icon title="Body Pose Icon" {...props}>
		{/* Background circles */}
		<circle cx="12" cy="12" r="10.8" fill="#4db8a8" opacity="0.2" />
		<circle cx="12" cy="12" r="8.4" fill="#4db8a8" opacity="0.3" />
		{/* Head */}
		<circle cx="12" cy="6" r="1.92" fill="#4db8a8" />
		{/* Body */}
		<line x1="12" y1="7.92" x2="12" y2="13.2" stroke="#4db8a8" strokeWidth="0.96" strokeLinecap="round" />
		{/* Arms */}
		<line x1="12" y1="9.6" x2="7.2" y2="12" stroke="#7bc96f" strokeWidth="0.96" strokeLinecap="round" />
		<line x1="12" y1="9.6" x2="16.8" y2="12" stroke="#7bc96f" strokeWidth="0.96" strokeLinecap="round" />
		{/* Legs */}
		<line x1="12" y1="13.2" x2="8.4" y2="19.2" stroke="#4db8a8" strokeWidth="0.96" strokeLinecap="round" />
		<line x1="12" y1="13.2" x2="15.6" y2="19.2" stroke="#4db8a8" strokeWidth="0.96" strokeLinecap="round" />
		{/* Joint dots */}
		<circle cx="12" cy="9.6" r="0.72" fill="#7bc96f" />
		<circle cx="7.2" cy="12" r="0.72" fill="#7bc96f" />
		<circle cx="16.8" cy="12" r="0.72" fill="#7bc96f" />
		<circle cx="12" cy="13.2" r="0.72" fill="#7bc96f" />
		<circle cx="8.4" cy="19.2" r="0.72" fill="#7bc96f" />
		<circle cx="15.6" cy="19.2" r="0.72" fill="#7bc96f" />
	</Icon>
);

export default IconBody;
