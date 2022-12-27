import { PanelBody, Column, DataGrid, Row, BorderPanel, Button, useMergeState, Panel, Confirm } from "@vbd/vui";
import { LAYERDATARURL, LAYERNAME, RETURNFIELDS } from "extends/ognl/constant/LayerInfo";
import { inject, observer } from "mobx-react";
import { useEffect, useState } from "react";
import AddNewTag from "./AddNewTag";

export const initTagRequest = {
    path: LAYERDATARURL.TAG,
    layers: [LAYERNAME.TAG],
    searchKey: '',
    start: 0,
    count: 10,
    returnFields: [...['*'], ...RETURNFIELDS.TAG],
    sortOption: { SortInfo: [{ Field: 'CreatedDate', Direction: 1 }] }
}
export const initTagObj = {
    Title: '',
    Description: '',
    slug: ''
}
let TagsManagerPanel = (props) => {
    const { ognlStore } = props;
    const { tagsStore } = ognlStore;

    const [loading, setLoading] = useState(false);
    const [tagObj, setTagObj] = useMergeState(initTagObj);

    const [searchKey, setSearchKey] = useState('');
    const [pageStart, setPageStart] = useState(1);
    const [pageLength, setPageLength] = useState(10);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useMergeState({
        target: null,
        open: false
    });
    const [editMode, setEditMode] = useState(false);

    const actionsColumn = {
        id: 'guid',
        headerCellRender: <span>Thao tác</span>,
        width: 100,
        freezeEnd: true,
        rowCellRender: function ActionsField(row, index) {
            return (
                <Column mainAxisAlignment="center" crossAxisAlignment="center" itemMargin="md">
                    <Row>
                        <Button
                            style={{ marginRight: "0.5rem" }}
                            icon='edit'
                            color="warning"
                            onlyIcon
                            onClick={() => {
                                setEditMode(true);
                                setTagObj(row);
                            }}
                        />
                        <Button
                            icon={'trash-alt'}
                            color='danger'
                            onlyIcon
                            onClick={() => {
                                setConfirmDeleteOpen({ target: row, open: true });
                            }}
                        />

                    </Row>
                </Column>
            );
        },
    };

    useEffect(async () => {
        setLoading(true);
        const request = {
            ...initTagRequest, ...{
                searchKey: searchKey,
                start: pageStart * pageLength - pageLength,
                length: pageLength
            }
        }
        await tagsStore.loadData(request);
        setLoading(false);
    }, [searchKey, pageStart, pageLength]);

    const handleSearch = (value) => {
        if (window.searchSlugTimeout) {
            clearInterval(window.searchSlugTimeout);
        }
        window.searchSlugTimeout = setTimeout(() => {
            setSearchKey(value);
        }, 1000);
    };

    const handleDeleteTag = async (obj) => {
        setLoading(true);
        await tagsStore.deleteTag(obj.Id);
        await tagsStore.loadData(initTagRequest);
        setLoading(false);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setTagObj(initTagObj);
    };

    return (
        <Row>
            <Column>
                <Panel className="card">
                    <PanelBody>
                        <AddNewTag
                            tagObj={tagObj}
                            onChange={({ title, description, slug }) => {
                                setTagObj({
                                    Title: title,
                                    Description: description,
                                    slug: slug
                                });
                            }}
                            editMode={editMode}
                            setEditMode={setEditMode}
                            onCancelEdit={handleCancelEdit}
                            tagsStore={tagsStore}
                            onAddTagComplete={() => {
                                setTagObj(initTagObj);
                            }}
                            onUpdateTagComplete={() => {
                                setEditMode(false);
                                setTagObj(initTagObj);
                            }} />
                    </PanelBody>
                </Panel>
            </Column>
            <Column>
                <BorderPanel>
                    <PanelBody>
                        <DataGrid
                            columns={tagsStore.columns}
                            items={tagsStore.data}
                            rowKey={'Id'}
                            searching={{
                                searchKey,
                                onSearch: handleSearch,
                            }}
                            pagination={{
                                pageIndex: pageStart,
                                pageSize: pageLength,
                                pageSizeOptions: [10, 20, 50, 100],
                                onChangePage: (pageIndex) => { setPageStart(pageIndex) },
                                onChangeItemsPerPage: (pageSize) => { setPageLength(pageSize) },
                            }}
                            total={tagsStore.data.length}
                            loading={loading}
                            trailingControlColumns={[actionsColumn]}
                            rowNumber
                        />
                    </PanelBody>
                </BorderPanel>
            </Column>
            {
                confirmDeleteOpen?.open && (
                    <Confirm
                        title={'Xác nhận xóa'}
                        message={`Hệ thống sẽ thực hiện xóa thẻ ${confirmDeleteOpen?.target?.Title || ""} ?`}
                        cancelText={'Hủy'}
                        okText={'Tiếp tục'}
                        loading={loading}
                        onCancel={() => {
                            setConfirmDeleteOpen({ open: false, target: null });
                        }}
                        onOk={async () => {
                            await handleDeleteTag(confirmDeleteOpen.target);
                            setConfirmDeleteOpen({ open: false, target: null });
                        }}
                        focusOn='ok' />
                )
            }
        </Row >
    );
}
TagsManagerPanel = inject('ognlStore')(observer(TagsManagerPanel));
export default TagsManagerPanel;