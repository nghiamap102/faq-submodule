
import React, { FC, useRef, MouseEvent, KeyboardEvent, MutableRefObject, useEffect, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { FAIcon } from '@vbd/vicon';

import { Constants } from 'constant/Constants';
import { Tag } from 'components/bases/Tag/Tag';
import { T } from 'components/bases/Translate/Translate';
import { Container } from 'components/bases/Container/Container';
import { useI18n } from 'components/bases/I18n/useI18n';

import { AdvanceSelectOption } from './AdvanceSelect';
import { Loading } from '../Modal';

export type AdvanceSelectControlProps = {
    defaultOptions?: AdvanceSelectOption[],
    searchMode?: 'local' | 'remote',
    disabled?: boolean,
    searchable?: boolean,
    value: string | string[],
    options: AdvanceSelectOption[],
    multi?: boolean,
    placeholder: string,
    isVisible: boolean,
    defaultValue?: string | string[],
    isNoneSelect: boolean,
    isLoading?: boolean,
    clearable?: boolean,
    selectedOptions: AdvanceSelectOption[],
    searchKey?: string,
    controlRef: MutableRefObject<HTMLDivElement | null>,
    readOnly?: boolean,
    onSearchKey?: (key: string) => void,
    onOptionsChange?: (ops: AdvanceSelectOption[]) => void,
    onTagRemoved: (event: MouseEvent<HTMLButtonElement>, val: string) => void,
    onClear?: () => void,
    onControlClick: () => void,
    onRemoteFetch?: (key: string) => void,
}

export const AdvanceSelectControl: FC<AdvanceSelectControlProps> = (props) =>
{
    const {
        defaultOptions, searchMode, disabled, searchable, controlRef,
        value, options, multi, placeholder, isVisible, isLoading, searchKey,
        defaultValue, isNoneSelect, clearable, selectedOptions,
        onSearchKey, onOptionsChange, onClear, onControlClick, onTagRemoved, onRemoteFetch,
    } = props;

    const { t } = useI18n();

    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const searchboxWidth = useRef<number>(0);

    useLayoutEffect(() =>
    {
        if (!contentRef.current)
        {
            return;
        }

        const resize = new ResizeObserver(entries =>
        {
            const contentWidth = entries[0].contentRect.width;
            searchboxWidth.current = contentWidth;
        });

        resize.observe(contentRef.current);

        return () => resize.disconnect();
    }, [contentRef]);

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

    useEffect(() =>
    {
        if (disabled)
        {
            return;
        }

        if (searchMode === 'local')
        {
            if (!searchKey)
            {
                onOptionsChange && onOptionsChange(defaultOptions || []);
                return;
            }
            const newOptions = (defaultOptions || []).filter(option =>
            {
                const display =
                (typeof option.inputDisplay === 'string' && option.inputDisplay) ||
                (typeof option.dropdownDisplay === 'string' && option.dropdownDisplay) ||
                (typeof option.label === 'string' && option.label) || option.id || '';
                return t(display).toLowerCase().includes(searchKey.toLowerCase());
            });

            onOptionsChange && onOptionsChange(newOptions);
            return;
        }

        onRemoteFetch && onRemoteFetch((searchKey || ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKey]);

    const handleClosePopup = (event: globalThis.MouseEvent | Event) =>
    {
        event.target !== inputRef.current &&
        event.target !== containerRef.current &&
        !event.composedPath().some(elm =>
            elm === inputRef.current || elm === containerRef.current || (elm as Element).classList?.value.includes('as-overlay'),
        ) && isVisible && onControlClick();
        return;
    };

    const handleClearValueClick = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();
        onClear ? onClear() : (onSearchKey && onSearchKey(''));
        onClear && inputRef.current?.focus();
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) =>
    {
        const key = event.which;
        key === Constants.KEYS.ENTER && onControlClick() && event.preventDefault();
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        const key = event.which;
        (key === Constants.KEYS.DOWN || key === Constants.KEYS.UP) && event.preventDefault();
    };

    let content;
    const contentAsString = !multi && (defaultOptions?.find(o => o.id === (value || defaultValue))?.label || value);
    const placeholderTag = <span className={'placeholder'}><T>{placeholder}</T></span>;

    if (multi && Array.isArray(value) && value.length)
    {
        content = value.map((val) => (
            <Tag
                key={val}
                text={options?.find((o) => o.id === val)?.label ?? selectedOptions?.find((o) => o.id === val)?.label ?? placeholder}
                onCloseClick={(event: any) =>
                {
                    event.stopPropagation();
                    onTagRemoved && onTagRemoved(event, val);
                }}
            />
        ),
        );
    }
    else
    {
        if ((defaultValue === undefined && (value === undefined || (Array.isArray(value) && value.length === 0))) || isNoneSelect)
        {
            content = placeholderTag;
        }
        else if (value === undefined)
        {
            content = options?.find(o => o.id === defaultValue);
            content = content ? content?.inputDisplay : props.searchKey || placeholderTag || '';
        }
        else
        {
            content = options?.find(o => o.id === value);
            content = content ? content?.inputDisplay : props.searchKey || t(value) || placeholderTag || '';
        }

        content = <div className={'dropdown-btn-text'}><T>{content}</T></div>;
    }

    const hasValue = value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0);
    const inputValue = typeof props.searchKey === 'string' ? props.searchKey : (t(contentAsString) || '');
    const isShowClearButton = clearable && !disabled && hasValue;
    
    return (
        <div
            ref={elm =>
            {
                controlRef.current = elm;
                containerRef.current = elm;
            }}
            className={`as-container ${disabled ? 'as-container-disabled' : ''}`}
            tabIndex={0}
            data-autofocus
            onClick={() => (!searchable || (searchable && !isVisible)) && onControlClick()}
            onKeyPress={handleKeyPress}
        >
            <div className="as-control-container">
                {
                    searchable && isVisible && (
                        <Container
                            className="dropdown-btn dropdown-btn--searchable"
                            width={searchboxWidth.current + 'px'}
                        >
                            {multi && Array.isArray(value) && value.length > 0 && <T>{content}</T>}
                            <input
                                ref={inputRef}
                                className="dropdown-input"
                                placeholder={t(placeholder)}
                                value={inputValue}
                                autoFocus
                                onChange={event => onSearchKey && onSearchKey(event.target.value)}
                                onKeyDown={handleInputKeyDown}
                            />
                        </Container>
                    )
                }

                <Container
                    ref={contentRef}
                    className={clsx('dropdown-btn', { 'dropdown-btn--hidden': searchable && isVisible })}
                >
                    <T>{content}</T>
                </Container>

                { isLoading && !isVisible && (<Loading spinnerSize='sm' />)}

                {
                    isShowClearButton && (
                        <div className="clear">
                            <FAIcon
                                icon={'times'}
                                size={'1rem'}
                                onClick={handleClearValueClick}
                            />
                        </div>
                    )
                }

                <div className="arrow">
                    <FAIcon
                        icon={isVisible ? 'chevron-up' : 'chevron-down'}
                        size={'1rem'}
                        type={'regular'}
                        {...searchable && { onClick: (e: React.MouseEvent<HTMLElement>) =>
                        {
                            e.stopPropagation();
                            onControlClick();
                        } }}
                    />
                </div>
            </div>
        </div>
    );
};
