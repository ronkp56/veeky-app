declare global {
  namespace JSX {
    interface IntrinsicElements {
      video: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
    }
  }
}

export {};