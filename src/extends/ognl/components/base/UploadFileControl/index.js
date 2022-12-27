import './UploadFileControl.scss';
import { useRef, useState } from 'react';
import { InputGroup, Input, InputAppend, EmptyButton, Row, Container, FAIcon, Column } from '@vbd/vui';
import PropTypes from 'prop-types';

const UploadFileControl = (props) => {
    const { disabled, className, placeholder, accept, multiple, width, height, previewable } = props;
    const inputRef = useRef();
    const [uploadLoading, setUploadLoading] = useState(false);
    const [fileName, setFileName] = useState();
    const [filesUpload, setFilesUpload] = useState([]);

    const handleFileChange = async () => {
        setUploadLoading(true);
        if (props.onChange) {
            if (!multiple && inputRef.current.files && inputRef.current.files[0]) {
                const file = inputRef.current.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    props.onChange({ fileName: file.name, data: e.target.result, file: file });
                    setFileName(file.name);
                    setUploadLoading(false);
                };
                reader.readAsDataURL(file);
            }
            if (multiple && inputRef.current.files?.length) {
                const filesInput = [...inputRef.current.files];
                const files = await Promise.all(filesInput.map((file) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        return resolve({ fileName: file.name, type: file.type, data: e.target.result, file: file })
                    };
                    reader.readAsDataURL(file);
                })));
                setFilesUpload(files);
                props.onChange(files);
            }
        }
    };

    return (
        <>
            {!multiple ?
                <InputGroup className={`${className} ${disabled ? 'disabled' : ''} upload-file-control`}>
                    <Input
                        className={'upload-file-name'}
                        placeholder={placeholder}
                        value={fileName}
                        disabled={disabled || uploadLoading}
                        onChange={() => { }}
                    />

                    <InputAppend>
                        <Row>
                            <EmptyButton
                                className='upload-button'
                                disabled={disabled || uploadLoading}
                                icon={'upload'}
                                backgroundColor={'transparent'}
                                onlyIcon
                                onClick={() => inputRef?.current.click()}
                            />
                        </Row>
                    </InputAppend>
                </InputGroup>
                :
                <Container
                    className={`${className} ${disabled ? 'disabled' : ''} upload-file-control-multiple`}
                    onClick={() => inputRef?.current.click()}
                    style={{ width, height }}

                >
                    <Column>
                        <Row className={'upload-file-actions'}>
                            <FAIcon
                                className={'add-new-icon'}
                                icon={'plus'}
                                type={'solid'}
                            />
                        </Row>
                        {filesUpload?.length > 0 && previewable && (
                            <Row className={'upload-file-list'}>
                                <Column>
                                    {filesUpload.map((fsu) => (
                                        <Row key={filesUpload.indexOf(fsu)} className='upload-file-item'>
                                            {fsu?.type?.includes('video') ? (<FAIcon icon='video' type={'solid'} />) : (<FAIcon icon='image' type={"solid"} />)}
                                            {fsu?.fileName ? fsu.fileName : ''}
                                        </Row>))}
                                </Column>
                            </Row>
                        )}
                    </Column>
                </Container>}
            <Input
                ref={inputRef}
                className={'hide'}
                type={'file'}
                accept={accept}
                onChange={handleFileChange}
                multiple={multiple}
            />
        </>
    );
};


UploadFileControl.propTypes = {
    // value: PropTypes.string,
    // src: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    previewable: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    accept: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string
};

UploadFileControl.defaultProps = {
    // value: '',
    className: '',
    // src: '',
    disabled: false,
    multiple: false,
    previewable: false,
    accept: 'application/pdf',
    width: '100%',
    height: '10rem'
};

export default UploadFileControl;