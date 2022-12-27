import { BorderPanel, Button, Column, Confirm, DataGrid, Drawer, PanelBody, PanelHeader, Row, useMergeState } from "@vbd/vui"
import { inject, observer } from "mobx-react"
import { useEffect, useState } from "react"
import { initCategoryRequest } from "../CategoriesManager/CategoriesManagerPanel"
import { initTagRequest } from "../TagsManager/TagsManagerPanel"
import ModifieldPostPanel from "./ModifieldPostPanel"

import './PostManagerPanel.scss'
import { initPostObj, initPostRequest } from "./PostStore"

let PostManagerPanel = (props) => {
    const { ognlStore } = props;
    const { tagsStore, categoriesStore, postStore } = ognlStore;

    const [postObj, setPostObj] = useMergeState(initPostObj);

    const [loading, setLoading] = useState(false);

    const [isOpenEditorPanel, setIsOpenEditorPanel] = useState(false);

    const [searchKey, setSearchKey] = useState('');
    const [pageStart, setPageStart] = useState(1);
    const [pageLength, setPageLength] = useState(10);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useMergeState({
        target: null,
        open: false
    });

    useEffect(() => {
        Promise.all([tagsStore.loadData(initTagRequest), categoriesStore.loadData(initCategoryRequest)]);
    }, []);

    useEffect(async () => {
        setLoading(true);
        const request = {
            ...initPostRequest, ...{
                searchKey: searchKey,
                start: pageStart * pageLength - pageLength,
                length: pageLength
            }
        }
        await postStore.loadData(request);
        setLoading(false);
    }, [searchKey, pageStart, pageLength]);

    const handleSearch = (value) => {
        if (window.searchPostTimeout) {
            clearInterval(window.searchPostTimeout);
        }
        window.searchPostTimeout = setTimeout(() => {
            setSearchKey(value);
        }, 1000);
    };

    const handleDeletePost = async (obj) => {
        setLoading(true);
        await postStore.deletePost(obj.Id);
        await postStore.loadData(initPostRequest);
        setLoading(false);
    }

    const handleCloseEditorPanel = () => {
        setIsOpenEditorPanel(false);
        setPostObj(initPostObj);
    }

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
                                setIsOpenEditorPanel(true);
                                setPostObj(row);
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

    return (
        <>
            <Row>
                <Column>
                    <BorderPanel>
                        <PanelHeader>
                            <Button
                                color={'success'}
                                className={'btn-add ellipsis'}
                                icon={'plus'}
                                text={'Bài viết mới'}
                                onClick={() => {
                                    setIsOpenEditorPanel(true);
                                }}
                            />
                        </PanelHeader>
                        <PanelBody>
                            <DataGrid
                                columns={postStore.columns}
                                items={postStore.data}
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
                                total={postStore.data.length}
                                loading={loading}
                                rowNumber
                                trailingControlColumns={[actionsColumn]}
                            />
                        </PanelBody>
                    </BorderPanel>
                </Column>
            </Row>
            {
                isOpenEditorPanel &&
                <Drawer width="80%" position="right" animationIn="bounceInRight" animationOut="bounceOutRight" onClose={handleCloseEditorPanel} scroll={true} showCloseIcon={true}>
                    <ModifieldPostPanel obj={postObj} openEditorPanel={setIsOpenEditorPanel} />
                </Drawer>
            }
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
                            await handleDeletePost(confirmDeleteOpen.target);
                            setConfirmDeleteOpen({ open: false, target: null });
                        }}
                        focusOn="ok" />
                )
            }
        </>
    );
}

PostManagerPanel = inject('ognlStore')(observer(PostManagerPanel))

export default PostManagerPanel;