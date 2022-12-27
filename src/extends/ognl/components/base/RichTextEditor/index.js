import { Button, CheckBox, Container, EmptyButton, Flex, Image, Input, Loading, Popup, ResponsiveGrid, ResponsiveGridItem, useTenant } from "@vbd/vui";
import { AppConstant } from "constant/app-constant";
import FileServices from "extends/ognl/services/FileServices";
import { AuthHelper } from "helper/auth.helper";
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css'; // ES6
import LayerService from "services/layer.service";
import './RichTextEditor.scss';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

const RichTextEditor = (props) => {
    const { onChange, placeholder, value, parentPath } = props;
    const tenant = useTenant();
    // // const [editorHtml, setEditorHtml] = useState(value || '');
    // const handleChange = (html: string) => {
    //     if (onChange) {
    //         onChange(html);
    //     }
    //     setEditorHtml(html);
    // }
    const [loading, setLoading] = useState(false);
    const [isOpenPopUp, setIsOpenPopUp] = useState(false);
    const [listImage, setListImage] = useState([]);
    const [change, setChange] = useState(0);

    const fileSvc = new FileServices(tenant.vdms.url);
    const layerSvc = new LayerService();
    const quillObj = useRef();
    const inputRef = useRef();

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
    ]

    useEffect(() => {
        fetchListImage();
    }, [change])

    const fetchListImage = async () => {
        const res = await layerSvc.getLayers({
            path: parentPath,
            layers: ["container"],
            returnFields: ['*'],
        })
        const data = await res?.data;
        const imageUrls = await Promise.all(data.map((d) => getFileUrl(d.Id)));
        setListImage(imageUrls);
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                ['emoji', 'image', 'video', 'link'],

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean'],
            ],
            handlers: {
                'image': () => { imageHandler() },
            },
            table: true,
        },
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize'],
            displaySize: true,
        },
    }), []);
    const imageHandler = () => {
        const button = document.createElement('button');
        button.click(setIsOpenPopUp(true));
    }

    const uploadFile = async (fileUpload) => {
        // const file = new File([fileUpload], `${fileUpload.name}_${new Date().getTime()}`, { type: fileUpload.type });
        const path = parentPath;
        const result = await fileSvc.uploadFileNode(fileUpload, path, fileUpload.name, fileUpload.type);
        if (result?.status?.success) {
            return await getFileUrl(result.data.Id);
        }
        return null;
    }

    const getFileUrl = async (id) => {
        const response = await fetch(`${AppConstant.vdms.url}/api/v1/file?fileid=${id}`, { method: 'GET', headers: AuthHelper.getVDMSHeader() });
        // const blob = await response.blob();
        // const url = URL.createObjectURL(blob);        
        const url = `${response.url}&access_token=${AuthHelper.getVDMSToken()}`;
        return url;
    }
    // const b64toBlob = (base64, type) => {
    //     var byteString = Buffer.from(base64.split(',')[1], 'base64');
    //     return URL.createObjectURL(new Blob([byteString], { type: type }));
    // }

    const handleChangeInputFile = async () => {
        setLoading(true);
        try {
            if (inputRef.current.files?.length) {
                const url = await uploadFile(inputRef.current.files[0]);
                if (url) {
                    setChange(change + 1)
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error("Upload image error : ", error);
        }
    }

    return (
        <>
            <ReactQuill
                ref={quillObj}
                theme="snow"
                value={value}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                onChange={onChange}
            />
            {
                isOpenPopUp && (
                    <PopupSelectImage
                        quillObj={quillObj}
                        handleClose={() => setIsOpenPopUp(false)}
                        listImage={listImage}
                        inputRef={inputRef}
                        handleChangeInputFile={handleChangeInputFile}
                        loading={loading}
                    />
                )
            }
        </>
    )
}

const PopupSelectImage = (props) => {

    const { quillObj, handleClose, listImage, inputRef, handleChangeInputFile, loading } = props;

    const [listImageSelected, setListImageSelected] = useState([]);

    const handleSubmitImage = (e) => {
        e.preventDefault();
        listImageSelected.map((ele) => {
            quillObj.current.getEditor().insertEmbed(0, 'image', ele);
        })
        handleClose()
    }

    return (
        <Popup
            title="Select Image"
            onClose={handleClose}
        >
            <ResponsiveGrid>
                {listImage?.map((image, index) => (
                    <ResponsiveGridItem
                        key={index}
                        style={{ border: 'none', display: 'none' }}
                    >
                        <RenderImageItem
                            image={image}
                            listImageSelected={listImageSelected}
                        />
                    </ResponsiveGridItem>
                ))}
            </ResponsiveGrid>
            <Input
                ref={inputRef}
                type='file'
                disabled={inputRef?.current?.files[0] ? true : false}
                onChange={handleChangeInputFile}
            />
            <Container style={{ textAlign: 'center' }}>
                <Button
                    style={{ background: 'var(--bg-color-purple)' }}
                    text='Submit'
                    color="white"
                    onClick={handleSubmitImage}
                />
            </Container>
            {
                loading && (
                    <Loading
                        text="Đang upload ..."
                        overlay
                    />
                )
            }
        </Popup>
    )
}


const RenderImageItem = (props) => {
    const [check, setCheck] = useState(false);
    const { listImageSelected, image } = props


    const handleSelectImage = () => {
        setCheck(!check);
        if (!listImageSelected) listImageSelected.push(image);
        if (listImageSelected.indexOf(image) === -1) {
            listImageSelected.push(image);
        } else {
            listImageSelected.splice(0, 1);
        }
    }

    return (
        <Container
            className="image-item"
            onClick={handleSelectImage}
        >
            <Flex
                className="img-wrapper"
                justify="center"
            >
                <Image
                    src={image}
                    alt='image'
                    height={120}
                    width={120}
                />
            </Flex>
            <CheckBox
                checked={check}
                onClick={handleSelectImage}
            />
        </Container>
    )
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */

/* 
 * PropType validation
 */
RichTextEditor.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    parentPath: PropTypes.string,
}

RichTextEditor.defaultProps = {
    parentPath: "/root/vdms/tangthu/data/images",
}

export default RichTextEditor;

