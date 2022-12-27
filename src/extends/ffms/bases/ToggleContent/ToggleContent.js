import './ToggleContent.scss';
import React, { useEffect, useRef, useState } from 'react';
import { bool, node, any , string, number } from 'prop-types';
import { Transition } from 'react-transition-group';

const getElementHeight = (ref) =>
{
    return (ref && ref.current) ? ref.current.clientHeight : 0;
};

const getElementWidth = (ref) =>
{
    return (ref && ref.current) ? ref.current.getBoundingClientRect().width : 0;
};

const ToggleContent = ({ isVisible, children, anchorEl, className, duration }) =>
{
    const innerRef = useRef();
    const [height,setHeight] = useState();
    const [width,setWidth] = useState();

    useEffect(()=>
    {
        setHeight(getElementHeight(innerRef));
        setWidth(getElementWidth(anchorEl));
    }, [isVisible]);

    const transitionStyle = {
        transitionProperty: 'all',
        transitionTimingFunction: 'cubic-bezier(0, 1, 0.5, 1)',
        transition: `height ${duration / 1000}s`,
        overflow: 'hidden',
    };

    const transition = {
        entering: { ...transitionStyle,height },
        entered: { height: isVisible ? 'fit-content' : height },
        exiting: { ...transitionStyle, height: 0 },
        exited: { height: 0, overflow: 'hidden' },
    };


    return (
        <Transition
            in={isVisible}
            timeout={duration}
        >
            { state =>(
                <div style={{ width, ...transition[state] }}>
                    <div
                        ref={innerRef}
                        className={`${className || ''} toggle-content-cover`}
                    >
                        {children}
                    </div>
                </div>
            )}
        </Transition>
    );
};

ToggleContent.defaultProps = {
    isVisible: false,
    duration: 500,
};

ToggleContent.propTypes = {
    /** Should the component mount it's children and slide down */
    isVisible: bool.isRequired,
    /** The slider content elements */
    children: node.isRequired,
    /** Container ref */
    anchorEl: any,
    /** ClassName element */
    className: string,
    /** Time effect */
    duration: number,
};

export default ToggleContent;
