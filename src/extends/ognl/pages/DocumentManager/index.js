import { Row, Column, Panel, PanelBody, FormGroup, FormControlLabel, Input, Button, BorderPanel, Confirm, useMergeState, AdvanceSelect, DateTimePicker, useModal } from "@vbd/vui";
import NewDocument from "extends/ognl/components/app/NewDocument";
import { DOCUMENT_TYPE, ISSUING_ORGANIZATION } from "extends/ognl/constant/LayerInfo";
import { inject, observer } from "mobx-react";
import { useState, useEffect } from 'react';
import moment from "moment";
import { initDocument } from "./DocumentStore";
import UploadFileControl from "extends/ognl/components/base/UploadFileControl";

const DocumentManager = (props) => {
    const { ognlStore: { documentStore } } = props;

    const [docObj, setDocObj] = useMergeState(initDocument);
    const [confirmOpen, setConfirmOpen] = useMergeState({
        target: null,
        open: false,
        action: null
    });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataValid, setDataValid] = useState(false);

    const { alert } = useModal();

    useEffect(() => {
        if (docObj.soHieu && docObj.trichYeu && docObj.loaiVanBan > -1 && docObj.donVi > -1 && moment(docObj.hieuLucTuNgay) < moment(docObj.hieuLucDenNgay) && docObj.file != null) {
            //File đã upload lên server
            if (typeof docObj.file === "string") {
                const file = JSON.parse(docObj.file);
                if (file?.guid) {
                    setDataValid(true);
                }
            } else
                //File từ dưới đẩy lên
                setDataValid(true);
        }
    }, [docObj]);

    const allowedExtensions =
        /(\.pdf|\.doc|\.docx|\.xlsx)$/i;

    const columns = [{
        hidden: false,
        id: 'hieuLucDenNgayDisplay',
        displayAsText: 'Ngày hết hiệu lực'
    }, {
        hidden: false,
        id: 'loaiVanBan',
        displayAsText: 'Loại văn bản',
        schema: 'select',
        isSortable: true,
        defaultSortDirection: 'desc',
        options: DOCUMENT_TYPE.map((dt) => ({ id: DOCUMENT_TYPE.indexOf(dt), label: dt })),
    }, {
        hidden: false,
        id: 'donVi',
        displayAsText: 'Đơn vị',
        schema: 'select',
        isSortable: true,
        defaultSortDirection: 'desc',
        options: ISSUING_ORGANIZATION.map((io) => ({ id: ISSUING_ORGANIZATION.indexOf(io), label: io })),
    }];

    const actionsColumn = {
        id: 'guid',
        headerCellRender: <span>Thao tác</span>,
        width: 150,
        freezeEnd: true,
        rowCellRender: function ActionsField(row, index) {
            return (
                <Column
                    itemMargin="md"
                    crossAxisAlignment="center"
                    mainAxisAlignment="center"
                    flex={1}
                >
                    <Row>
                        <Button
                            style={{ marginRight: "0.5rem" }}
                            icon='eye'
                            color="success"
                            onlyIcon
                            onClick={() => { handleSeeDocument(row); }}
                            tooltip={'Xem văn bản'}
                        />
                        <Button
                            style={{ marginRight: "0.5rem" }}
                            icon='edit'
                            color="warning"
                            onlyIcon
                            onClick={() => {
                                setEditMode(true);
                                setDocObj(row);
                            }}
                            tooltip={'Sửa văn bản'}
                        />
                        <Button
                            icon={'trash-alt'}
                            color='danger'
                            onlyIcon
                            onClick={() => {
                                setConfirmOpen({ target: row, open: true, action: 'delete' });
                            }}
                            tooltip={'Xóa văn bản'}
                        />
                    </Row>
                </Column>
            );
        },
    };

    const handleCreateDocument = async (doc) => {
        setLoading(true);
        const result = await documentStore.addDocument(doc);
        setLoading(false);
        return result;
    };

    const handleEditDocument = async (doc) => {
        setLoading(true);
        const result = await documentStore.editDocument(doc);
        setLoading(false);
        return result;
    };

    const handleDeleteDocument = async (doc) => {
        setLoading(true);
        const result = await documentStore.deleteDocument(doc.Id);
        setLoading(false);
        return result;
    };

    const getTextByAction = (action) => {
        switch (action) {
            case 'create':
                return 'thêm';
            case 'edit':
                return 'sửa';
            case 'delete':
                return 'xóa';
        }
        return '';
    }

    const handleSeeDocument = async (doc) => {
        if (doc?.file) {
            const file = typeof doc.file === "string" ? JSON.parse(doc.file) : doc.file;
            const url = await documentStore.getDocumentUrl(file);
            window.open(url, '_blank');
        }
    }

    const handleConfirmationOk = async () => {
        let result = null;
        switch (confirmOpen.action) {
            case 'create':
                result = await handleCreateDocument(confirmOpen.target);
                break;
            case 'edit':
                result = await handleEditDocument(confirmOpen.target);
                break;
            case 'delete':
                result = await handleDeleteDocument(confirmOpen.target);
                break;
        }
        if (!result?.status?.success) {
            alert({ title: `Thực hiện <b>${getTextByAction(confirmOpen.action)}</b> văn bản gặp lỗi !!`, message: result.status.message });
        } else
            documentStore.setRefresh(true);

        //Reset form
        setEditMode(false);
        setDocObj(initDocument);
        setConfirmOpen({ open: false, target: null, action: null });
    };

    return (
        <Row>
            <Column flex={1}>
                <Panel className="card">
                    <PanelBody>
                        <FormGroup>
                            <FormControlLabel
                                required
                                label="Số hiệu"
                                control={(
                                    <Input
                                        type="text"
                                        value={docObj?.soHieu ?? ''}
                                        onChange={(value) => { setDocObj({ ...docObj, ...{ soHieu: value } }); }} />)}
                            />
                            <FormControlLabel
                                required
                                label="Trích yếu"
                                control={(
                                    <Input
                                        type="text"
                                        value={docObj?.trichYeu ?? ''}
                                        onChange={(value) => { setDocObj({ ...docObj, ...{ trichYeu: value } }); }} />)}
                            />
                            <FormControlLabel
                                required
                                label="Ngày hiệu lực"
                                control={(
                                    <DateTimePicker
                                        placeholder={'Chọn ngày hiệu lực'}
                                        type={'date'}
                                        disabled={loading}
                                        minDate={moment()}
                                        value={docObj?.hieuLucTuNgay ?? ''}
                                        onChange={(value) => { console.log(value); setDocObj({ ...docObj, ...{ hieuLucTuNgay: value } }); }}
                                    />
                                )}
                            />
                            <FormControlLabel
                                required
                                label="Ngày hết hiệu lực"
                                control={(
                                    <DateTimePicker
                                        placeholder={'Chọn ngày hết hiệu lực'}
                                        type={'date'}
                                        disabled={loading}
                                        minDate={docObj?.hieuLucTuNgay || moment()}
                                        value={docObj?.hieuLucDenNgay ?? ''}
                                        onChange={(value) => { console.log(value); setDocObj({ ...docObj, ...{ hieuLucDenNgay: value } }); }}
                                    />
                                )}
                            />
                            <FormControlLabel
                                required
                                label="Loại văn bản"
                                control={(
                                    <AdvanceSelect
                                        options={DOCUMENT_TYPE.map((dt) => { return { id: DOCUMENT_TYPE.indexOf(dt), label: dt } })}
                                        // noneSelectValue="Không chọn"
                                        clearable
                                        placeholder="Danh sách loại văn bản"
                                        value={docObj?.loaiVanBan || ''}
                                        onChange={(value) => { setDocObj({ ...docObj, ...{ loaiVanBan: value } }); }}
                                    />)}
                            />
                            <FormControlLabel
                                required
                                label="Đơn vị"
                                control={(
                                    <AdvanceSelect
                                        options={ISSUING_ORGANIZATION.map((io) => { return { id: ISSUING_ORGANIZATION.indexOf(io), label: io } })}
                                        // noneSelectValue="Không chọn"
                                        clearable
                                        placeholder="Danh sách đơn vị"
                                        value={docObj?.donVi || ''}
                                        onChange={(value) => { setDocObj({ ...docObj, ...{ donVi: value } }); }}
                                    />)}
                            />
                            <FormControlLabel
                                required
                                label="Văn bản"
                                control={(
                                    <UploadFileControl value={docObj.file} onChange={(value) => {
                                        const { fileName, data, file } = value;
                                        if (allowedExtensions.exec(fileName)) {
                                            setDocObj({ ...docObj, ...{ file: file } });
                                        }
                                    }} />
                                )}
                            />
                            <Row>
                                {
                                    editMode ? <>
                                        <Button
                                            style={{ width: '10rem', marginRight: '1rem' }}
                                            icon="pencil"
                                            color='warning'
                                            text="Cập nhật văn bản"
                                            disabled={loading || !dataValid}
                                            onClick={() => {
                                                setConfirmOpen({
                                                    target: docObj,
                                                    open: true,
                                                    action: "edit"
                                                });
                                            }}
                                        />
                                        <Button
                                            style={{ width: '10rem' }}
                                            icon="times"
                                            color='default'
                                            text="Hủy"
                                            onClick={() => {
                                                setEditMode(false);
                                                setDocObj(initDocument);
                                            }} /></>
                                        : <Button
                                            style={{ width: '10rem' }}
                                            icon="plus"
                                            color='success'
                                            text="Thêm văn bản"
                                            disabled={loading || !dataValid}
                                            onClick={() => {
                                                setConfirmOpen({
                                                    target: docObj,
                                                    open: true,
                                                    action: 'create'
                                                });
                                            }} />
                                }
                            </Row>

                        </FormGroup>
                    </PanelBody>
                </Panel>
            </Column>
            <Column flex={2}>
                <BorderPanel>
                    <PanelBody>
                        <NewDocument paging={true} showTitle={false} columns={columns} pageLength={50} actionsColumn={actionsColumn} />
                    </PanelBody>
                </BorderPanel>
            </Column>
            {
                confirmOpen?.open && (
                    <>
                        <Confirm
                            title={`Xác nhận ${getTextByAction(confirmOpen.action)}`}
                            message={`Hệ thống sẽ thực hiện ${getTextByAction(confirmOpen.action)} văn bản ${confirmOpen?.target?.Title || ""} ?`}
                            cancelText={'Hủy'}
                            okText={'Tiếp tục'}
                            loading={loading}
                            onCancel={() => {
                                setConfirmOpen({ open: false, target: null, action: null });
                            }}
                            onOk={handleConfirmationOk}
                            focusOn="ok" />
                    </>
                )
            }
        </Row >
    );
}

export default inject('ognlStore')(observer(DocumentManager));
