import './Popup.scss';
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import { FAIcon, OverLay, PopupFooter, T, ScrollView } from '@vbd/vui';

const PopupWrapper = ({ trigger, children, modal, width, height, title, isShowCloseButton = true, className, padding, open, onClick, position , placement, isShowArrow }) =>
{
    const [isShow, setIsShow] = useState(false);
    const triggerRef = useRef(null);
    const refOverLay = useRef(null);

    useEffect(() =>
    {
        setIsShow(open);
    }, [open]);

    useEffect(() =>
    {
        if (refOverLay.current)
        {
            setPosition();
        }
    }, [isShow]);


    const renderTrigger = () =>
    {
        const triggerProps = {
            ...trigger.props,
            key: 'T',
            text: _.get(trigger, 'props.label'),
        };

        _.set(triggerProps, _.isFunction(trigger?.type) ? 'innerRef' : 'ref', triggerRef);

        triggerProps.onClick = () =>
        {
            setIsShow(true);
            setPosition();
            if (_.isFunction(onClick))
            {
                onClick();
            }
        };
        return !!trigger && React.cloneElement(trigger, triggerProps);
    };

    const handleClick = async ({ close, onClick }) =>
    {
        if (close)
        {
            setIsShow(false);
        }
        else
        {
            await onClick().then(setIsShow(false));
        }

    };

    const setPosition = () =>
    {
        const popupRef = _.get(refOverLay.current, 'popupRef');
        if (popupRef)
        {
            const mainContent = popupRef.current;
            const rectPopup = mainContent.getBoundingClientRect();
            const rect = triggerRef.current.getBoundingClientRect();
           
            let n = 2;
            switch (position)
            {
                case 'center':
                    n = 2;
                    break;
                default:
                    n = 5;
                    break;
            }
            placement && mainContent.classList.add('report-popup-placement');
            switch (placement)
            {
                case 'bottom-end':
                    mainContent.style.setProperty('--placement-position', `${rect.right - rectPopup.width}px`);
                    break;
                default:
                    break;
            }

            if (rectPopup.right > window.innerWidth)
            {
                mainContent.style.left = `${rect.left + window.pageXOffset + rect.width - rectPopup.width}px`;
                mainContent.style.setProperty('--left-position', `${(rectPopup.width - rect.width) + (rect.width / n) * (n - 1)}px`);
            }
            else
            {
                mainContent.style.setProperty('--left-position', `${rect.width / n}px`);
            }
            mainContent.style.maxHeight = `calc(100vh - ${rectPopup.top}px)`;
        }
    };

    const childrenArray = _.isArray(children) ? children : [children];
    const footer = childrenArray.find((child) => child?.type === PopupFooter);
    children = childrenArray.filter((child) => child?.type !== PopupFooter);

    return (
        <>
            {renderTrigger()}
            {isShow &&
            <OverLay
                ref={refOverLay}
                className={`${className || ''}`}
                width={width ?? '20rem'}
                height={height}
                onBackgroundClick={() => setIsShow(false)}
                anchorEl={modal ? null : triggerRef}
            >

                <div className={`report-popup-container ${isShowArrow ? 'arrow' : ''}`}>
                    {
                        title && <div className="report-popup-header">
                            <h3><T>{title}</T></h3>
                            {
                                isShowCloseButton && <div className="report-popup-header-actions">
                                    <button
                                        onClick={() => setIsShow(false)}
                                    >
                                        <FAIcon
                                            icon="times"
                                            size={'1.5rem'}
                                        />
                                    </button>
                                </div>
                            }
                        </div>
                    }

                    <ScrollView
                        className="report-popup-body"
                        style={{ padding: padding }}
                    >
                        {children}
                    </ScrollView>

                    {
                        footer &&
                        <div className="report-popup-footer">
                            {
                                _.map(_.isArray(footer.props.children) ? footer.props.children : [footer.props.children] , child =>
                                {
                                    return React.cloneElement(child, { ...child.props, text: child.props.label, onClick: () => handleClick(child.props) });
                                })
                            }
                        </div>
                    }
                </div>
            </OverLay>
            }
        </>
    );
};

PopupWrapper.propTypes = {
    trigger: PropTypes.elementType,
    children: PropTypes.any,
    modal: PropTypes.bool,
    width: PropTypes.string,
    height: PropTypes.string,
    title: PropTypes.string,
    isShowCloseButton: PropTypes.bool,
    className: PropTypes.string,
    padding: PropTypes.any,
    open: PropTypes.bool,
    onClick: PropTypes.func,
    isShowArrow: PropTypes.bool,
    position: PropTypes.string,
    placement: PropTypes.string,
};

PopupWrapper.defaultProps = {
    isShowCloseButton: true,
    modal: false,
    isShowArrow: false,
};

export default PopupWrapper;
