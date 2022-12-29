import './AdvanceSelect.scss';

import React, { MouseEvent, forwardRef, useRef, useState, useEffect, ForwardedRef, MutableRefObject, ReactNode } from 'react';

import { AnchorOverlay } from 'components/bases/Modal/AnchorOverlay';
import { Container } from 'components/bases/Container/Container';
import { CustomOnChange, IControllableField } from 'components/bases/Form/model/smartFormType';
import { useStateCallback } from 'hooks/useStateCallback';
import { createUniqueId, isCallBackRef } from 'utils';

import { AdvanceSelectControl } from './AdvanceSelectControl';
import { AdvanceSelectPopup } from './AdvanceSelectPopup';
import { useModal } from '../Modal/hooks/useModal';

export type AdvanceSelectOption = {
    id: string
    label: ReactNode
    inputDisplay?: ReactNode
    dropdownDisplay?: ReactNode
}

export type SearchModeProps =
    | { searchMode: 'remote', onRemoteFetch: (searchKey: string) => void }
    | { searchMode?: 'local', onRemoteFetch?: (searchKey: string) => void }

export type AdvanceSelectProps = IControllableField & CustomOnChange & {
    options: AdvanceSelectOption[]
    selectedOptions?: AdvanceSelectOption[]
    flex?: number
    width?: string
    searchable?: boolean
    isLoading?: boolean
    hasDividers?: boolean
    disabled?: boolean
    multi?: boolean
    clearable?: boolean
    isVisible?: boolean
    value?: string | string[]
    defaultValue?: string | string[]
    noneSelectValue?: string
    placeholder?: string
    onChange?: (value?: string | string[], currentSelect?: string) => void
    onClear?: () => void
    onTextChange?: (value: string) => void
    onSearch?: (searchKey: string) => void
    onDropdownClosed?: () => void
    onControlClick?: () => void
    textChangeDelay?: number
    tagRemoveConfirm?: boolean
}

export const AdvanceSelect = React.memo(forwardRef((props: AdvanceSelectProps & SearchModeProps, ref: ForwardedRef<HTMLElement>): JSX.Element =>
{
    const { selectedOptions = [], defaultValue, noneSelectValue, placeholder = '...', searchMode = 'local', tagRemoveConfirm } = props;
    const { onChange, onRemoteFetch, textChangeDelay = 300, onClear, customOnChange , onSearch, onDropdownClosed, onControlClick } = props;
    const { searchable = true, hasDividers, disabled, multi, clearable, isLoading } = props;
    const { flex, width } = props;
    const { name } = props;

    const controlRef = useRef<HTMLDivElement | null>(null);
    const selectRef = useRef(null) as MutableRefObject<HTMLElement | null>;
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [options, setOptions] = useState<AdvanceSelectOption[]>(props.options);
    const [isNoneSelect, setIsNoneSelect] = useState(false);
    const [isVisible, setIsVisible] = useStateCallback(!!props.isVisible);
    const [searchKey, setSearchKey] = useState<string>();
    const [textChangeDelayTimeout, setTextChangeDelayTimeout] = useState<any>();
    const [controlWidth, setControlWidth] = useState(width ?? '100px');

    const defaultSelectValue = defaultValue ?? (multi ? [] : undefined);
    const [value, setValue] = useStateCallback(props.value ?? defaultSelectValue);
    const [prevValue, setPrevValue] = useState<string | string[]>();
    const { confirm } = useModal();

    const eventListener = (event: KeyboardEvent) => event.code === 'Escape' && setIsVisible(false);
    useEffect(() =>
    {
        setOptions(props.options);
    }, [props.options]);

    useEffect(() =>
    {
        !isVisible && setSearchKey(undefined);
    }, [isVisible]);

    useEffect(() =>
    {
        setIsVisible(!!props.isVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isVisible]);

    useEffect(() =>
    {
        document.addEventListener('keydown', eventListener, false);
        return () =>
        {
            document.removeEventListener('keydown', eventListener, false);
        };
    }, []);

    const handleClosePopup = () => setIsVisible(false, () =>
    {

        controlRef.current?.focus();
        onDropdownClosed && onDropdownClosed();
    });

    const handleTextChange = (key: string) =>
    {
        setSearchKey(key);
        typeof key !== 'string' && setIsVisible(!!key);
        typeof key !== 'string' && !key && handleSelectChange('non-select');
        onSearch && onSearch(key);
    };

    const handleSelectChange = (value: string | string[], currentSelect?: string, e?: KeyboardEvent) =>
    {
        const filteredNoneSelectValue = value === 'non-select' ? undefined : value;
        onChange && onChange(filteredNoneSelectValue, currentSelect);

        setValue(filteredNoneSelectValue, () =>
        {
            const event = new Event('change', { bubbles: true });
            selectRef.current && selectRef.current.dispatchEvent(event);
        });
        setIsNoneSelect(value === 'non-select');

        (multi && (e?.ctrlKey || e?.metaKey)) || handleClosePopup();
    };

    const closeAdvanceSelect = () => setIsVisible(false);

    const handleTagRemoved = (e: MouseEvent<HTMLButtonElement>, val: string) =>
    {
        e.stopPropagation();
        const newValue = (value as string[]).filter(v => v !== val);
        if (tagRemoveConfirm)
        {
            confirm({
                title: 'Xác nhận',
                message: 'Xác nhận xoá lựa chọn này?',
                onOk: () =>
                {
                    handleSelectChange(newValue, val);
                },
            });
        }
        else
        {
            handleSelectChange(newValue, val);
        }
    };

    const handleControlClick = () =>
    {
        onControlClick && onControlClick();
        !disabled && setIsVisible(prev => !prev);
        const offsetWidth = containerRef ? containerRef.current?.offsetWidth : 100;
        !disabled && setControlWidth(`${offsetWidth}px`);
    };

    // this is here because QueryBuilderRule use value as a state and it set state whenever it's parent call fillRuleStatus
    if (defaultValue === undefined && !!onChange && props.value !== prevValue)
    {
        setValue(props.value ?? (multi ? [] : ''));
        setPrevValue(props.value);
    }

    const displayAppendedOptions = options?.map(option => (
        {
            ...option,
            dropdownDisplay: option.dropdownDisplay || option.label || option.id || '',
            inputDisplay: option.inputDisplay || option.dropdownDisplay || option.label || option.id || '',
        }
    ));

    const handleRemoteFetch = (value: string) =>
    {
        if (textChangeDelayTimeout)
        {
            clearTimeout(textChangeDelayTimeout);
            setTextChangeDelayTimeout(null);
        }
        setTextChangeDelayTimeout(
            setTimeout(() =>
            {
                onRemoteFetch && onRemoteFetch(value);
            }, textChangeDelay),
        );
    };

    const handleClear = () =>
    {
        clearable && onClear && onClear();
        const clearedValue = multi ? [] : '';
        clearable && onChange && onChange(clearedValue);
        clearable && !onChange && setValue(clearedValue);
    };

    const selectElementValue = (selectRef.current as HTMLSelectElement)?.value;

    return (
        <Container
            ref={containerRef}
            flex={flex}
            width={width}
        >
            <AdvanceSelectControl
                controlRef={controlRef}
                defaultValue={defaultValue}
                value={(!value && value !== '') ? selectElementValue : value}
                selectedOptions={selectedOptions}
                options={displayAppendedOptions}
                defaultOptions={props.options || []}
                multi={multi}
                placeholder={placeholder}
                isVisible={isVisible}
                isNoneSelect={isNoneSelect}
                isLoading={isLoading}
                disabled={disabled}
                clearable={clearable}
                searchable={searchable}
                searchKey={searchKey}
                searchMode={searchMode}
                onTagRemoved={handleTagRemoved}
                onControlClick={handleControlClick}
                onClear={handleClear}
                onSearchKey={handleTextChange}
                onOptionsChange={(ops: AdvanceSelectOption[]) => setOptions(ops)}
                onRemoteFetch={handleRemoteFetch}
            />
            {
                isVisible && (
                    <AnchorOverlay
                        className={'as-overlay'}
                        width={Math.max(containerRef.current?.clientWidth || 0, 130)} // 130 is AdvanceSelectPopup's min-width.
                        anchorEl={controlRef}
                        backdrop={false}
                        dynamicContent={searchable}
                        onBackgroundClick={handleClosePopup}
                    >
                        <AdvanceSelectPopup
                            width={controlWidth}
                            multi={multi}
                            noneSelectValue={noneSelectValue}
                            selectedValue={value}
                            isVisible={isVisible}
                            isLoading={isLoading}
                            options={displayAppendedOptions}
                            hasDividers={hasDividers}
                            searchable={searchable}
                            onSelectChange={handleSelectChange}
                            onClose={closeAdvanceSelect}
                        />
                    </AnchorOverlay>
                )}

            <select
                ref={(e) =>
                {
                    !!ref && isCallBackRef(ref) && ref(e);
                    selectRef.current = e;
                }
                }
                multiple={multi}
                name={name}
                value={Array.isArray(value) ? [...value] : value}
                defaultValue={defaultValue}
                hidden
                onChange={customOnChange}
            >
                <option />
                {options.map(({ id, label }) => (
                    <option
                        key={createUniqueId()}
                        value={id}
                    >{label}
                    </option>
                ))}
            </select>
        </Container>
    );
}));

AdvanceSelect.displayName = 'AdvanceSelect';
