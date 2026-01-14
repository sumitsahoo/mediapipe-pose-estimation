/**
 * Frame buster utility
 * Prevents the application from being loaded in an iframe for security
 */

if (window.self !== window.top) {
    window.top.location = window.self.location;
}
