import React, { useEffect, useRef, FC, KeyboardEvent } from 'react';
import clsx from 'clsx';
import { FAIcon } from '@vbd/vicon';

import { Container } from 'components/bases/Container/Container';
import { Input } from 'components/bases/Input/Input';
import { Constants } from 'constant/Constants';
import { CustomOnChange } from 'components/bases/Form/model/smartFormType';

import './DateTimePickerController.scss';

export type DateTimePickerControllerProps = {
    value: string,
    className?: string,
    readOnly?: boolean,
    placeholder?: string,
    disabled?: boolean,
    clearable?: boolean,
    showTimeSelectOnly?: boolean,
    searchable?: boolean,
    name?: string,
    isVisible?: boolean,
    innerRef?: (elm: HTMLInputElement | null) => void,
    onChange: (val: string) => void,
    onClearValueClick: (event: React.MouseEvent<HTMLElement>) => void,
    onControlClick: () => void,
} & CustomOnChange

export const DateTimePickerController: FC<DateTimePickerControllerProps> = (props) =>
{
    const {
        readOnly,
        className,
        placeholder,
        value,
        disabled,
        clearable,
        showTimeSelectOnly,
        isVisible,
        name,
        innerRef,
        onChange,
        onClearValueClick,
        onControlClick,
        customOnChange,
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const calendarIconRef = useRef<HTMLDivElement | null>(null);

    useEffect(() =>
    {
        if (!isVisible) {return;}
        inputRef.current?.focus();
    }, [isVisible]);

    useEffect(() =>
    {
        isVisible && document.addEventListener('mousedown', handleClosePopup);
        isVisible && document.addEventListener('scroll', handleClosePopup, true);

        return () =>
        {
            document.removeEventListener('mousedown', handleClosePopup);
            document.removeEventListener('scroll', handleClosePopup, true);
        };
    }, [isVisible]);

    const handleClosePopup = (event: globalThis.MouseEvent | Event) =>
    {
        event.target !== inputRef.current &&
        event.target !== containerRef.current &&
        !calendarIconRef.current?.contains(event.target as Node) &&
        !event.composedPath().some(elm => (elm as Element).classList?.value.includes('dtp-overlay')) &&
        isVisible && onControlClick();
        return;
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        event.which === Constants.KEYS.ENTER && isVisible && onControlClick();
    };

    return (
        <Container
            ref={containerRef}
            className={`dtp-control-container ${readOnly ? 'cursor-default' : ''}`}
        >
            <Input
                ref={elm =>
                {
                    innerRef && innerRef(elm);
                    inputRef.current = elm;
                }}
                name={name}
                className={clsx('input-text', className)}
                placeholder={placeholder}
                type="text"
                value={value || placeholder}
                disabled={disabled}
                customOnChange={customOnChange}
                data-autofocus
                onChange={onChange}
                onKeyDown={handleKeyDown}
                onClick={() => !isVisible && onControlClick()}
            />

            {
                clearable && !disabled && value && (
                    <Container className="clear">
                        <FAIcon
                            icon={'times'}
                            size={'1rem'}
                            onClick={onClearValueClick}
                        />
                    </Container>
                )}

            {
                !showTimeSelectOnly && (
                    <Container
                        ref={calendarIconRef}
                        className="calendar"
                    >
                        <FAIcon
                            icon={'calendar-alt'}
                            size={'1rem'}
                            onClick={() => !isVisible && onControlClick()}
                        />
                    </Container>
                )}
        </Container>
    );
};

DateTimePickerController.displayName = 'DateTimePickerController';
