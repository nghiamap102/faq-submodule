import './PopperTooltip.scss';
import 'react-popper-tooltip/dist/styles.css';
import React from 'react';
import 'react-popper-tooltip/dist/styles.css';
import TooltipTrigger from 'react-popper-tooltip';
import PropTypes from 'prop-types';
import { T } from '@vbd/vui';
 
const PopperTooltip = ({ children, tooltip, hideArrow, tag, tagClassName, className, ...props }) =>
{
    const CustomTag = `${tag ?? 'span'}`;
    return (
        tooltip ?
            <TooltipTrigger
                {...props}
                tooltip={({
                    arrowRef,
                    tooltipRef,
                    getArrowProps,
                    getTooltipProps,
                    placement,
                }) => (
                    <div
                        {...getTooltipProps({
                            ref: tooltipRef,
                            className: `${className || ''} popper-tooltip-container`,
                        })}
                    >
                        {!hideArrow && (
                            <div
                                {...getArrowProps({
                                    ref: arrowRef,
                                    className: 'tooltip-arrow',
                                    'data-placement': placement,
                                })}
                            />
                        )}
                        <T>{tooltip}</T>
                    </div>
                )}
            >
                {({ getTriggerProps, triggerRef }) => (
                    <CustomTag
                        {...getTriggerProps({
                            ref: triggerRef,
                            className: 'trigger',
                        })}
                        className={tagClassName}
                    >
                        <T>{children}</T>
                    </CustomTag>
                )}
            </TooltipTrigger> : children
    );
};

PopperTooltip.propTypes = {
    placement: PropTypes.string, // top, right
    trigger: PropTypes.array,// ['hover','click']
    tooltip: PropTypes.any,
};

export default PopperTooltip;
