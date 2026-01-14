import Icon from "./Icon";

/**
 * Body/pose icon
 * Represents human body pose detection
 */
const IconBody = (props) => (
    <Icon title="Body Pose Icon" {...props}>
        <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path
            d="M12 7V12M12 12L8 16M12 12L16 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8 10H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path
            d="M8 16V21M16 16V21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </Icon>
);

export default IconBody;
