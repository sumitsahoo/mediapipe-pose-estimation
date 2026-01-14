import Particles from "./components/Particles";
import PoseDetector from "./components/PoseDetector";

/**
 * Main App component
 * Renders the pose detection interface with animated background
 */
const App = () => (
    <div className="App h-dvh w-full overflow-hidden">
        {/* Animated particle background */}
        <Particles />
        {/* Main pose detection component */}
        <PoseDetector />
    </div>
);

export default App;
