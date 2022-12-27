import './OverLay.scss';

import React, { Component, createRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const modalRoot = document.getElementById('modal-root');

export class OverLay extends Component
{
    state = {
        mounted: false,
    };

    constructor(props)
    {
        super(props);
        this.el = document.createElement('div');
        this.popupRef = createRef();
    }

    componentDidMount()
    {
        // The portal element is inserted in the DOM tree after its children are mounted
        // that's mean its children will be mounted on a detached DOM node.
        modalRoot.appendChild(this.el);

        // If we need the children to be attached to the DOM tree immediately when mounted
        // for example to measure a DOM node (width, height, scroll, autoFocus...)
        // don't render children until Overlay is mounted in the DOM tree.
        this.setState({ mounted: true }, () =>
        {
            if (this.popupRef && this.popupRef.current && this.props.anchorEl && this.props.anchorEl.current)
            {
                const rect = this.props.anchorEl.current.getBoundingClientRect();
                const popupWidth = this.popupRef.current.clientWidth;
                const popupHeight = this.popupRef.current?.clientHeight;

                switch (this.props.anchor)
                {
                    case 'bottom':
                    case 'top':
                    {
                        if (rect.left + popupWidth > window.innerWidth)
                        {
                            this.popupRef.current.style.left = null;
                            this.popupRef.current.style.right = (window.innerWidth - rect.right) + 'px';
                        }
                        else
                        {
                            this.popupRef.current.style.right = null;
                            this.popupRef.current.style.left = rect.left + 'px';
                        }
                        break;
                    }
                    case 'left':
                    case 'right':
                    {
                        if (popupHeight > window.innerHeight - rect.top)
                        {
                            this.popupRef.current.style.bottom = (window.innerHeight - rect.top - rect?.height) + 'px';
                            this.popupRef.current.style.top = null;
                        }
                        else
                        {
                            this.popupRef.current.style.top = rect.top + 'px';
                            this.popupRef.current.style.bottom = null;
                        }

                        // broken left
                        if (this.props.anchor === 'left' && rect.left < popupWidth)
                        {
                            this.popupRef.current.style.left = 8 + 'px';
                            this.popupRef.current.style.right = null;
                        }
                        // broken right
                        if (this.props.anchor === 'right' && window.innerWidth - rect.right < popupWidth)
                        {
                            this.popupRef.current.style.left = window.innerWidth - popupWidth - 8 + 'px';
                            this.popupRef.current.style.right = null;
                        }
                        break;
                    }

                }

            }
        });
    }

    componentWillUnmount()
    {
        modalRoot.removeChild(this.el);
    }

    getPosition = (rect, style) =>
    {
        const { offset, anchor } = this.props;
        switch (anchor)
        {
            case 'bottom':
                if (rect.top > window.innerHeight * 0.65 || rect.top + 300 > window.innerHeight || style.height > window.innerHeight - rect.top - rect.height)
                {
                    style.bottom = window.innerHeight - rect.top;
                }
                else
                {
                    style.top = rect.bottom;
                }
                style.left = rect.left;
                break;
            case 'top':
                if (rect.top < window.innerHeight * 0.35 || rect.bottom + 300 > window.innerHeight || style.height > window.innerHeight - rect.bottom - rect.height)
                {
                    style.top = rect.bottom;
                }
                else
                {
                    style.bottom = window.innerHeight - rect.top;
                }
                style.left = rect.left;
                break;
            case 'left':
                style.right = window.innerWidth - rect.left;
                break;
            case 'right':
                style.left = rect.right;
                break;
        }

        style.left = style?.left + offset[0];
        style.top = style?.top + offset[1];
        style.minWidth = this.props.minWidth || this.props.width || rect.width;
        return style;
    }

    render()
    {
        let rect;
        let style = {
            width: this.props.width,
            maxWidth: '90vw',
            height: this.props.height,
            maxHeight: '90vh',
        };

        if (this.props.anchorEl && this.props.anchorEl.current)
        {
            rect = this.props.anchorEl.current.getBoundingClientRect();
            style = this.getPosition(rect, style);
        }

        const content = (
            <div className={`${this.props.className || ''} app-overlay ${rect ? 'overlay-popover' : ''}`}>
                {
                    this.props.backdrop &&
                    <div
                        className={'overlay-background'}
                        onClick={this.props.onBackgroundClick}
                        onMouseMove={this.props.onBackgroundMouseMove}
                    />
                }
                <div
                    ref = {this.popupRef}
                    className={'overlay-main'}
                    style={style}
                >
                    {this.state.mounted && this.props.children}
                </div>
            </div>
        );

        // return content;
        return ReactDOM.createPortal(content, this.el);
    }
}

OverLay.propTypes = {
    className: PropTypes.string,
    minWidth: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    anchorEl: PropTypes.object,
    anchor: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    offset: PropTypes.array,
    backdrop: PropTypes.bool,
    onBackgroundClick: PropTypes.func,
    onBackgroundMouseMove: PropTypes.func,
};

OverLay.defaultProps = {
    className: '',
    height: 'auto',
    backdrop: true,
    anchor: 'bottom',
    offset: [0,0],
    onBackgroundClick: (event) =>
    {

    },
};
