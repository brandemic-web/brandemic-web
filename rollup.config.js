/**
 * Rollup Configuration
 * 
 * Bundles all ES modules into a single IIFE (Immediately Invoked Function Expression)
 * that can be used directly in Webflow or any CDN.
 */

import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/main.js',
            format: 'iife', // Immediately Invoked Function Expression - works in browser
            name: 'BrandemicAnimations',
            sourcemap: false,
            banner: `/**
 * Brandemic - Custom Animations
 * Version: 1.0.0
 * Built: ${new Date().toISOString()}
 * 
 * This file is auto-generated from modular source code.
 * Do not edit directly - edit the source files in /src instead.
 */`
        },
        {
            file: 'dist/main.min.js',
            format: 'iife',
            name: 'BrandemicAnimations',
            sourcemap: false,
            plugins: [terser()],
            banner: `/* Brandemic - Minified */`
        }
    ],
    plugins: [
        resolve()
    ],
    // Mark external dependencies that are loaded via CDN
    external: [],
    // Treat global variables as external
    onwarn(warning, warn) {
        // Skip warnings about undefined globals (they're loaded via CDN)
        if (warning.code === 'MISSING_GLOBAL_NAME') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
    }
};

