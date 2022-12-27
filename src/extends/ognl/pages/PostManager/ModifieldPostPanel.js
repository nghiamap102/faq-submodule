import {
    Container,
    FormControlLabel,
    Input,
    useMergeState,
    Button,
    PanelBody,
    FormGroup,
    Panel,
    CheckBoxGroup,
    CheckBox,
    UploadImage,
    AdvanceSelect,
    Row,
    Column, Confirm, EmptyButton, InputAppend, InputGroup, FAIcon, InputPrepend, Row2, PopupFooter, Popup, useModal
} from "@vbd/vui";
import RichTextEditor from "extends/ognl/components/base/RichTextEditor";
import UploadFileControl from "extends/ognl/components/base/UploadFileControl";
import { POST_STATUS, POST_TYPE, POST_VISIBILITY } from "extends/ognl/constant/LayerInfo";
import _ from "lodash";
import { inject, observer } from "mobx-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { initPostObj, initPostRequest } from "./PostStore";
const initVideoLink = { type: 'video', fileName: null, source: { src: null, provider: 'youtube' } };

import Editor from 'react-simple-code-editor'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import AddNewTag from "../TagsManager/AddNewTag";
import { initTagObj } from "../TagsManager/TagsManagerPanel";
import { initCategoryObj } from "../CategoriesManager/CategoriesManagerPanel";
import AddNewCategory from "../CategoriesManager/AddNewCategory";


let ModifieldPostPanel = (props) => {
    const { obj, ognlStore, openEditorPanel } = props;
    const { tagsStore, categoriesStore, postStore } = ognlStore;
    const [postObj, setPostObj] = useMergeState(obj || initPostObj);
    const [showConfirmPost, setShowConfirmPost] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openSettingPanel, setOpenSettingPanel] = useState(true);
    const [uploads, setUploads] = useState([]);
    const [videoLink, setVideoLink] = useState(initVideoLink);
    const [postObjValidity, setPostObjValidity] = useState(false);
    const [viewMode, setViewMode] = useState('editor');
    const [openAddNewCategoryModal, setOpenAddNewCategoryModal] = useState(false);
    const [openAddNewTagModal, setOpenAddNewTagModal] = useState(false);
    const { toast } = useModal();

    const [tagObj, setTagObj] = useState(initTagObj);
    const [categoryObj, setCategoryObj] = useState(initCategoryObj);


    const handleSaveDraftClick = () => {
        setPostObj({ ...postObj, ...{ trangThai: POST_STATUS.DRAFT } });
        setShowConfirmPost(true);
    }
    const handlePublishClick = () => {
        setPostObj({ ...postObj, ...{ trangThai: POST_STATUS.PUBLISH } });
        setShowConfirmPost(true);
    }

    const isPostValid = () => {
        let isValid = false;
        isValid = !_.isEmpty(postObj.Title) && (postObj.type === 1 && uploads.length > 0);
        return isValid;
    }

    useLayoutEffect(() => {
        const getPostMedias = async () => {
            const mediaIds = postObj.noiDung.split(',');
            const uploadData = await postStore.getPostMedias({ filterQuery: [`(${mediaIds.join(' OR ')})`] });
            console.log(uploadData);
            setUploads(uploadData);
        }
        if (postObj.Id && postObj.type === 1 && !_.isEmpty(postObj.noiDung)) {
            getPostMedias();
        }

    }, [postObj?.Id]);

    useEffect(() => {
        setPostObjValidity(isPostValid());
        console.log(postObj);
        console.log(uploads);

    }, [postObj, uploads]);

    const highlight = code => (
        <Highlight {...defaultProps} theme={theme} code={code} language="html">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <Container>
                    {tokens.map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => <span {...getTokenProps({ token, key })} />)}
                        </div>
                    ))}
                </Container>
            )}
        </Highlight>
    );

    return (
        <>
            <Container className={'modifield-post-panel'}>
                <Row className='post-header'>
                    {/* <Column mainAxisAlignment="start" crossAxisAlignment="start"><HD6>Thêm mới bài viết</HD6></Column> */}
                    <Column mainAxisAlignment="end" crossAxisAlignment="end">
                        <Row >
                            <Button color='primary' disabled={!postObjValidity} onClick={handlePublishClick} text="Publish" icon="cloud-upload-alt" style={{ marginRight: '0.5rem' }} />
                            <Button color='info' disabled={!postObjValidity} onClick={handleSaveDraftClick} text="Save Draft" icon="save" style={{ marginRight: '0.5rem' }} />
                            <Button color='warning' icon='cog' disabled={!postObjValidity} onClick={() => { setOpenSettingPanel(!openSettingPanel) }} onlyIcon style={{ marginRight: '0.5rem' }} />
                        </Row>
                    </Column>
                </Row>
                <Row className='post-container'>
                    <Column flex={openSettingPanel ? 0.7 : 1} style={{ padding: '1rem' }}>
                        <Panel>
                            <PanelBody>
                                <FormGroup>
                                    <FormControlLabel
                                        required
                                        direction="column"
                                        label="Tiêu đề"
                                        control={(
                                            <Input
                                                type="text"
                                                value={postObj.Title || ''}
                                                onChange={(value) => { setPostObj({ ...postObj, ...{ Title: value } }); }} />)}
                                    />
                                    <FormControlLabel
                                        direction="column"
                                        label="Nội dung"
                                        control={postObj?.type === 0 ? (
                                            <>
                                                <Container className="toolbar">
                                                    <Button tooltip="Dạng code" iconType="regular" icon="file-alt" color={viewMode === 'code' ? 'primary' : 'default'} onlyIcon onClick={() => { setViewMode('code'); }} />
                                                    <Button iconType="regular" tooltip="Dạng soạn thảo" icon="file-code" onlyIcon color={viewMode === 'editor' ? 'primary' : 'default'} onClick={() => { setViewMode('editor'); }} />
                                                </Container>
                                                {viewMode === 'code' && <Editor
                                                    className="code-editor"
                                                    value={postObj.noiDung || ''}
                                                    onValueChange={(value) => {
                                                        setPostObj({
                                                            ...postObj, ...{ noiDung: value }
                                                        })
                                                    }}
                                                    highlight={highlight}
                                                    padding={10}
                                                    style={{ backgroundColor: "white", color: "#333" }}
                                                />}
                                                {viewMode === 'editor' && <RichTextEditor
                                                    placeholder='Nội dung bài viết ...'
                                                    onChange={(value) => {
                                                        setPostObj({
                                                            ...postObj, ...{ noiDung: value }
                                                        });
                                                    }}
                                                    value={postObj.noiDung || ''}
                                                />}
                                            </>
                                        ) : (
                                            <Column className="media-container">
                                                <Row>
                                                    <FormControlLabel
                                                        direction="column"
                                                        label="Từ máy tính"
                                                        className="from-computer"
                                                        control={(<UploadFileControl
                                                            accept="image/jpg,image/png,video/mp4"
                                                            placeholder="Chọn ảnh/video muốn upload"
                                                            multiple={true}
                                                            previewable={false}
                                                            onChange={(files) => {
                                                                setUploads([...uploads, ...files]);
                                                                console.log(files);
                                                            }} />)} />
                                                </Row>
                                                <Row>
                                                    <FormControlLabel
                                                        direction="column"
                                                        label="Từ nguồn khác"
                                                        className="from-other-source"
                                                        control={(
                                                            <InputGroup className={'add-link-control'}>
                                                                <InputPrepend>
                                                                    <AdvanceSelect
                                                                        options={[{ id: 'youtube', label: 'Youtube' }]}
                                                                        value='youtube'
                                                                        onChange={(value) => {
                                                                            setVideoLink({ ...videoLink, ...{ source: { ...videoLink.source, ...{ provider: value } } } });
                                                                        }}
                                                                    />
                                                                </InputPrepend>
                                                                <Input
                                                                    placeholder="VD:uMttlFywWAo trong https://www.youtube.com/watch?v=uMttlFywWAo"
                                                                    onChange={(value) => {
                                                                        setVideoLink({ ...videoLink, ...{ source: { ...videoLink.source, ...{ src: value } } } });
                                                                    }}
                                                                />
                                                                <Input
                                                                    placeholder="Tiêu đề"
                                                                    onChange={(value) => {
                                                                        setVideoLink({ ...videoLink, ...{ fileName: value } });
                                                                    }}
                                                                />
                                                                <InputAppend>
                                                                    <Row>
                                                                        <EmptyButton
                                                                            icon={'plus'}
                                                                            onlyIcon
                                                                            onClick={() => {
                                                                                setUploads([...uploads, ...[videoLink]]);
                                                                            }}
                                                                        />
                                                                    </Row>
                                                                </InputAppend>
                                                            </InputGroup>
                                                        )} />
                                                </Row>
                                                {uploads?.length > 0 && (
                                                    <Row>
                                                        <Column className="media-review">
                                                            <FormControlLabel
                                                                direction="column"
                                                                label="Xem trước"
                                                                className="from-computer"
                                                                control={uploads.map((fsu) => (
                                                                    <Row key={uploads.indexOf(fsu)} className='upload-file-item'>
                                                                        {fsu?.type?.includes('video') ? (<FAIcon icon={fsu?.source?.provider ? fsu.source.provider : 'video'} type={fsu?.source?.provider ? "brands" : 'solid'} />) : (<FAIcon icon='image' type={"solid"} />)}
                                                                        {fsu?.fileName ? fsu.fileName : ''}
                                                                        <EmptyButton className="remove-media-button" onlyIcon icon="trash" onClick={() => {
                                                                            setUploads(uploads.filter(u => uploads.indexOf(u) !== uploads.indexOf(fsu)));
                                                                        }} />
                                                                    </Row>))} />
                                                        </Column>
                                                    </Row>
                                                )}
                                            </Column>
                                        )} />
                                </FormGroup>
                            </PanelBody>
                        </Panel>
                    </Column>
                    {
                        openSettingPanel && <Column flex={0.3}>
                            <Panel>
                                <PanelBody>
                                    <FormGroup>
                                        <FormControlLabel
                                            direction="column"
                                            label="Mẫu"
                                            control={(
                                                <AdvanceSelect
                                                    placeholder="Chọn mẫu"
                                                    options={POST_TYPE.map((pt) => ({ id: POST_TYPE.indexOf(pt).toString(), label: pt }))}
                                                    value={postObj?.type ? postObj.type.toString() : '0'}
                                                    onChange={(value) => {
                                                        setPostObj({
                                                            ...postObj, ...{ type: parseInt(value) }
                                                        });
                                                    }}
                                                />
                                            )}
                                        />
                                        <FormControlLabel
                                            direction="column"
                                            label="Trạng thái hiển thị"
                                            control={(
                                                <CheckBoxGroup
                                                    orientation="vertical">
                                                    <CheckBox
                                                        // displayAs="radio"
                                                        label="Riêng tư"
                                                        checked={postObj.visibility === POST_VISIBILITY.PRIVATE}
                                                        name="visibility"
                                                        onChange={() => {
                                                            setPostObj({
                                                                ...postObj, ...{ visibility: POST_VISIBILITY.PRIVATE }
                                                            });
                                                        }}
                                                    />
                                                    <CheckBox
                                                        // displayAs="radio"
                                                        label="Công khai"
                                                        checked={postObj.visibility === POST_VISIBILITY.PUBLIC}
                                                        // value={POST_VISIBILITY.PUBLIC}
                                                        name="visibility"
                                                        onChange={() => {
                                                            setPostObj({
                                                                ...postObj, ...{ visibility: POST_VISIBILITY.PUBLIC }
                                                            });
                                                        }}
                                                    />
                                                </CheckBoxGroup>)}
                                        />

                                        <FormControlLabel
                                            direction="column"
                                            label="Hình ảnh nổi bật"
                                            control={(
                                                <UploadImage
                                                    fitMode={'contain'}
                                                    width={'100%'}
                                                    height={'200px'}
                                                    src={postObj.featured_image}
                                                    canEnlarge
                                                    canDelete
                                                    onChange={(data) => {
                                                        setPostObj({ ...postObj, ...{ featured_image: data.data } })
                                                    }}
                                                    onDelete={(data) => {
                                                        console.log(data);
                                                        setPostObj({ ...postObj, ...{ featured_image: null } })
                                                    }}
                                                />
                                            )}
                                        />
                                        <FormControlLabel
                                            direction="column"
                                            label="Danh mục bài viết"
                                            className="select-container"
                                            control={(
                                                <Row>
                                                    <Container width={"100%"} className="category-select">
                                                        <AdvanceSelect
                                                            placeholder="Chọn danh mục"
                                                            options={categoriesStore.categoriesOptions}
                                                            multi
                                                            clearable
                                                            searchable
                                                            value={postObj.categories}
                                                            onChange={(value) => {
                                                                setPostObj({
                                                                    ...postObj, ...{ categories: value }
                                                                });
                                                            }}
                                                        />
                                                    </Container>
                                                    <Button
                                                        icon={'plus'}
                                                        onlyIcon
                                                        onClick={() => {
                                                            setOpenAddNewCategoryModal(true);
                                                        }}
                                                    />
                                                </Row>
                                            )}
                                        />
                                        <FormControlLabel
                                            direction="column"
                                            label="Từ khóa"
                                            className="select-container"
                                            control={(
                                                <Row>
                                                    <Container width={"100%"} className="tag-select">
                                                        <AdvanceSelect

                                                            placeholder="Chọn thẻ"
                                                            options={tagsStore.tagOptions}
                                                            multi
                                                            clearable
                                                            searchable
                                                            value={postObj.tags}
                                                            onChange={(value) => {
                                                                setPostObj({
                                                                    ...postObj, ...{ tags: value }
                                                                });
                                                            }}
                                                        />
                                                    </Container>
                                                    <Button
                                                        icon={'plus'}
                                                        onlyIcon
                                                        onClick={() => {
                                                            setOpenAddNewTagModal(true);
                                                        }}
                                                    />
                                                </Row>
                                            )}
                                        />
                                    </FormGroup>
                                </PanelBody>
                            </Panel>
                        </Column>
                    }
                </Row>
            </Container>
            {showConfirmPost && (
                <Confirm
                    title={'Xác nhận thêm bài viết'}
                    message={'Thêm bài viết mới vào hệ thống, bạn có muốn tiếp tục?'}
                    cancelText={'Hủy'}
                    okText={'Đồng ý'}
                    loading={loading}
                    onCancel={() => {
                        setShowConfirmPost(false);
                    }}
                    onOk={async () => {
                        setLoading(true);
                        if (postObj.Id) {
                            if (postObj.type === 0) await postStore.editPost(postObj); else await postStore.editMediaPost(postObj, uploads);
                        } else {
                            if (postObj.type === 0) await postStore.addPost(postObj); else await postStore.addMediaPost(postObj, uploads);
                        }
                        await postStore.loadData(initPostRequest);
                        setLoading(false);
                        setShowConfirmPost(false);
                        openEditorPanel(false);
                    }}
                    focusOn='ok' />
            )}
            {openAddNewCategoryModal &&
                <Popup
                    title="Thêm mới danh mục"
                    animationIn="bounceIn"
                    animationOut="bounceOut"
                    okType="primary"
                    okText="ok"
                    onClose={() => {
                        setOpenAddNewCategoryModal(false);
                        setCategoryObj(initCategoryObj);
                    }}>
                    <Container>
                        <AddNewCategory
                            categoryObj={categoryObj}
                            onChange={
                                (category) => {
                                    setCategoryObj({
                                        Title: category.title,
                                        Description: category.description,
                                        slug: category.slug,
                                        parents_category: category.parentCategory
                                    });
                                }
                            }
                            categoriesStore={categoriesStore}
                            onCreateCategoryComplete={(result) => {
                                setCategoryObj(initCategoryObj);
                                if (result?.status?.success)
                                    toast({ message: `Thêm thành công ${result.data.Title} !`, type: 'success' });
                                else
                                    toast({ message: `Thêm danh mục gặp lỗi : ${result.error.message}`, type: 'error' });
                            }} />
                    </Container>
                </Popup>}
            {
                openAddNewTagModal &&
                <Popup
                    title="Thêm mới từ khóa"
                    animationIn="bounceIn"
                    animationOut="bounceOut"
                    okType="primary"
                    okText="ok"
                    showCloseIcon={true}
                    onClose={() => {
                        setOpenAddNewTagModal(false);
                        setTagObj(initTagObj);
                    }}>
                    <Container>
                        <AddNewTag
                            tagObj={tagObj}
                            onChange={(tag) => { setTagObj({ Title: tag.title, slug: tag.slug, Description: tag.description }); }}
                            tagsStore={tagsStore}
                            onAddTagComplete={(result) => {
                                setTagObj(initTagObj);
                                if (result?.status?.success)
                                    toast({ message: `Thêm thành công ${result.data.Title} !`, type: 'success' });
                                else
                                    toast({ message: `Thêm từ khóa gặp lỗi : ${result.error.message}`, type: 'error' });
                            }}
                        />
                    </Container>
                </Popup>
            }
        </>
    )
};
ModifieldPostPanel = inject('ognlStore')(observer(ModifieldPostPanel));
export default ModifieldPostPanel;