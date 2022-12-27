import { Container, FormControlLabel, Row, Button } from "@vbd/vui";
import RichTextEditor from "extends/ognl/components/base/RichTextEditor";
import { useEffect, useState } from "react";
import BaseConfiguration from "../BaseConfiguration";
import './CustomHTMLConfiguration.scss';

// import './CustomHTMLConfiguration.scss';

// interface ConfigParameters {
//     showLabel?: boolean,
//     label?: string,
//     content?: string
// }

// interface ConfigParameterProps {
//     config?: ConfigParameters
//     onChange: (value: ConfigParameters) => void
// }

const CustomHTMLConfiguration = (props) => {
    const { config, onChange } = props;
    const [label, setLabel] = useState(config?.label || '');
    const [content, setContent] = useState(config?.content || '');
    const [showLabel, setShowLabel] = useState(config?.showLabel || true);
    const [viewMode, setViewMode] = useState('editor');

    useEffect(() => {
        const value = { label, showLabel, content };
        onChange(value);
    }, [label, content, showLabel]);

    return (
        <Container className='custom-html-container'>
            <BaseConfiguration onChange={(value) => {
                setLabel(value.label);
                setShowLabel(value.showLabel);
            }} config={{ label, showLabel }} />
            <FormControlLabel
                label="Nội dung"
                direction="column"
                className=""
                control={(
                    <>
                        <Container className="toolbar">
                            <Button tooltip="Dạng code" iconType="regular" icon="file-alt" color={viewMode === 'code' ? 'primary' : 'default'} onlyIcon onClick={() => { setViewMode('code'); }} />
                            <Button iconType="regular" tooltip="Dạng soạn thảo" icon="file-code" onlyIcon color={viewMode === 'editor' ? 'primary' : 'default'} onClick={() => { setViewMode('editor'); }} />
                        </Container>
                        {viewMode === 'code' && <textarea
                            className="code-editor"
                            value={content}
                            rows={500}
                            onChange={(evn) => setContent(evn.target.value)}
                        />}
                        {viewMode === 'editor' && <RichTextEditor
                            value={content}
                            placeholder={''}
                            onChange={(value) => {
                                setContent(value);
                            }}
                        />}
                    </>
                )} />
        </Container>
    );
}

export default CustomHTMLConfiguration;