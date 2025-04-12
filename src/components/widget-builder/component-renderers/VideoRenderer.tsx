
import React from 'react';
import { WidgetComponent } from '@/types';

interface VideoRendererProps {
  component: WidgetComponent;
  finalProps: Record<string, any>;
}

const VideoRenderer: React.FC<VideoRendererProps> = ({ component, finalProps }) => {
  return (
    <div className="rounded overflow-hidden">
      <video
        src={finalProps.source}
        controls={finalProps.controls !== false}
        autoPlay={finalProps.autoplay === true}
        className="w-full"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoRenderer;
