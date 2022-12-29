import 'plyr/dist/plyr.css';
import './VideoPlayer.scss';
import React from 'react';
import Plyr from 'plyr';
export declare type HTMLPlyrVideoElement = HTMLVideoElement & {
    plyr?: Plyr;
};
export interface VideoPlayerProps {
    id: string;
    options?: Plyr.Options;
    source: Plyr.SourceInfo;
}
export declare const VideoPlayer: (props: VideoPlayerProps) => React.ReactElement;
//# sourceMappingURL=VideoPlayer.d.ts.map