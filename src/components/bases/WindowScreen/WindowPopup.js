import './WindowPopup.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';

export class WindowPopup extends Component
{
    myRef = React.createRef();

    isMoving = false;
    isResizing = false;
    currentX = null;
    currentY = null;

    borderWidth = 20;
    borderHeight = 51;

    state = {
        width: this.props.width,
        height: this.props.height,
        top: this.props.top,
        left: this.props.left,
    };

    onWindowFocus = () =>
    {
        this.props.onFocus(this.props);
    };

    onWindowClose = () =>
    {
        this.props.onClose(this.props);
    };

    moving = (event) =>
    {
        this.isMoving = true;

        this.currentX = event.screenX;
        this.currentY = event.screenY;
    };

    resizing = (event) =>
    {
        this.isResizing = true;

        this.currentX = event.screenX;
        this.currentY = event.screenY;
    };

    onMouseUp = () =>
    {
        this.isMoving = false;
        this.isResizing = false;

        this.currentX = null;
        this.currentY = null;
    };

    onMouseMove = (event) =>
    {
        if (this.isResizing)
        {
            const newWidth = this.state.width + (event.screenX - this.currentX);
            const newHeight = this.state.height + (event.screenY - this.currentY);

            this.currentX = event.screenX;
            this.currentY = event.screenY;

            const { width, height } = this.calculateSize(newWidth, newHeight);

            this.setState({
                width: width <= 200 ? this.state.width : width,
                height: height <= 150 ? this.state.height : height,
            });
        }
        else if (this.isMoving)
        {
            const newTop = this.state.top + (event.screenY - this.currentY);
            const newLeft = this.state.left + (event.screenX - this.currentX);

            this.currentX = event.screenX;
            this.currentY = event.screenY;

            const { top, left } = this.validateParentBound(newTop, newLeft);

            this.setState({
                top: top,
                left: left,
            });
        }
    };

    calculateSize(newWidth, newHeight)
    {
        const parentWidth = this.myRef.current.parentElement.clientWidth;
        const parentHeight = this.myRef.current.parentElement.clientHeight;

        if (newWidth + this.state.left + this.borderWidth >= parentWidth)
        {
            newWidth = this.state.width;
        }

        if (newHeight + this.state.top + this.borderHeight >= parentHeight)
        {
            newHeight = this.state.height;
        }

        return { width: newWidth, height: newHeight };
    }

    validateParentBound(newTop, newLeft)
    {
        const parentWidth = this.myRef.current.parentElement.clientWidth;
        const parentHeight = this.myRef.current.parentElement.clientHeight;

        if (newTop <= 0 || newTop + this.state.height + this.borderHeight >= parentHeight)
        {
            // out bound reset top
            newTop = this.state.top;
        }

        if (newLeft <= 0 || newLeft + this.state.width + this.borderWidth >= parentWidth)
        {
            // out bound, reset left
            newLeft = this.state.left;
        }

        return { top: newTop, left: newLeft };
    }

    componentDidMount()
    {
        // global window event
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
    }

    componentWillUnmount()
    {
        // global window event
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
    }


    render()
    {
        return (
            <div
                ref={this.myRef}
                className={`window-popup ${this.props.isActivate ? 'active' : ''} ${this.props.visible ? 'show' : 'hide'}`}
                style={{
                    top: `${this.state.top}px`,
                    left: `${this.state.left}px`,
                }}
                onClick={this.onWindowFocus}
            >
                <div
                    className="wp-header"
                    onMouseDown={this.moving}
                >
                    <h3><T>{this.props.title}</T></h3>
                    <div className="wp-header-actions">
                        <button>
                            <FAIcon
                                icon="times"
                                size="24px"
                                color="white"
                                onClick={this.onWindowClose}
                            />
                        </button>
                    </div>
                </div>

                <div
                    className="wp-body"
                    style={{
                        width: `${this.state.width}px`,
                        height: `${this.state.height}px`,
                    }}
                >
                    {this.props.children}
                </div>

                <div className="wp-footer">
                    {this.props.resizable && (
                        <div
                            className="wp-tool-resize"
                            onMouseDown={this.resizing}
                        />
                    )}
                </div>
            </div>
        );
    }
}

WindowPopup.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    visible: PropTypes.bool,
    title: PropTypes.any,
    isMinimize: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    left: PropTypes.number,
    top: PropTypes.number,
    resizable: PropTypes.bool,
    isActivate: PropTypes.bool,
    onFocus: PropTypes.func,
    onClose: PropTypes.func,
};

WindowPopup.defaultProps = {
    id: '',
    className: '',
    visible: true,
    title: '',
    isMinimize: false,
    width: 400,
    height: 300,
    top: Math.random() * 200,
    left: Math.random() * 400,
    resizable: true,
    isActivate: false,
    onFocus: () =>
    {
    },
    onClose: () =>
    {
    },
};
