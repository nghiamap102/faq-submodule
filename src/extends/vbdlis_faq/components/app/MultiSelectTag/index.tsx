import { Box, Container, FAIcon, Input } from "@vbd/vui";
import Validation from "extends/vbdlis_faq/utils/Validation";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import './MultiSelectTag.scss';
type MultiSelectTagProps = {
    arrTags: any[];
    arrSuggest: any[];
    loading?: boolean;
    handleChangeTags?: (value: string) => void;
    handlePress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    hanldeRemoveItem?: (value: any) => void;
    hanldeRemoveAllItem?: () => void;
    value?: any;
};
const MultiSelectTag: React.FC<MultiSelectTagProps> = ({
    arrTags,
    arrSuggest,
    handleChangeTags,
    hanldeRemoveAllItem,
    hanldeRemoveItem,
    handlePress,
    loading,
    value,
}) => {
    const [focus, setFocus] = useState(false);
    const [mouseLeave, setMouseLeave] = useState(false);
    const ref = useRef<any>(null);
    const hanldeSelectTag = (value: any) => {
        arrTags.length < 1 ? arrTags.push(value) : '';
        arrTags.map((ele) => {
            if (ele.keyword !== value.keyword) {
                arrTags.push(value);
            }
        })
    }
    const onBlur = () => {
        if (mouseLeave) {
            ref.current.blur();
            setFocus(false);
        }
    }
    return (
        <>
            <Box
                className="relative"
                onClick={() => (ref.current.focus(), setFocus(true))}
                onBlur={onBlur}
                onMouseLeave={() => setMouseLeave(true)}
            >
                <Box
                    className={`${focus ? 'bg-active' : 'bd-white'} flex flex-row items-center p-2 cursor-text`}
                >
                    <Container className="flex flex-row flex-wrap items-center">
                        {Validation.isNotEmptyArray(arrTags) && arrTags.map((ele) => (
                            <Container
                                key={ele?.Id}
                                className={`mx-1 my-1 selected`}
                            >
                                <Container className="content">{ele?.keyword}</Container>
                                <FAIcon
                                    icon="times"
                                    size="10px"
                                    onClick={() => hanldeRemoveItem(ele)}
                                />
                            </Container>
                        ))}
                        <Container style={{ width: 'auto' }}>
                            <Input
                                width="100%"
                                className='py-3 px-2 w-100'
                                placeholder='Tags'
                                type="text"
                                disabled={loading}
                                value={value}
                                onChange={handleChangeTags}
                                onKeyPress={handlePress}
                                ref={ref}
                            />
                        </Container>
                    </Container>
                    {arrTags.length > 0 &&
                        <FAIcon
                            icon="times"
                            className='radius-50-gray absolute-t50-right cursor-pointer'
                            size="18px"
                            onClick={hanldeRemoveAllItem}
                        />
                    }
                </Box>
                {focus && arrSuggest.length > 0 &&
                    <Box
                        className="suggest absolute"
                        onMouseEnter={() => setMouseLeave(false)}
                    >
                        {arrSuggest.map((ele) => (
                            <Container
                                key={ele.Id}
                                className='suggest_item'
                                onClick={() => hanldeSelectTag(ele)}
                            >
                                {ele?.keyword}
                            </Container>
                        ))}
                    </Box>
                }
            </Box>
        </>
    );
};

export default observer(MultiSelectTag);
