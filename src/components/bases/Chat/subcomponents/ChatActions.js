import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { Row2 } from 'components/bases/Layout/Row';
import { Col2 } from 'components/bases/Layout/Column';
import { EmptyButton } from 'components/bases/Button/Button';

import './ChatActions.scss';

export function ChatActions(props)
{
    const inputRef = useRef();
    const [draft, setDraft] = useState({});

    const textValue = draft[props.groupId] || '';

    const setTextValue = (value) =>
    {
        setDraft({ ...draft, [props.groupId]: value });
    };

    useEffect(() =>
    {
        inputRef.current.focus();
    }, []);

    useEffect(() =>
    {
        updateInputHeight();
    }, [textValue]);

    const handleKeyPress = (e) =>
    {
        if (!e.shiftKey && e.key === 'Enter')
        {
            e.preventDefault();
            handleClickSend();
        }
    };

    useEffect(() =>
    {
        updateInputHeight();
    }, [draft[props.groupId]]);

    const handleClickSend = () =>
    {
        if (textValue)
        {
            props.onSendMessage && props.onSendMessage(textValue);
            setTextValue('');
            inputRef.current.focus();
        }
    };

    const handleOnChange = (e) =>
    {
        setTextValue(e.currentTarget.value);
    };

    const updateInputHeight = () =>
    {
        if (!inputRef.current)
        {
            return;
        }
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';

        // Update scroll position
        props.scrollToBottom && props.scrollToBottom();
    };

    return (
        <div
            className={`chat-actions ${(props.className) ? props.className : ''}`}
            style={{ maxHeight: props.maxTextareaHeight }}
        >
            <Row2>
                <Col2>
                    <ScrollView>
                        <form className="post-form">
                            <textarea
                                ref={inputRef}
                                placeholder={'Reply...'}
                                className="post-textarea"
                                id="post-textarea"
                                autoComplete="off"
                                value={textValue}
                                rows="1"
                                onChange={handleOnChange}
                                onKeyDown={handleKeyPress}
                            />
                        </form>
                    </ScrollView>
                </Col2>
                <Col2
                    justify='center'
                    items='center'
                >
                    <EmptyButton
                        icon={'paper-plane'}
                        onlyIcon
                        onClick={handleClickSend}
                    />
                </Col2>
            </Row2>
        </div>
    );
}

ChatActions.propTypes = {
    className: PropTypes.string,
    onSendMessage: PropTypes.func,
    maxTextareaHeight: PropTypes.string,
    scrollToBottom: PropTypes.func,
    groupId: PropTypes.string,
};

ChatActions.defaultProps = {
    maxTextareaHeight: '10rem',
};
