import { AdvanceSelect, Button, FormControlLabel, FormGroup, Input, RichText, Row } from "@vbd/vui";
import { inject, observer, PropTypes } from "mobx-react";
import { useEffect, useState } from "react";
import { initCategoryRequest } from "./CategoriesManagerPanel";

const AddNewCategory = (props) => {
    const { categoryObj, categoriesStore, editMode, onCreateCategoryComplete, onUpdateCategoryComplete, onCancelEdit, onChange } = props;
    const [title, setTitle] = useState(categoryObj.Title);
    const [slug, setSlug] = useState(categoryObj.slug);
    const [parentCategory, setParentCategory] = useState(categoryObj.parents_category);
    const [description, setDescription] = useState(categoryObj.Description);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        onChange({ title, slug, parentCategory, description });
    }, [title, slug, parentCategory, description]);

    const handleCreateCategory = async () => {
        setLoading(true);
        const rs = await categoriesStore.addCategory(categoryObj);
        await categoriesStore.loadData(initCategoryRequest);
        setLoading(false);

        if (onCreateCategoryComplete) onCreateCategoryComplete(rs);
    };

    const handleEditCategory = async () => {
        setLoading(true);
        const rs = await categoriesStore.editCategory(categoryObj);
        await categoriesStore.loadData(initCategoryRequest);
        setLoading(false);

        if (onUpdateCategoryComplete) onUpdateCategoryComplete(rs);
    };

    const convertSlugValue = (originalText) => {
        let value = originalText.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, "")
            .replaceAll(/đ/g, "d")
            .replaceAll(/Đ/g, "D");
        value = value.toLowerCase();
        value = value.replaceAll(' ', '-');
        return value;
    }

    return (
        <FormGroup>
            <FormControlLabel
                required
                label="Tên"
                control={(
                    <Input
                        type="text"
                        value={title}
                        onChange={(value) => {
                            setTitle(value);
                            setSlug(convertSlugValue(value));
                        }} />)}
            />
            <FormControlLabel
                label="Đường dẫn"
                control={(
                    <Input
                        type="text"
                        value={slug}
                        onChange={(value) => {
                            setSlug(convertSlugValue(value));
                        }} />)}
            />
            <FormControlLabel
                label="Chuyên mục cha"
                control={(
                    <AdvanceSelect
                        options={categoriesStore.data?.length ? categoriesStore.data.map((i) => { return { id: i.slug, label: i.Title } }) : []}
                        // noneSelectValue="Không chọn"
                        clearable
                        placeholder="Danh sách chuyên mục cha"
                        value={parentCategory}
                        onChange={(value) => { setParentCategory(value); }}
                    />)}
            />
            <FormControlLabel
                label="Mô tả"
                control={(
                    <RichText
                        value={description}
                        onChange={(value) => { setDescription(value); }} />)}
            />
            <Row>
                {
                    editMode ? <>
                        <Button
                            style={{ width: '10rem', marginRight: '1rem' }}
                            icon="pencil"
                            color='warning'
                            text="Cập nhật"
                            onClick={handleEditCategory}
                            isLoading={loading}
                        />
                        <Button
                            style={{ width: '10rem' }}
                            icon="times"
                            color='default'
                            text="Hủy"
                            onClick={onCancelEdit} /></>
                        : <Button
                            style={{ width: '10rem' }}
                            icon="plus"
                            color='success'
                            text="Thêm thẻ"
                            onClick={handleCreateCategory}
                            isLoading={loading} />
                }
            </Row>
        </FormGroup>
    )
};

AddNewCategory.propTypes = {
    categoryObj: PropTypes.any,
    editMode: PropTypes.bool,
    onChange: PropTypes.func,
    onCancelEdit: PropTypes.func,
    onCreateCategoryComplete: PropTypes.func,
    onUpdateCategoryComplete: PropTypes.func,
    categoriesStore: PropTypes.any
}

export default inject('ognlStore')(observer(AddNewCategory));