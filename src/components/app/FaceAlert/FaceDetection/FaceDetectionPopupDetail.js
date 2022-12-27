import Moment from 'react-moment';
import React from 'react';
import { Marker as MapMarker } from 'react-mapbox-gl';

import {
    Expanded, Spacer, Column, Row, Container,
    FormControlLabel,
    Image,
    Map,
    FAIcon,
    DescriptionItem,
} from '@vbd/vui';

const FaceDetectionPopupDetail = (props) =>
{
    const { data, mini } = props;

    const renderFaceImage = () =>
    {
        const children = (
            <>
                <Expanded>
                    <FormControlLabel
                        label={'Hình khuôn mặt'}
                        labelWidth={'8rem'}
                        direction={'column'}
                        control={(
                            <Image
                                width={'100%'}
                                height={'12rem'}
                                fitMode={'cover'}
                                src={data.faceImage}
                                canEnlarge
                            />
                        )}
                    />
                </Expanded>

                <Spacer size={mini ? '0' : '1.25rem'} />

                <Expanded>
                    <FormControlLabel
                        label={'Hình toàn cảnh'}
                        labelWidth={'8rem'}
                        direction={'column'}
                        control={(
                            <Image
                                width={'100%'}
                                height={'12rem'}
                                fitMode={'cover'}
                                src={data.overviewImage}
                                canEnlarge
                            />
                        )}
                    />
                </Expanded>
            </>
        );

        return mini ? <Column>{children}</Column> : <Row>{children}</Row>;
    };

    const renderDetailFields = () =>
    {
        const children = (
            <>
                <Expanded>
                    <Column>
                        <DescriptionItem
                            label={'Độ chính xác'}
                            labelWidth={'8rem'}
                        >
                            {`${data.accuracy ? (data.accuracy * 100).toFixed(2) : 0}%`}
                        </DescriptionItem>
                        <DescriptionItem
                            label={'Ngày phát hiện'}
                            labelWidth={'8rem'}
                        >
                            <Moment format={'L LTS'}>{data.detectDate}</Moment>
                        </DescriptionItem>
                        <DescriptionItem
                            label={'Mã phát hiện'}
                            labelWidth={'8rem'}
                        >
                            {data.faceId}
                        </DescriptionItem>
                        <FormControlLabel
                            label={'Vị trí'}
                            labelWidth={'8rem'}
                            control={(
                                <Container style={{ height: '12rem' }}>
                                    <Map
                                        center={{
                                            lng: data.y,
                                            lat: data.x,
                                        }}
                                        zoomLevel={[13.5]}
                                        scrollZoom={false}
                                        boxZoom={false}
                                        isNotControl
                                        // onClick={this.props.onClick}
                                    >
                                        <MapMarker
                                            coordinates={[data.y, data.x]}
                                            anchor="bottom"
                                        >
                                            <FAIcon
                                                icon="map-marker-alt"
                                                color="red"
                                                type="solid"
                                                size="1.5rem"
                                            />
                                        </MapMarker>
                                    </Map>
                                </Container>
                            )}
                            direction={'column'}
                        />
                    </Column>
                </Expanded>
            </>
        );

        return mini ? <Column>{children}</Column> : <Row>{children}</Row>;
    };

    return (
        <Column mainAxisSize={'min'}>
            {renderFaceImage()}
            {renderDetailFields()}
        </Column>
    );
};

export { FaceDetectionPopupDetail };
