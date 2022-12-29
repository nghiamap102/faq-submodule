import 'plyr/dist/plyr.css';
import './VideoPlayer.scss';

import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';

export type HTMLPlyrVideoElement = HTMLVideoElement & { plyr?: Plyr }

export interface VideoPlayerProps {
    id: string,
    options?: Plyr.Options,
    source: Plyr.SourceInfo,
}

export const VideoPlayer = (props: VideoPlayerProps) : React.ReactElement =>
{
    const { source } = props;

    const innerRef = useRef<HTMLPlyrVideoElement>(null);

    useEffect(() =>
    {
        if (!innerRef.current)
        {
            return;
        }

        if (!innerRef.current?.plyr)
        {
            innerRef.current.plyr = new Plyr('.js-plyr', { ...defaultVideoPlayerOptions, ...props.options });
        }
  
        if (innerRef.current && source)
        {
            innerRef.current.plyr.source = source;
        }

    }, [innerRef, props.options, props.source]);
    return (
        <video
            ref={innerRef}
            className="js-plyr plyr"
        />
    );
};

const defaultVideoPlayerOptions: Plyr.Options = {
    controls: [
        'rewind',
        'play',
        'play-large',
        'fast-forward',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'captions',
        'settings',
        'fullscreen',
        'pip',
        'airplay',
        'fullscreen',
    ],
    seekTime: 5,
    i18n: {
        restart: 'Restart',
        rewind: 'Rewind {seektime}s',
        play: 'Play',
        pause: 'Pause',
        fastForward: 'Forward {seektime}s',
        seek: 'Seek',
        seekLabel: '{currentTime} of {duration}',
        played: 'Played',
        buffered: 'Buffered',
        currentTime: 'Current time',
        duration: 'Duration',
        volume: 'Volume',
        mute: 'Mute',
        unmute: 'Unmute',
        enableCaptions: 'Enable captions',
        disableCaptions: 'Disable captions',
        download: 'Download',
        enterFullscreen: 'Enter fullscreen',
        exitFullscreen: 'Exit fullscreen',
        frameTitle: 'Player for {title}',
        captions: 'Captions',
        settings: 'Settings',
        menuBack: 'Go back to previous menu',
        speed: 'Speed',
        normal: 'Normal',
        quality: 'Quality',
        loop: 'Loop',
    },
};
