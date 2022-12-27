import unknownFace from 'images/faceImage/unknown-face.png';

import React, { Component } from 'react';
import Moment from 'react-moment';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Row, Column, Container,
    FormControlLabel,
    EmptyButton,
    Popup,
    HD6, TB1,
    BoxImage, Image, CropImage,
    Table, TableRow, TableRowCell,
    T, DescriptionItem,
} from '@vbd/vui';

import MapLocationDisplay from 'components/app/Location/MapLocationDisplay';

import { FaceAlertService } from 'services/face-alert.service';

import { GeneralDetectionStore } from './GeneralDetectionStore';

import { COLORS, OBJECTS, CARS } from './common';

class GeneralDetectionDetail extends Component
{
    generalDetectionStore = this.props.appStore.generalDetectionStore;
    faceSvc = new FaceAlertService();

    state = {
        isShowMapPopup: false,
        overviewImage: undefined,
    };

    handlePrevClick = () =>
    {
        !this.props.isLoading && this.props.onPrevClick && this.props.onPrevClick(this.props.data);
    };

    handleNextClick = () =>
    {
        !this.props.isLoading && this.props.onNextClick && this.props.onNextClick(this.props.data);
    };

    handleBoxClick = (box) =>
    {
        this.generalDetectionStore.setChoosingDetail(box.id);
        const el = document.getElementById(box.id);
        if (el)
        {
            const y = el.offsetTop - 33; // 33 is height of header
            const scrollView = el.offsetParent.parentNode;
            scrollView.scrollTop = y;
        }
    };

    handleClickDetail = (d) =>
    {
        this.generalDetectionStore.setChoosingDetail(d.eventId);
    };

    detectionDetail = (info) =>
    {
        const type = info.eventType;

        if (type === 'Face')
        {
            const faceId = info.metricsValue[0];
            const faceInfo = this.generalDetectionStore.faceInfos[faceId];

            return (
                <>
                    <Image
                        src={faceInfo ? this.faceSvc.getBestMatchImageUrl(faceId) : unknownFace}
                        width="100px"
                        height="100px"
                        altSrc={unknownFace}
                        canEnlarge
                    />

                    <TB1><T>Id</T>: {faceInfo?.personId || faceId}</TB1>

                    {faceInfo && (
                        <>
                            <TB1><T>Họ và tên</T>: {faceInfo?.name}</TB1>
                            <TB1><T>Giới tính</T>: {faceInfo?.gender}</TB1>
                        </>
                    )}
                </>
            );
        }
        else
        {
            const fieldNamesHandler = (fieldNames, fieldName, value) =>
            {
                if (!value)
                {
                    return '';
                }

                let newValue = value;

                if (fieldNames.includes(fieldName))
                {
                    switch (fieldName)
                    {
                        case 'Color':
                            newValue = (value.split(',').map(v => COLORS[v.trim()]).join(', ')) || value;
                            break;
                        case 'Brand':
                            newValue = CARS[value] || value;
                            break;
                        case 'Info':
                            newValue = OBJECTS[value] || value;
                            break;
                        default:
                            break;
                    }
                }

                return newValue;
            };

            return (
                <>
                    {
                        info.metricsName.map((fieldName, i) =>
                        {
                            const translateKey = `${info.eventType}.${fieldName}`;
                            let value = info.metricsValue[i];

                            switch (info.eventType)
                            {
                                case 'Object':
                                    value = fieldNamesHandler(['Color', 'Brand', 'Info'], fieldName, value);
                                    break;
                                case 'LPR':
                                    value = fieldNamesHandler(['Color'], fieldName, value);
                                    break;
                                default:
                                    break;
                            }

                            return <TB1 key={i}> <T>{translateKey}</T>: {value}</TB1>;
                        })
                    }
                </>
            );
        }
    };

    handleOverviewImageLoaded = (img) =>
    {
        this.setState({ overviewImage: img });
    };

    renderTitleBar = (data) =>
    {
        return (
            <Row
                flex={0}
                height={'2rem'}
                itemMargin={'sm'}
                crossAxisAlignment="center"
            >
                <EmptyButton
                    icon="arrow-left"
                    disabled={this.props.isLoading}
                    onlyIcon
                    onClick={this.handlePrevClick}
                />
                <EmptyButton
                    icon="arrow-right"
                    disabled={this.props.isLoading}
                    onlyIcon
                    onClick={this.handleNextClick}
                />
                <HD6>{data.carNumber}</HD6>
                <TB1><Moment format={'L LTS'}>{data.gMTDate}</Moment></TB1>
            </Row>
        );
    };

    renderOverviewData = (data) =>
    {
        return (
            <Row
                flex={0}
                itemMargin={'md'}
            >
                <Column>
                    <FormControlLabel
                        label={'Vị trí'}
                        labelWidth={'8rem'}
                        control={(
                            <Container>
                                <MapLocationDisplay
                                    height={'140px'}
                                    location={{ longitude: data.longitude, latitude: data.latitude }}
                                    onClick={() => this.setState({ isShowMapPopup: true })}
                                />

                                {
                                    this.state.isShowMapPopup && (
                                        <Popup
                                            width={'70vw'}
                                            title={'Vị trí nhận dạng'}
                                            scroll={false}
                                            onClose={() => this.setState({ isShowMapPopup: false })}
                                        >
                                            <MapLocationDisplay
                                                height={'70vh'}
                                                location={{ longitude: data.longitude, latitude: data.latitude }}
                                                interactive
                                            />
                                        </Popup>
                                    )}
                            </Container>
                        )}
                        direction={'column'}
                    />
                </Column>

                <Column>
                    <FormControlLabel
                        label={'Thông tin nhận dạng'}
                        labelWidth={'8rem'}
                        control={(
                            <Container className="detect-container">
                                <Column className="detect-info">
                                    <DescriptionItem
                                        label={'Hệ thống'}
                                        labelWidth={'8rem'}
                                    >
                                        {data.capturedGroup}
                                    </DescriptionItem>
                                    <DescriptionItem
                                        label={'Camera'}
                                        labelWidth={'8rem'}
                                    >
                                        {data.capturedBy}
                                    </DescriptionItem>
                                    <DescriptionItem
                                        label={'Ngày giờ'}
                                        labelWidth={'8rem'}
                                    >
                                        <Moment format="L LTS">{data.gMTDate}</Moment>
                                    </DescriptionItem>
                                </Column>
                            </Container>
                        )}
                        direction={'column'}
                    />
                </Column>

            </Row>
        );
    };

    renderDetailFields = (data, matchData) =>
    {
        const header = [
            { label: 'STT', width: '3.5rem' },
            { label: 'Hình nhận dạng', width: '10rem' },
            { label: 'Thông tin chi tiết' },
        ];

        let info = data?.info.slice(); // clone

        // mark match search
        info = info.map(i =>
        {
            return {
                ...i,
                match: matchData?.info.find(match => match.eventId === i.eventId),
            };
        });

        // sort match search to top
        info = info.sort(i =>
        {
            return i.match ? -1 : 1;
        });

        return (
            <Table
                className={'result-table'}
                headers={header}
                isFixedHeader
            >
                {
                    Array.isArray(info) && info.filter(i => i.eventType !== 'Crowd').map((detect, index) => (
                        <TableRow
                            key={`${detect.eventId}_${index}`}
                            className={this.generalDetectionStore.choosingDetail === detect.eventId ? 'active' : ''}
                            id={detect.eventId}
                            onClick={(event) =>
                            {
                                this.handleClickDetail(detect, event);
                            }}
                        >
                            <TableRowCell>
                                <TB1>{index + 1}</TB1>
                            </TableRowCell>

                            <TableRowCell>
                                <CropImage
                                    width={'100px'}
                                    height={'100px'}
                                    fitMode={'contain'}
                                    imageData={this.state.overviewImage}
                                    box={{
                                        x: detect.left,
                                        y: detect.top,
                                        width: detect.width,
                                        height: detect.height,
                                    }}
                                    unit="%"
                                    borderColor={detect.match ? 'red' : ''}
                                    canEnlarge
                                />
                            </TableRowCell>

                            <TableRowCell>
                                {this.detectionDetail(detect)}
                                <TB1>Độ chính xác: {(detect.confidence * 100).toFixed(0)}%</TB1>
                            </TableRowCell>
                        </TableRow>
                    ),
                    )
                }
            </Table>
        );
    };

    render()
    {
        const { data, matchData, mini, searchData } = this.props;

        return (
            <Row
                className="general-detect-detail"
                itemMargin={'md'}
                style={{ display: mini ? 'block' : '' }}
            >
                <Column
                    className="left-data"
                    flex={2}
                >
                    {this.renderTitleBar(data)}
                    <Container className="overview-image">
                        <BoxImage
                            height={'30rem'}
                            imageData={data.overviewImage}
                            boxes={GeneralDetectionStore.getBoxes(data, matchData, searchData)}
                            choosingId={this.generalDetectionStore.choosingDetail}
                            onClick={this.handleBoxClick}
                            onImageLoaded={this.handleOverviewImageLoaded}
                        />
                    </Container>
                    {this.renderOverviewData(data)}
                </Column>
                <Column className="right-data">
                    {this.renderDetailFields(data, matchData)}
                </Column>
            </Row>
        );
    }
}

GeneralDetectionDetail.propTypes = {
    // onViewHistory: PropTypes.func,
    onPrevClick: PropTypes.func,
    onNextClick: PropTypes.func,
    data: PropTypes.object,
    // style: PropTypes.object,
    mini: PropTypes.bool,
    isLoading: PropTypes.bool,
};

GeneralDetectionDetail.defaultProps = {
    // className: '',
    mini: false,
    data: null,
    // style: {},
};

GeneralDetectionDetail = inject('appStore')(observer(GeneralDetectionDetail));
export { GeneralDetectionDetail };
