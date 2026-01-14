/**
 * Base SVG icon wrapper component
 * Provides consistent styling and accessibility for all icons
 */
const Icon = ({
    title,
    className = "",
    children,
    viewBox = "0 0 24 24",
    ...props
}) => (
    <svg
        viewBox={viewBox}
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <title>{title}</title>
        {children}
    </svg>
);

export default Icon;
