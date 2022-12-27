import { AdvanceSelect, CheckBox, Container, FormControlLabel, Slider } from "@vbd/vui";
import { initCategoryRequest } from "extends/ognl/pages/CategoriesManager/CategoriesManagerPanel";
import { inject, observer } from "mobx-react";
import { useEffect, useState } from "react";
import BaseConfiguration from "../BaseConfiguration";
// import './PostWidgetConfiguration.scss';

// interface ConfigParameters {
//     highlightFirstChild?: boolean,
//     showLabel?: boolean,
//     label?: string,
//     numberOfPosts?: number,
//     postsByCategory?: string[],
//     postsByTags?: string[],
//     sortBy?
// }

const PostWidgetConfiguration = (props) => {
    const { config, onChange, ognlStore } = props;
    const { categoriesStore } = ognlStore;
    const [label, setLabel] = useState(config?.label || '');
    const [numberOfPosts, setNumberOfPosts] = useState(config?.numberOfPosts || 5);
    const [postsByCategory, setPostByCategory] = useState(config?.postsByCategory || []);
    // const [postsByTags, setPostsByTags] = useState(config?.postsByTags || []);
    const [sortBy, setSortBy] = useState(config?.sortBy || { Field: "ModifieldDate", Direction: 1 });
    const [showLabel, setShowLabel] = useState(config?.showLabel || true);
    const [highlightFirstChild, setHighlightFirstChild] = useState(config?.highlightFirstChild || true);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const value = { label, numberOfPosts, postsByCategory, sortBy, showLabel, highlightFirstChild };
        if (onChange) onChange(value);
    }, [label, numberOfPosts, postsByCategory, sortBy, showLabel, highlightFirstChild]);

    useEffect(() => {
        const init = async () => {
            const rs = await categoriesStore.loadData({
                ...initCategoryRequest, ...{
                    start: 0,
                    length: -1
                }
            });
            if (rs?.status?.success) setCategories(rs?.data);
        };
        init();
    }, []);

    return (
        <Container className='custom-html-container'>
            <BaseConfiguration onChange={(value) => {
                setLabel(value.label);
                setShowLabel(value.showLabel);
            }} config={{ label, showLabel }} />
            <CheckBox
                label="Nổi bật tin đầu tiên"
                checked={highlightFirstChild}
                onChange={(value) => {
                    setHighlightFirstChild(value);
                }}
            />
            <FormControlLabel
                label="Số lượng bài viết hiển thị"
                direction="column"
                control={(
                    <Slider
                        value={numberOfPosts}
                        min={1}
                        max={10}
                        step={1}
                        marks={{
                            10: '1',
                            50: '5',
                            100: '10',
                        }}
                        onChange={(value) => {
                            //TODO:Assigning label config to the component
                            setNumberOfPosts(value);
                        }} />
                )} />
            <FormControlLabel
                label="Chuyên mục"
                direction="column"
                control={(
                    <AdvanceSelect
                        options={categories.map((i) => { return { id: i.slug, label: i.Title } })}
                        noneSelectValue="---Tất cả---"
                        placeholder="Danh sách chuyên mục"
                        value={postsByCategory}
                        onChange={(value) => { setPostByCategory(value); }}
                    />
                )} />
            <FormControlLabel
                label="Sắp xếp theo"
                direction="column"
                control={(
                    <>
                        <AdvanceSelect
                            options={[{ id: "ModifielDate", label: 'Ngày' }, { id: "Title", label: 'Tiêu đề' }]}
                            value={sortBy.Field}
                            onChange={(value) => { setSortBy({ ...sortBy, ...{ Field: value } }); }}
                        />
                        <Container style={{ marginTop: "0.5rem" }}>
                            <AdvanceSelect
                                options={[{ id: "0", label: 'Cũ nhất' }, { id: "1", label: 'Mới nhất' }]}
                                value={sortBy.Direction.toString()}
                                onChange={(value) => { setSortBy({ ...sortBy, ...{ Direction: parseInt(value) } }); }}
                            />
                        </Container>
                    </>
                )} />
        </Container>
    );
}

export default inject('ognlStore')(observer(PostWidgetConfiguration));