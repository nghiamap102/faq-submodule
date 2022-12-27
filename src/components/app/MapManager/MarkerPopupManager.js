import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Container, MarkerPopup } from '@vbd/vui';

const markerSize = 45; // 45px
const arrowSize = 24;

class MarkerPopupManager extends Component
{
    store = this.props.store || this.props.appStore.markerPopupStore;

    componentDidMount()
    {
        if (this.props.autoArrange)
        {
            this.checkInterval = setInterval(this.calculateMarkerInMap, 1000);
        }
    }

    componentWillUnmount()
    {
        clearInterval(this.checkInterval);
    }

    calculateMarkerInMap = () =>
    {
        const popups = this.store.popups;
        for (let i = 0; i < popups.length; i++)
        {
            const popup = popups[i];
            if (!popup || !popup.isNotFixed)
            {
                continue;
            }
            const mapElements = document.getElementsByClassName('mapboxgl-map')[0];
            const map = {
                x: mapElements.getBoundingClientRect().left,
                y: mapElements.getBoundingClientRect().top,
                width: mapElements.getBoundingClientRect().width,
                height: mapElements.getBoundingClientRect().height,
            };
            const markerLocation = this.getMarkerLocation(popup);
            const location = this.getLocation(markerLocation, map, popup.location, i);
            if (location && popup.location !== location)
            {
                this.store.setState(popup.id, 'location', location);
            }
        }
    };

    getLocation(markerLocation, map, currentLocation, popupIndex)
    {
        const prevPopups = this.store.popups.slice(0, popupIndex);
        const condition = {
            isLeft: false,
            isRight: false,
            isTop: false,
            isBottom: false,
        };

        const realLeftLocation = this.getRealLocation(markerLocation, 'left');
        const realRightLocation = this.getRealLocation(markerLocation, 'right');
        const realTopLocation = this.getRealLocation(markerLocation, 'top');
        const realBottomLocation = this.getRealLocation(markerLocation, 'bottom');

        if (realRightLocation.x + realRightLocation.width < map.width &&
            realRightLocation.y > 0 &&
            realRightLocation.y + realRightLocation.height < map.height &&
            this.checkLocationWithOtherComponents(prevPopups, realRightLocation))
        {
            condition.isRight = true;
        }
        if (realLeftLocation.x > 0 &&
            realLeftLocation.y > 0 &&
            realLeftLocation.y + realLeftLocation.height < map.height &&
            this.checkLocationWithOtherComponents(prevPopups, realLeftLocation))
        {
            condition.isLeft = true;
        }
        if (realTopLocation.y > 0 &&
            realTopLocation.x > 0 &&
            realTopLocation.x + realTopLocation.width < map.width &&
            this.checkLocationWithOtherComponents(prevPopups, realTopLocation))
        {
            condition.isTop = true;
        }
        if (realBottomLocation.y + realBottomLocation.height < map.height &&
            realBottomLocation.x > 0 &&
            realBottomLocation.x + realBottomLocation.width < map.width &&
            this.checkLocationWithOtherComponents(prevPopups, realBottomLocation))
        {
            condition.isBottom = true;
        }

        if (condition.isTop && currentLocation === 'top')
        {
            return currentLocation;
        }
        else if (condition.isRight && currentLocation === 'right')
        {
            return currentLocation;
        }
        else if (condition.isBottom && currentLocation === 'bottom')
        {
            return currentLocation;
        }
        else if (condition.isLeft && currentLocation === 'left')
        {
            return currentLocation;
        }
        else
        {
            return condition.isTop ? 'top' : condition.isRight ? 'right' : condition.isBottom ? 'bottom' : condition.isLeft ? 'left' : 'none';
        }
    }

    getRealLocation(markerLocation, location)
    {
        switch (location)
        {
            case 'left':
                return {
                    x: markerLocation.x - markerLocation.width / 2 - markerSize - arrowSize,
                    y: markerLocation.y + markerLocation.height / 2,
                    width: markerLocation.width + arrowSize,
                    height: markerLocation.height,
                };
            case 'right':
                return {
                    x: markerLocation.x + markerLocation.width / 2 + markerSize + arrowSize,
                    y: markerLocation.y + markerLocation.height / 2,
                    width: markerLocation.width + arrowSize,
                    height: markerLocation.height,
                };
            default:
            case 'top':
                return {
                    x: markerLocation.x,
                    y: markerLocation.y - markerSize / 2 - arrowSize,
                    width: markerLocation.width,
                    height: markerLocation.height + arrowSize,
                };
            case 'bottom':
                return {
                    x: markerLocation.x,
                    y: markerLocation.y + markerLocation.height + arrowSize + markerSize / 2,
                    width: markerLocation.width,
                    height: markerLocation.height + arrowSize,
                };
        }
    }

    checkLocationWithOtherComponents(components, location)
    {
        for (let i = 0; i < components.length; i++)
        {
            if (components[i].location === 'none')
            {
                continue;
            }
            const componentRealLocation = this.getRealLocation(this.getMarkerLocation(components[i]), components[i].location);
            if (!this.compareLocation(componentRealLocation, location))
            {
                return false;
            }
        }
        return true;
    }

    compareLocation(leftLocation, rightLocation)
    {
        if (!leftLocation || !rightLocation)
        {
            return false;
        }
        const x_overlap = Math.max(0, Math.min(leftLocation.x + leftLocation.width, rightLocation.x + rightLocation.width) - Math.max(leftLocation.x, rightLocation.x));
        const y_overlap = Math.max(0, Math.min(leftLocation.y + leftLocation.height, rightLocation.y + rightLocation.height) - Math.max(leftLocation.y, rightLocation.y));
        return x_overlap * y_overlap === 0;
    }

    getMarkerLocation(popup)
    {
        const realWidth = popup.width;
        let realHeight = popup.height + 48; // add header height
        if (popup.actions && popup.actions.length > 0)
        {
            realHeight += 50; // footer
        }

        const points = window.map.project([popup.lng, popup.lat]);
        return {
            x: points.x - realWidth / 2,
            y: points.y - realHeight,
            width: realWidth,
            height: realHeight,
        };
    }

    render()
    {
        return (
            this.store.popups.map((popup, index) =>
            {
                let location = popup.location;

                if (!location && window.map)
                {
                    const mapElements = document.getElementsByClassName('mapboxgl-map')[0];
                    const map = mapElements.getBoundingClientRect();
                    const markerLocation = this.getMarkerLocation(popup);

                    location = this.getLocation(markerLocation, map, location, index);

                    this.store.setState(popup.id, 'location', location);
                }


                return (
                    <Container key={popup.id}>
                        <MarkerPopup
                            key={popup.id}
                            {...popup}

                            markerSize={markerSize}
                        >
                            {popup.content}
                        </MarkerPopup>

                    </Container>
                );
            })
        );
    }
}

MarkerPopupManager.propTypes = {
    /** The prop is auto Arrange when change map location or zoom size */
    autoArrange: PropTypes.bool,
};

MarkerPopupManager.defaultProps = {
    autoArrange: false,
};

MarkerPopupManager = inject('appStore')(observer(MarkerPopupManager));
export default MarkerPopupManager;
