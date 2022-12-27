import './CasePanel.scss';

import React, { useContext, useEffect, useState } from 'react';

import {
    useModal,
    Spacer, Row,
    Button,
    FAIcon,
    Popup,
    PanelHeader,
    Expanded,
    BorderPanel, PanelBody,
    Confirm,
    useMergeState,
} from '@vbd/vui';

import { SpatialSearchMap } from 'components/app/SpatialSearch/SpatialSearchMap';
import { NodeHistory } from 'components/app/NodeHistory/NodeHistory';

import { CaseContext, CaseFormMode } from './CaseContext';
import CaseFilter from './CaseFilter';
import { CaseGrid } from './CaseGrid';
import CaseFormPopup from './CaseFormPopup';

const CasePanel: React.FC = (props) =>
{
    const VIEW_MODE = {
        LIST: 'LIST',
        MAP: 'MAP',
        SPLIT: 'SPLIT',
    };

    const [viewMode, setViewMode] = useState<string>(VIEW_MODE.SPLIT);
    const [delModel, setDelModel] = useMergeState<any>({
        open: false,
        ids: [],
        deleting: false,
    });

    const [caseHistoryForm, setCaseHistoryForm] = useMergeState<any>({
        open: false,
        data: null,
    });

    const {
        cases,
        caseForm,
        selectedCase,
        spatialSearchStore,
        markerPopupStore,
        refetch,
        setCaseState,
        onCaseSelectionChange,
        onAllCaseSelectionChange,
        selectedCaseIds,
        caseService,
    } = useContext<any>(CaseContext);

    const { toast } = useModal();

    useEffect(() =>
    {
        if (cases)
        {
            spatialSearchStore.setData(cases);
        }
    }, [cases]);

    const caseFormCallback = () =>
    {
        setCaseState({ caseForm: { ...caseForm, open: false } });
        refetch();
    };

    const deleteCase = (ids: string[]) =>
    {
        setDelModel({ ...delModel, deleting: true });

        caseService.delete(ids).then(() =>
        {
            setDelModel({ open: false, ids: [], deleting: false });
            setCaseState({
                selectedCaseIds: [],
            });
            refetch();
        }).catch((err: any) =>
        {
            toast({ type: 'error', message: err.message });
        });
    };

    const onOpenWf = (row: any) =>
    {
        window.location.href = `/station/workflow/${row.Id}`;
    };

    const onGridSort = (columns: any) =>
    {
        const sortOption = columns.map((c: any) =>
        {
            return {
                Field: c.id,
                Direction: c.direction === 'desc' ? 0 : 1,
            };
        });

        setCaseState({
            sortInfo: sortOption,
        });
    };
    const onRowSelectionChange = (row: any) =>
    {
        if (!row.x || !row.y)
        {
            spatialSearchStore.popups.clear();
            return;
        }

        setCaseState({
            selectedCase: row,
        });
        spatialSearchStore.addMapPopup(row);
    };

    const onMarkerClick = (data: any) =>
    {
        setCaseState({
            selectedCase: JSON.parse(JSON.stringify(data)),
        });
    };

    return (
        <Row className={'case-panel'}>
            <CaseFilter />
            <BorderPanel flex={1}>
                <PanelHeader>
                    <Row
                        className={'plate-detection-toolbar'}
                        crossAxisAlignment={'center'}
                    >
                        <FAIcon
                            icon={'list'}
                            size={'1.25rem'}
                            color={viewMode === VIEW_MODE.LIST ? 'var(--contrast-color)' : ''}
                            // tooltip={'Danh sách'}
                            onClick={() => setViewMode(VIEW_MODE.LIST)}
                        />
                        <Spacer size={'1.5rem'} />
                        <FAIcon
                            icon={'columns'}
                            size={'1.25rem'}
                            color={viewMode === VIEW_MODE.SPLIT ? 'var(--contrast-color)' : ''}
                            // tooltip={'Danh sách/Bản đồ'}
                            onClick={() => setViewMode(VIEW_MODE.SPLIT)}
                        />
                    </Row>
                </PanelHeader>
                <PanelBody>
                    <Row>
                        {viewMode !== VIEW_MODE.MAP && (
                            <Expanded>
                                <CaseGrid
                                    toolbarActions={(
                                        <>
                                            <Button
                                                text={'Tạo vụ việc'}
                                                color={'primary'}
                                                icon={'plus'}
                                                onClick={() => setCaseState({
                                                    caseForm: {
                                                        ...caseForm,
                                                        open: true,
                                                        mode: CaseFormMode.NEW,
                                                    },
                                                })}
                                            />
                                            <Button
                                                text={'Xóa vụ việc'}
                                                color={'danger'}
                                                disabled={!selectedCaseIds.length}
                                                icon={'trash'}
                                                onClick={() =>
                                                    setDelModel({
                                                        ...delModel,
                                                        ids: selectedCaseIds,
                                                        open: true,
                                                    })
                                                }
                                            />
                                        </>
                                    )}
                                    selectedCase={selectedCase}
                                    onEdit={(row: any) =>
                                    {
                                        setCaseState({ caseForm: {
                                            open: true,
                                            mode: CaseFormMode.EDIT,
                                            data: row,
                                        } });
                                    }}
                                    onViewHistory={(row: any) =>
                                    {
                                        setCaseHistoryForm({
                                            open: true,
                                            data: row,
                                        });
                                    }}
                                    onOpenWorkflow={onOpenWf}
                                    onRowCheckChange={onCaseSelectionChange}
                                    onAllRowCheckChange={onAllCaseSelectionChange}
                                    onSort={onGridSort}
                                    onRowSelectionChange={onRowSelectionChange}
                                />
                            </Expanded>
                        )}

                        <Expanded
                            className={`map-view ${viewMode === VIEW_MODE.LIST ? 'hidden' : ''}`}
                        >
                            <SpatialSearchMap
                                store={spatialSearchStore}
                                popupStore={markerPopupStore}
                                lprSources={cases}
                                onMarkerClick={onMarkerClick}
                            />
                        </Expanded>
                    </Row>
                </PanelBody>
            </BorderPanel>

            {/* {loading && <Loading />} */}

            {caseForm.open && (
                <CaseFormPopup
                    formType={caseForm.mode}
                    data={caseForm.data}
                    callback={caseFormCallback}
                    onClose={() =>
                    {
                        setCaseState({ caseForm: { ...caseForm, open: false } });
                    }}
                />
            )}

            {delModel.open && (
                <Confirm
                    title={'Xác nhận xóa'}
                    message={`Chắc chắn xóa ${selectedCaseIds.length || 1} vụ việc?`}
                    cancelText={'Hủy'}
                    okText={'Xóa'}
                    loading={delModel.deleting}
                    onCancel={() =>
                    {
                        setDelModel({ open: false });
                    }}
                    onOk={() =>
                    {
                        deleteCase(delModel.ids);
                    }}
                />
            )}

            {caseHistoryForm.open && (
                <Popup
                    width={'60%'}
                    height={'80%'}
                    padding={'0'}
                    title={`Xem lịch sử - ${caseHistoryForm?.data?.Title}`}
                    onClose={() => setCaseHistoryForm({ ...caseHistoryForm, open: false })}
                >
                    <NodeHistory
                        layerName={caseHistoryForm?.data?.Layer}
                        nodeId={caseHistoryForm?.data?.Id}
                    />
                </Popup>
            )}
        </Row>
    );
};

export { CasePanel };
