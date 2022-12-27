import { AdvanceSelect, Container, FormControlLabel, Slider } from "@vbd/vui";
import { initPostRequest } from "extends/ognl/pages/PostManager/PostStore";
import _ from "lodash";
import { inject, observer } from "mobx-react";
import { useEffect, useState } from "react";
import BaseConfiguration from "../BaseConfiguration";
// import './ImagePlaylistConfiguration.scss';

// interface ConfigParameters {
//     showLabel?: boolean,
//     label?: string,
//     numberOfImages?: number,
//     postId?: string
// }

const ImagePlaylistConfiguration = (props) => {
    const { config, onChange, ognlStore } = props;
    const { postStore } = ognlStore;
    const [mediaPosts, setMediaPosts] = useState([]);

    const [label, setLabel] = useState(config?.label || '');
    const [numberOfImages, setNumberOfImages] = useState(config.numberOfImages || 5);
    const [postId, setPostId] = useState(config.postId || '');
    const [showLabel, setShowLabel] = useState(config?.showLabel || true);

    useEffect(() => {
        const value = { label, numberOfImages, postId, showLabel };
        if (onChange) onChange(value);
    }, [label, numberOfImages, postId, showLabel]);

    useEffect(() => {
        const init = async () => {
            const rs = await postStore.loadData({
                ...initPostRequest, ...{
                    filterQuery: ['type:1'],
                    start: 0,
                    count: -1
                }
            });
            if (rs?.status?.code === 200) {
                setMediaPosts(rs.data);
            }
        };
        init();
    }, []);

    return (
        <Container className='custom-html-container'>
            <BaseConfiguration onChange={(value) => {
                setLabel(value.label);
                setShowLabel(value.showLabel);
            }} config={{ label, showLabel }} />
            <FormControlLabel
                label="Bài viết"
                direction="column"
                control={(
                    <AdvanceSelect
                        options={mediaPosts.length ? mediaPosts.map((i) => { return { id: i.Id, label: i.Title } }) : []}
                        noneSelectValue="---Ảnh theo bài viết---"
                        clearable
                        value={postId}
                        onChange={(value) => { setPostId(value); }}
                    />
                )} />
            {_.isEmpty(postId) && <FormControlLabel
                label="Số lượng ảnh hiển thị"
                direction="column"
                control={(
                    <Slider
                        value={numberOfImages}
                        min={1}
                        max={10}
                        step={1}
                        marks={{
                            0: '0',
                            10: '1',
                            20: '2',
                            30: '3',
                            40: '4',
                            50: '5',
                            60: '6',
                            70: '7',
                            80: '8',
                            90: '9',
                            100: '10',
                        }}
                        onChange={(value) => {
                            //TODO:Assigning label config to the component
                            setNumberOfImages(value);
                        }} />
                )} />}
        </Container>
    );
}

export default inject('ognlStore')(observer(ImagePlaylistConfiguration));