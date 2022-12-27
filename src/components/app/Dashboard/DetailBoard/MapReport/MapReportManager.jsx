import './MapReportManager.scss';

import React, { useContext, useEffect, useState } from 'react';
import { Feature, Layer } from 'react-mapbox-gl';
import { Pie } from 'react-chartjs-2';

import {
    Loading,
    MarkerPopup,
    ToggleButton,
    MapButtonGroup,
    Container,
} from '@vbd/vui';

import { POIContent } from 'components/app/PopupContent/POIPopup';
import { MapReportContext } from 'components/app/Dashboard/DetailBoard/MapReport/MapReportContext';

import { CommonHelper } from 'helper/common.helper';
import { FACET_TYPE, MAP_VIEW_MODE } from 'services/DashboardService/constants';
import dashboardService from 'services/DashboardService/DashboardService';

const MapReportManager = (props) =>
{
    const { state, setState } = useContext(MapReportContext);

    const [markerPopup, setMarkerPopup] = useState();
    const [markerFeatures, setMarkerFeatures] = useState([]);
    const [polygonFeatures, setPolygonFeatures] = useState([]);
    const [highlightPolygonFeature, setHighlightPolygonFeature] = useState();
    const [viewMode, setViewMode] = useState(MAP_VIEW_MODE.DETAIL);

    const { map, data, types, chart, loading, geoField, districtAdminData } = state;
    const { label, field, facetType } = chart;

    const onMarkerClick = (data) =>
    {
        setMarkerPopup(
            <MarkerPopup
                id={data.Id}
                title={data.Title}
                sub={data.sub}
                lng={data.y}
                lat={data.x}
                width={400}
                height={300}
                onClose={() => setMarkerPopup(null)}
            >
                <POIContent contents={data} />
            </MarkerPopup>,
        );

        if (map)
        {
            map.panTo({ lat: data.x, lng: data.y });
        }
    };

    const buildMarkerFeature = (data, color) =>
    {
        if (data[geoField])
        {
            try
            {
                const geoData = JSON.parse(data[geoField]);
                if (geoData && geoData.type === 'Point')
                {
                    return (
                        <Feature
                            key={data.Id}
                            coordinates={geoData.coordinates}
                            properties={{ 'color': color }}
                            onClick={() => onMarkerClick({ ...data, y: geoData.coordinates[0], x: geoData.coordinates[1] })}
                        />
                    );
                }
            }
            catch (e)
            {
                console.error(e.message);
            }
        }

        return null;
    };

    const buildMarkerFeatures = () =>
    {
        const markers = [];

        switch (facetType)
        {
            case FACET_TYPE.QUERY_FACET:
                if (data && Array.isArray(data))
                {
                    data.forEach((group, index) =>
                    {
                        group.forEach(d =>
                        {
                            const feature = buildMarkerFeature(d, types[index].color);
                            if (feature)
                            {
                                markers.push(feature);
                            }
                        });
                    });
                }
                break;
            case FACET_TYPE.TERM_FACET:
                if (data && Array.isArray(data))
                {
                    data.forEach((d) =>
                    {
                        const matchType = types.find(t =>
                        {
                            let typeName = d[field];
                            if (typeName)
                            {
                                typeName = JSON.parse(typeName)[0];
                            }

                            return t.typeName.toLowerCase() === typeName?.toLowerCase();
                        });

                        const color = matchType ? matchType.color : '#fff';
                        const feature = buildMarkerFeature(d, color);

                        if (feature)
                        {
                            markers.push(feature);
                        }
                    });
                }
                break;
            default:
                break;
        }

        setMarkerFeatures(markers);
    };

    const onPolygonClick = (e, data) =>
    {
        const feature = (
            <Feature
                key={'polygon-highlight-' + data.Id}
                coordinates={data.coordinates[0]}
            />
        );

        setHighlightPolygonFeature(feature);

        if (data.terms)
        {
            const options = {
                responsive: true,
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: label,
                },
            };

            const dataPie = {
                labels: Object.keys(data.terms),
                datasets: [
                    {
                        data: Object.values(data.terms),
                        backgroundColor: types.map(t => t.color),
                    },
                ],
            };

            setMarkerPopup(
                <MarkerPopup
                    title={data.Title}
                    lng={e.lngLat.lng}
                    lat={e.lngLat.lat}
                    width={500}
                    height={300}
                    onClose={() => setMarkerPopup(null)}
                >
                    <Container style={{ padding: '1rem' }}>
                        <Pie
                            data={dataPie}
                            options={options}
                            width={460}
                            height={250}
                        />
                    </Container>
                </MarkerPopup>,
            );
        }
    };

    const buildPolygonFeature = (data, total) =>
    {
        if (data.coordinates)
        {
            return (
                <Feature
                    key={data.Id}
                    coordinates={data.coordinates}
                    properties={{ 'value': data.dataCount }}
                    onClick={(e) => onPolygonClick(e, data)}
                />
            );
        }
    };

    const buildPolygonFeatures = () =>
    {
        if (districtAdminData)
        {
            const polygons = [];

            let dat = CommonHelper.clone(data);
            const districtAdmin = CommonHelper.clone(districtAdminData);

            if (dat && dat.length)
            {
                if (facetType === FACET_TYPE.QUERY_FACET)
                {
                    let mergeData = [];
                    dat.forEach((group, index) =>
                    {
                        group.forEach(g => g.group = chart.queries[index].label);
                        mergeData = [...mergeData, ...group];
                    });

                    dat = mergeData;
                }

                districtAdmin.forEach(district =>
                {
                    try
                    {
                        district.coordinates = JSON.parse(district.COLLECTION).coordinates;
                        district.dataCount = 0;

                        district.coordinates.forEach(coords =>
                        {
                            for (let i = 0; i < dat.length; i++)
                            {
                                try
                                {
                                    const geoData = JSON.parse(dat[i][geoField]);
                                    const inside = CommonHelper.checkPointInsidePolygon(geoData.coordinates, coords);
                                    if (inside)
                                    {
                                        district.dataCount++;

                                        if (facetType === FACET_TYPE.QUERY_FACET)
                                        {
                                            district.terms = district.terms || [];
                                            district.terms[dat[i].group] = (district.terms[dat[i].group] || 0) + 1;
                                        }
                                        else if (facetType === FACET_TYPE.TERM_FACET)
                                        {
                                            let term = dat[i][field];
                                            if (term)
                                            {
                                                term = JSON.parse(term);
                                                district.terms = district.terms || [];

                                                term.forEach(t => district.terms[t] = (district.terms[t] || 0) + 1);
                                            }
                                        }
                                    }
                                }
                                catch (e)
                                {
                                    console.error(`Fail to parse case coordinates!. NodeId: ${dat[i].Id}`);
                                }
                            }
                        });

                        const feature = buildPolygonFeature(district, dat.length);
                        polygons.push(feature);
                    }
                    catch (e)
                    {
                        console.error(`Fail to parse district coordinates!. NodeId: ${district.Id}`);
                    }
                });

                setPolygonFeatures(polygons);
            }
        }
    };

    useEffect(() =>
    {
        switch (viewMode)
        {
            case MAP_VIEW_MODE.DETAIL:
                buildMarkerFeatures();
                break;
            case MAP_VIEW_MODE.ADMIN:
                buildPolygonFeatures();
                break;
            default:
                break;
        }
    }, [data, districtAdminData, viewMode]);

    useEffect(() =>
    {
        if (!districtAdminData)
        {
            setState({ loading: true });

            const query = {
                path: '/root/vdms/tangthu/data/administrative/thanhphohochiminh',
                isInTree: false,
                layers: ['ADMINISTRATIVE'],
            };

            dashboardService.getMapReportData(query).then(rs =>
            {
                setState({ loading: false });

                if (rs && rs.length)
                {
                    setState({ districtAdminData: rs });
                }
            });
        }
    }, []);

    return (
        <>
            {loading && <Loading />}

            <MapButtonGroup className={'map-report-manager-view-mode'}>
                <ToggleButton
                    pressed={viewMode === MAP_VIEW_MODE.DETAIL}
                    text={'Chi tiết'}
                    onClick={() => setViewMode(MAP_VIEW_MODE.DETAIL)}
                />
                <ToggleButton
                    pressed={viewMode === MAP_VIEW_MODE.HEAT}
                    text={'Heatmap'}
                    onClick={() => setViewMode(MAP_VIEW_MODE.HEAT)}
                />
                <ToggleButton
                    text={'Ranh giới'}
                    pressed={viewMode === MAP_VIEW_MODE.ADMIN}
                    onClick={() => setViewMode(MAP_VIEW_MODE.ADMIN)}
                />
            </MapButtonGroup>

            <>
                {markerPopup}

                {
                    (viewMode === MAP_VIEW_MODE.DETAIL || viewMode === MAP_VIEW_MODE.HEAT) && (
                        <Layer
                            id="report-map-circle"
                            type="circle"
                            minZoom={viewMode === MAP_VIEW_MODE.HEAT ? 13 : 0}
                            paint={{
                            // // increase the radius of the circle as the zoom level and dbh value increases
                            // 'circle-radius': {
                            //     property: 'dbh',
                            //     type: 'exponential',
                            //     stops: [
                            //         [{ zoom: 15, value: 1 }, 5],
                            //         [{ zoom: 15, value: 62 }, 10],
                            //         [{ zoom: 22, value: 1 }, 20],
                            //         [{ zoom: 22, value: 62 }, 50],
                            //     ],
                            // },
                                'circle-color': ['get', 'color'],
                                'circle-stroke-color': 'white',
                                'circle-stroke-width': 1,
                            // 'circle-opacity': {
                            //     stops: [
                            //         [14, 0],
                            //         [15, 1],
                            //     ],
                            // },
                            }}
                        >
                            {markerFeatures}
                        </Layer>
                    )}

                {
                    viewMode === MAP_VIEW_MODE.HEAT && (
                        <Layer
                            id="report-map-marker"
                            type="heatmap"
                            maxZoom={15}
                            paint={{
                            // Increase the heatmap weight based on frequency and property magnitude
                                'heatmap-weight': {
                                    stops: [
                                        [11, 1],
                                        [15, 3],
                                    ],
                                },
                                // increase intensity as zoom level increases
                                // heatmap-intensity is a multiplier on top of heatmap-weight
                                'heatmap-intensity': {
                                    stops: [
                                        [11, 1],
                                        [15, 3],
                                    ],
                                },
                                // assign color values be applied to points depending on their density
                                'heatmap-color': [
                                    'interpolate',
                                    ['linear'],
                                    ['heatmap-density'],
                                    0, 'rgba(236,222,239,0)',
                                    0.1, 'rgb(80,80,255)',
                                    0.25, 'rgb(80,255,255)',
                                    0.5, 'rgb(36,165,36)',
                                    0.75, 'rgb(255,255,80)',
                                    1, 'rgb(255,100,100)',
                                ],
                                // increase radius as zoom increases
                                'heatmap-radius': {
                                    stops: [
                                        [11, 15],
                                        [15, 20],
                                    ],
                                },
                                // decrease opacity to transition into the circle layer
                                'heatmap-opacity': {
                                    default: 1,
                                    stops: [
                                        [12, 0.9],
                                        [15, 0],
                                    ],
                                },
                            }}
                        >
                            {markerFeatures}
                        </Layer>
                    )}

                {
                    viewMode === MAP_VIEW_MODE.ADMIN && (
                        <>
                            <Layer
                                id="report-map-admin"
                                type="fill"
                                paint={{
                                    'fill-color': {
                                        property: 'value',
                                        stops: [[0, '#fff'], [200, '#f00']],
                                    },
                                    'fill-opacity': 0.8,
                                }}
                            >
                                {polygonFeatures}
                            </Layer>

                            <Layer
                                id="report-map-admin-highlight"
                                type="line"
                                paint={{
                                    'line-color': '#0088ff',
                                    'line-width': 3,
                                }}
                            >
                                {highlightPolygonFeature}
                            </Layer>
                        </>
                    )}
            </>
        </>
    );
};

export { MapReportManager };
