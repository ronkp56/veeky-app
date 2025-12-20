/**
 * ./types/web.d.ts
 *
 * TypeScript declaration file for React Native Web compatibility.
 *
 * Purpose:
 * --------------------------------------------------------------------
 * This file extends TypeScript’s JSX type definitions to allow
 * usage of the native HTML <video> element inside .tsx files.
 *
 * Why this is required:
 * --------------------------------------------------------------------
 * • React Native projects normally do NOT include DOM elements
 * • React Native Web DOES support rendering <video>
 * • TypeScript needs explicit permission to accept it in JSX
 *
 * This file:
 * --------------------------------------------------------------------
 * ✔ Adds <video> to JSX.IntrinsicElements
 * ✔ Enables proper typing for video attributes (src, controls, etc.)
 * ✔ Prevents TypeScript compile errors on web builds
 *
 * Important notes:
 * --------------------------------------------------------------------
 * • This file affects TYPES ONLY (no runtime code)
 * • Safe to include even if app runs mostly on mobile
 * • Required for WebVideoFeed.tsx to compile correctly
 */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * Allow usage of <video> tag in JSX.
       *
       * React.DetailedHTMLProps ensures all standard
       * HTML video attributes are type-safe.
       */
      video: React.DetailedHTMLProps<
        React.VideoHTMLAttributes<HTMLVideoElement>,
        HTMLVideoElement
      >;
    }
  }
}

/**
 * This export is required so TypeScript treats this file
 * as a module and applies the global augmentation correctly.
 */
export {};
