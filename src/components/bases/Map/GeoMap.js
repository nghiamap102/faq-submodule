import './Map.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl';

import { ThemeContext } from 'components/bases/Theme/ThemeContext';

export class GeoMap extends Component
{
    constructor(props)
    {
        super(props);

        this.map = React.createRef();
    }
    shouldComponentUpdate(nextProps, nextState)
    {
        return this.props.id !== nextProps.id;
    }
    render()
    {
        const MapBox = new ReactMapboxGl({
            ref: this.map,
            accessToken: '',
            scrollZoom: this.props.scrollZoom,
            dragPan: this.props.dragPan,
            interactive: this.props.interactive,
        });

        const mapStyle = {
            'version': 8,
            'sources': {},
            'layers': [],
        };

        const { center, zoomLevel } = this.props;

        return (
            <MapBox
                style={mapStyle}
                containerStyle={{
                    height: this.props.height,
                    width: this.props.width,
                }}
                center={center}
                zoom={zoomLevel}
                trackResize
                onClick={this.props.onClick}
            >
                <ZoomControl className={'map-zoom-control'} />

                {this.props.children}
            </MapBox>
        );
    }
}

GeoMap.propTypes = {
    id: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    center: PropTypes.object,
    zoomLevel: PropTypes.array,
};

GeoMap.defaultProps = {
    width: '100%',
    height: '100%',
};

GeoMap.contextType = ThemeContext;
