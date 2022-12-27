import { Button, FormControlLabel, FormGroup, Input, RichText, Row } from "@vbd/vui";
import { inject, observer, PropTypes } from "mobx-react"
import { useEffect, useState } from "react";
import { initTagRequest } from "./TagsManagerPanel";

const AddNewTag = (props) => {
    const { tagObj, onChange, editMode, onCancelEdit, tagsStore, onAddTagComplete, onUpdateTagComplete } = props;
    const [title, setTitle] = useState(tagObj.Title);
    const [slug, setSlug] = useState(tagObj.slug);
    const [description, setDescription] = useState(tagObj.Description);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        onChange({ title, slug, description });
    }, [title, slug, description]);

    useEffect(() => {
        setSlug(convertSlugValue(title));
    }, [title]);

    const handleCreateTag = async () => {
        setLoading(true);
        const rs = await tagsStore.addTag(tagObj);
        await tagsStore.loadData(initTagRequest);
        setLoading(false);
        if (onAddTagComplete) { onAddTagComplete(rs); }
    };

    const handleEditTag = async () => {
        setLoading(true);
        const rs = await tagsStore.editTag(tagObj);
        await tagsStore.loadData(initTagRequest);
        setLoading(false);
        if (onUpdateTagComplete) { onUpdateTagComplete(rs); }
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
                        value={tagObj.Title}
                        onChange={(value) => { setTitle(value); }} />)}
            />
            <FormControlLabel
                label="Đường dẫn"
                control={(
                    <Input
                        type="text"
                        value={tagObj.slug}
                        onChange={(value) => { setSlug(convertSlugValue(value)); }} />)}
            />
            <FormControlLabel
                label="Mô tả"
                control={(
                    <RichText
                        value={tagObj.Description}
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
                            onClick={handleEditTag}
                            isLoading={loading}
                        />
                        <Button
                            style={{ width: '10rem' }}
                            icon="times"
                            color='default'
                            text="Hủy"
                            onClick={() => { onCancelEdit() }} /></>
                        : <Button
                            style={{ width: '10rem' }}
                            icon="plus"
                            color='success'
                            text="Thêm thẻ"
                            onClick={handleCreateTag}
                            isLoading={loading} />
                }
            </Row>
        </FormGroup>
    );
};
AddNewTag.propTypes = {
    tagObj: PropTypes.any,
    editMode: PropTypes.bool,
    onChange: PropTypes.func,
    onCancelEdit: PropTypes.func,
    onAddTagComplete: PropTypes.func,
    onUpdateTagComplete: PropTypes.func
}

export default inject('ognlStore')(observer(AddNewTag));