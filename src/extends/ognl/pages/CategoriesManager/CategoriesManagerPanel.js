import { PanelBody, Column, RichText, useMergeState, Button, Row, BorderPanel, Confirm, FormControlLabel, FormGroup, Panel, AdvanceSelect, DataGrid, Input } from "@vbd/vui";
import { LAYERDATARURL, LAYERNAME, RETURNFIELDS } from "extends/ognl/constant/LayerInfo";
import { inject, observer } from "mobx-react";
import { useEffect, useState } from "react";
import AddNewCategory from "./AddNewCategory";

export const initCategoryRequest = {
    path: LAYERDATARURL.CATEGORY,
    layers: [LAYERNAME.CATEGORY],
    searchKey: '',
    start: 0,
    count: 10,
    returnFields: [...['*'], ...RETURNFIELDS.CATEGORY],
    sortOption: { SortInfo: [{ Field: 'CreatedDate', Direction: 1 }] }
}
export const initCategoryObj = {
    Title: '',
    Description: '',
    parents_category: [],
    slug: ''
}
let CategoriesManagerPanel = (props) => {
    const { ognlStore } = props;
    const { categoriesStore } = ognlStore;
    const [loading, setLoading] = useState(false);
    const [categoryObj, setCategoryObj] = useMergeState(initCategoryObj);

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
                <Column
                    itemMargin="md"
                    crossAxisAlignment="center"
                    mainAxisAlignment="center"
                >
                    <Row>
                        <Button
                            style={{ marginRight: "0.5rem" }}
                            icon='edit'
                            color="warning"
                            onlyIcon
                            onClick={() => {
                                setEditMode(true);
                                setCategoryObj(row);
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

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const request = {
                ...initCategoryRequest, ...{
                    searchKey: searchKey,
                    start: pageStart * pageLength - pageLength,
                    length: pageLength
                }
            }
            await categoriesStore.loadData(request);
            setLoading(false);
        }
        init();

    }, [searchKey, pageStart, pageLength]);   

    const handleSearch = (value) => {
        if (window.searchSlugTimeout) {
            clearInterval(window.searchSlugTimeout);
        }
        window.searchSlugTimeout = setTimeout(() => {
            setSearchKey(value);
        }, 1000);
    };

    const handleDeleteCategory = async (obj) => {
        setLoading(true);
        await categoriesStore.deleteCategory(obj.Id);
        await categoriesStore.loadData(initCategoryRequest);
        setLoading(false);
    }
    return (
        <Row>
            <Column>
                <Panel className="card">
                    <PanelBody>
                        <AddNewCategory
                            categoryObj={categoryObj}
                            categoriesStore={categoriesStore}
                            editMode={editMode}
                            onCancelEdit={() => {
                                setEditMode(false);
                                setCategoryObj(initCategoryObj);
                            }}
                            onChange={(category) => {
                                setCategoryObj({
                                    Title: category.title,
                                    Description: category.description,
                                    slug: category.slug,
                                    parents_category: category.parentCategory
                                });
                            }}
                            onAddCategoryComplete={(result) => {
                                setCategoryObj(initCategoryObj);
                                if (result?.status?.success)
                                    toast({ message: `Thêm thành công ${result.data.Title} !`, type: 'success' });
                                else
                                    toast({ message: `Thêm danh mục gặp lỗi : <b><i>${result.error.message}</i></b>`, type: 'error' });
                            }}
                            onUpdateCategoryComplete={(result) => {
                                setEditMode(false);
                                setCategoryObj(initCategoryObj);
                                if (result?.status?.success)
                                    toast({ message: `Cập nhật thành công ${result.data.Title} !`, type: 'success' });
                                else
                                    toast({ message: `Cập nhật danh mục gặp lỗi : <b><i>${result.error.message}</i></b>`, type: 'error' });
                            }}
                        />
                    </PanelBody>
                </Panel>
            </Column>
            <Column>
                <BorderPanel>
                    <PanelBody>
                        <DataGrid
                            columns={categoriesStore.columns}
                            items={categoriesStore.data}
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
                            total={categoriesStore.data.length}
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
                        message={`Hệ thống sẽ thực hiện xóa danh mục ${confirmDeleteOpen.target.Title} ?`}
                        cancelText={'Hủy'}
                        okText={'Tiếp tục'}
                        loading={loading}
                        onCancel={() => {
                            setConfirmDeleteOpen({ open: false, target: null });
                        }}
                        onOk={async () => {
                            await handleDeleteCategory(confirmDeleteOpen.target);
                            setConfirmDeleteOpen({ open: false, target: null });
                        }}
                    />
                )
            }
        </Row >
    );
}
CategoriesManagerPanel = inject('ognlStore')(observer(CategoriesManagerPanel));
export default CategoriesManagerPanel;