import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import {
    Container, Row, Column, Spacer,
    TB1,
    Paging,
    BorderPanel,
    AdvanceSelect,
    T,
    DetectImage, ImageGrid,
    FAIcon,
    DataGrid,
    Loading,
} from '@vbd/vui';

import { GeneralDetectionStore } from './GeneralDetectionStore';

export const GeneralDetectionContent = (props) =>
{
    const {
        isLoading, data, onDetailClick, miniSize, pageSize,
        onPageSizeChange, liveUpdate, currentPage, totalItem,
        onLiveUpdate, className, onPageChange,
    } = props;

    const [viewType, setViewType] = useState(1); // 1: list view 2: ImageView ; 3 grid view,
    const prevItems = useRef([]);

    const handleChangeViewType = (type) => setViewType(type);

    const handleClickDetail = (data, event) =>
    {
        if (event.target.tagName === 'I')
        {
            return;
        }

        onDetailClick && onDetailClick(data);
    };

    const detectionSummary = (detect) =>
    {
        const nodes = [];
        const faces = [];
        const lprs = [];
        const crowds = [];

        for (let i = 0; i < detect.info.length; i++)
        {
            const info = detect.info[i];

            if (info.eventType === 'Face')
            {
                faces.push(info.metricsValue[0]);
            }

            if (info.eventType === 'LPR' && info.confidence)
            {
                lprs.push(info.metricsValue[0]);
            }

            if (info.eventType === 'Crowd')
            {
                crowds.push(info.metricsValue[0]);
            }
        }

        if (faces.length)
        {
            nodes.push(<TB1 key="faces">Gương mặt: {faces.join(', ')}</TB1>);
        }

        if (lprs.length)
        {
            nodes.push(<TB1 key="lprs">Biển số xe: {lprs.join(', ')}</TB1>);
        }

        if (crowds.length)
        {
            nodes.push(<TB1 key="crowds">Mật độ: {crowds.join(', ')}</TB1>);
        }

        return nodes;
    };

    const renderContent = useMemo(() =>
    {
        const newData = [];
        if (Array.isArray(data) && JSON.stringify(prevItems.current) !== JSON.stringify(data))
        {
            prevItems.current.length && data.map((item) => !prevItems.current.find(prevItem => prevItem.guid === item.guid) && newData.push(item));
            prevItems.current = data;
        }

        newData.length && data.replace(data.slice().sort((a, b) =>
        {
            const newDataA = newData.find(item => item.guid === a.guid);
            const newDataB = newData.find(item => item.guid === b.guid);
            if (newDataA && !newDataB)
            {
                return -1;
            }

            return !newDataA && !newDataB ? 0 : 1;
        }));

        switch (viewType)
        {
            case 1:
            {
                const columns = [
                    { id: 'overviewImage', schema: 'react-node', displayAsText: 'Hình toàn cảnh', width: miniSize ? 160 : 320 },
                    { id: 'details', schema: 'react-node', displayAsText: 'Thông tin chi tiết', minWidth: 250 },
                    { id: 'information', schema: 'react-node', displayAsText: 'Thông tin nhận dạng', minWidth: 220 },
                ];

                const items = Array.isArray(data)
                    ? data.map((detect, index) =>
                    {
                        return {
                            ...detect,
                            overviewImage: (
                                <DetectImage
                                    key={`${detect.guid}-${detect.gMTDate}`}
                                    height={miniSize ? '5rem' : '10rem'}
                                    imageData={detect.overviewImage}
                                    boxes={GeneralDetectionStore.getBoxes(detect)}
                                    canEnlarge
                                />
                            ),

                            details: (
                                <Column
                                    height="100%"
                                    mainAxisAlignment="center"
                                    crossAxisAlignment="center"
                                    itemMargin="lg"
                                >
                                    {detectionSummary(detect)}
                                </Column>
                            ),
                            information: (
                                <Column
                                    height="100%"
                                    mainAxisAlignment="center"
                                    crossAxisAlignment="center"
                                    itemMargin={miniSize ? 'sm' : 'md'}
                                >
                                    <TB1>{detect.source}</TB1>
                                    <TB1>{detect.capturedGroup}</TB1>
                                    <TB1>{detect.capturedBy}</TB1>
                                    <TB1><Moment format={'L LTS'}>{detect.gMTDate}</Moment></TB1>
                                </Column>
                            ),
                        };
                    })
                    : [];

                return (
                    <DataGrid
                        className="live-update-grid"
                        columns={columns}
                        items={items}
                        pagination={{
                            pageSize: pageSize,
                            pageIndex: currentPage,
                        }}
                        total={totalItem}
                        loading={isLoading}
                        rowKey="guid"
                        externalPaginationRow
                        rowNumber
                        onCellClick={(event, row) =>
                        {
                            const index = items.findIndex(item => item.guid === row.guid);
                            handleClickDetail(data[index], event);
                            onLiveUpdate(false);
                        }}
                    />
                );
            }
            case 2:
            {
                const mappedData = (data || []).map((detect) =>
                {
                    return {
                        onClick: (e, img) =>
                        {
                            handleClickDetail(detect, e);
                            onLiveUpdate(false);
                        },
                        src: detect.overviewImage,
                        guid: detect.guid,
                    };
                });

                return (
                    <ImageGrid
                        isLoading={isLoading}
                        data={mappedData}
                        imageKey={'guid'}
                    />
                );

            }
            default:
                return <Container />;
        }
    }, [data, isLoading, viewType]);

    // missing click when it's re-rendered multitime
    const liveUpdateButton = useMemo(() => (
        <Container
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => onLiveUpdate()}
        >
            <Loading className={!liveUpdate ? 'live-update--pause' : ''} />
            <FAIcon
                className="live-update-toggle"
                icon={liveUpdate ? 'pause' : 'play'}
                size="sm"
            />
        </Container>
    ), [liveUpdate]);

    const pageSizeOptions = [
        { id: 0, label: 'Tất cả' },
        { id: 25, label: <T params={[25]}>%0% dòng</T> },
        { id: 50, label: <T params={[50]}>%0% dòng</T> },
        { id: 100, label: <T params={[100]}>%0% dòng</T> },
        { id: 250, label: <T params={[250]}>%0% dòng</T> },
    ];

    return (
        <BorderPanel
            className={`general-alert-content ${className}`}
            flex={1}
        >
            <Container style={{ padding: '1rem' }}>
                <Row crossAxisAlignment="center">
                    {!!totalItem && (
                        <>
                            <Container style={{ paddingRight: '1rem' }}>
                                <Paging
                                    total={totalItem}
                                    currentPage={currentPage}
                                    pageSize={pageSize}
                                    onChange={onPageChange}
                                />
                            </Container>

                            <Container style={{ paddingRight: '1rem' }}>
                                <AdvanceSelect
                                    options={pageSizeOptions}
                                    value={pageSize}
                                    onChange={onPageSizeChange}
                                />
                            </Container>

                            {liveUpdateButton}
                        </>
                    )}

                    <Container style={{ paddingRight: '1rem', marginLeft: 'auto' }}>
                        <FAIcon
                            className={viewType === 1 ? 'active' : ''}
                            icon={'grip-lines'}
                            onClick={() => handleChangeViewType(1)}
                        />
                        <Spacer />
                        <Spacer />
                        <FAIcon
                            className={viewType === 3 ? 'active' : ''}
                            icon={'th'}
                            onClick={() => handleChangeViewType(2)}
                        />
                    </Container>
                </Row>
            </Container>
            {renderContent}
        </BorderPanel>
    );
};

GeneralDetectionContent.propTypes = {
    onPageSizeChange: PropTypes.func,
    onPageChange: PropTypes.func,
    onDetailClick: PropTypes.func,
    // onDeleteClick: PropTypes.func,

    className: PropTypes.string,
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    totalItem: PropTypes.number,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,

    // readOnly: PropTypes.bool,
    miniSize: PropTypes.bool,

    liveUpdate: PropTypes.bool,
    onLiveUpdate: PropTypes.func,
};

