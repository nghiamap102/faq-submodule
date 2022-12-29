import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import { FAIcon } from '@vbd/vicon';
import { DataGridChartCell } from 'components/bases/DataGrid/DataGridChartCell';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { Link } from 'components/bases/Link/Link';
import { Tag } from 'components/bases/Tag/Tag';
import { Image } from 'components/bases/Image/Image';
import { DataTypes } from 'components/bases/DynamicDisplayForm/DataTypes';
import { DynamicField } from 'components/bases/DynamicDisplayForm/DynamicField';
import { Container } from 'components/bases/Container/Container';
import { ProgressBar } from 'components/bases/ProgressBar/ProgressBar';

// The Regex and test cases can be found in this link
// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const formatCurrency = (number, locale) =>
{
    switch (locale)
    {
        case 'vi':
        {
            const parts = number.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join('.') + 'đ';
        }
        default:
        {
            const parts = number.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return '$' + parts.join('.');
        }
    }
};

// format: \# or #.## or #,##
const formatNumeric = (number, format) =>
{
    switch (format)
    {
        case '#,##':
            return Number(number).toFixed(2).toString().replaceAll('.', ',');
        case '#.##':
            return Number(number).toFixed(2);
        default:
            return number;
    }
};

const typeA = ['select', 'date', 'datetime'];

const DataGridCell = (props) =>
{
    const { definition, content, style, editable, onDataChanged, getNumOfEditableFieldsPerRow, onSelect } = props;
    const { locale = 'vi', format, options } = definition;
    const schema = definition.schema;
    const [hasInput, setHasInput] = useState(false);
    const [value, setValue] = useState(content);
    const [focus, setFocus] = useState(!typeA.includes(schema));
    const contentRef = useRef(null);
    const editingRef = useRef(false);

    useEffect(() => setValue(content), [content]);

    useEffect(() =>
    {
        editingRef.current = hasInput && focus;
    }, [hasInput, focus]);

    useEffect(() =>
    {
        if (!hasInput && value !== content && !typeA.includes(schema) && schema !== 'boolean')
        {
            onDataChanged && onDataChanged(definition.uniqueId, value);
        }
    }, [hasInput]);

    useEffect(() =>
    {
        if (contentRef.current)
        {
            const element = contentRef.current.parentNode;
            element.addEventListener('focus', handleFocus);
        }

        return () =>
        {
            if (contentRef.current)
            {
                const element = contentRef.current.parentNode;
                element.removeEventListener('focus', handleFocus);
            }
        };
    }, [contentRef]);

    // HANDLE AFTER FOCUSING AN ELEMENT
    const handleFocus = (event) =>
    {
        const prevSelectedElements = Array.from(document.querySelectorAll('.dg-cell.editable.selected-field'));
        prevSelectedElements.map(element => element.classList.remove('selected-field'));
        if (!editable)
        {
            return;
        }

        const curClassList = event.target.classList;
        if (curClassList.value.includes('dg-cell editable'))
        {
            curClassList.add('selected-field');
            setKeyDown(true, event.target);
        }

        if (typeA.includes(schema))
        {
            event.target.addEventListener('mouseup', () => hasInput && setFocus(true));
        }

        handleShowInput(event);
    };

    // ADD/REMOVE EVENT KEYDOWN
    const setKeyDown = (turnOn = false, element = contentRef.current?.parentNode) =>
    {
        if (!element)
        {
            return;
        }

        if (turnOn)
        {
            element.addEventListener('keydown', handleKeyDown);
            return;
        }
        element.removeEventListener('keydown', handleKeyDown);
    };

    const handleKeyDown = (event) =>
    {
        const key = event.which || event.code || event.keyCode;
        const enterKey = key === 13 || key === 'Enter';
        const spaceKey = key === 32 || key === 'Space' || key === ' ';

        // When editing, use 'Tab', 'Escape', 'Enter' key only.
        if (editingRef.current)
        {
            const active = (key === 'Tab' || key === 9 || key === 'Escape' || key === 27 || enterKey) || schema === 'boolean';
            active && handleFocusByKey(key, () => event.preventDefault(), true);
            return;
        }

        // If schema is 'select' or 'date', 'Enter' key is used to open option list.
        if (typeA.includes(schema))
        {
            if (enterKey)
            {
                event.stopImmediatePropagation();
                setFocus(true, handleShowInput(event), handleDateSchema());
            }
        }

        else if (schema === 'boolean')
        {
            if (enterKey)
            {
                event.stopImmediatePropagation();
                setFocus(!value, handleShowInput(event));
            }
        }


        else if ((event.key.length === 1 && !event.ctrlKey && !event.metaKey) || enterKey)
        {
            !enterKey && setValue(event.key);
            setHasInput(true);
        }

        // Handle 'Arrow' key.
        !enterKey && handleFocusByKey(key, () => event.preventDefault());
    };

    const handleFocusByKey = (key, callBack, editing = false) =>
    {
        const editableFields = Array.from(document.querySelectorAll('.dg-cell.editable'));
        const curFieldIndex = editableFields.findIndex(field => field.classList.value.includes('selected-field'));
        const numOfEditableField = getNumOfEditableFieldsPerRow();

        if (curFieldIndex < 0 || numOfEditableField === 0 || editableFields.length === 0)
        {
            return;
        }

        callBack && callBack();

        // ESCAPE
        if (key === 'Escape' || key === 27)
        {
            handleDateSchema(false);
            setValue(content);
            editingRef.current = false;
            editableFields[curFieldIndex].focus();
        }

        // KEY ENTER WHEN EDITING
        if ((key === 13 || key === 'Enter') && editing)
        {
            if (typeA.includes(schema))
            {
                setFocus(false);
                return;
            }

            if (schema === 'boolean')
            {
                setValue(!value);
                return;
            }
        }

        // KEY UP
        if (key === 'ArrowUp' || key === 38)
        {
            const switchedField = editableFields[curFieldIndex - numOfEditableField];
            switchedField && switchedField.focus();
        }

        // KEY DOWN & ENTER
        if ((key === 'ArrowDown' || key === 40) || (key === 13 || key === 'Enter'))
        {
            const switchedField = editableFields[curFieldIndex + numOfEditableField];
            if (switchedField)
            {
                switchedField.focus();
                return;
            }
            editableFields[curFieldIndex].focus();
        }

        if (numOfEditableField === 1)
        {
            return;
        }

        // KEY LEFT
        if ((key === 'ArrowLeft' || key === 37) && curFieldIndex % numOfEditableField !== 0)
        {
            const switchedField = editableFields[curFieldIndex - 1];
            switchedField && switchedField.focus();
        }

        // KEY RIGHT & TAB
        if (((key === 'Tab' || key === 9) || (key === 'ArrowRight' || key === 39)) && (curFieldIndex + 1) % numOfEditableField !== 0)
        {
            const switchedField = editableFields[curFieldIndex + 1];
            switchedField && switchedField.focus();
        }
    };

    const handleShowInput = (event) =>
    {
        if (typeA.includes(schema) || schema === 'boolean')
        {
            setHasInput(true);
        }
        else
        {
            event.target.addEventListener('dblclick', handleDbClick);
        }
        event.target.addEventListener('blur', handleBlur);
    };

    const handleDbClick = (event) =>
    {
        event.preventDefault();
        setHasInput(true);
    };

    const handleBlur = (event) =>
    {
        const curTarget = event.relatedTarget;
        const dynamicField = curTarget && curTarget.classList.value.includes('input-editable');
        const isClose = !curTarget || (curTarget && curTarget !== event.target && !dynamicField);
        const test = checkEditor(curTarget);

        if (typeA.includes(schema))
        {
            if (schema === 'date' && test)
            {
                handleDateSchema();
            }

            // If current target is AdvanceSelect, add blur event.
            if (test)
            {
                curTarget.addEventListener('blur', () =>
                {
                    editingRef.current = false;
                    contentRef.current.parentNode.focus();
                    setFocus(false);
                });
            }

            // Closing editor if current target isn't AdvanceSelect or is null
            if (isClose && !test)
            {
                handleClose();
                setFocus(false);
                return;
            }

            // If AdvanceSelect or DatePicker Overlay are visible, not focus cell;
            const hasOverlay = schema === 'date' ? document.querySelectorAll('.m-input-moment').length > 0 : document.querySelectorAll('.as-dropdown-container').length > 0;
            if (!hasOverlay)
            {
                event.target.focus();
            }

            return;
        }

        if (schema === 'boolean')
        {
            const checkbox = curTarget && curTarget.tagName === 'INPUT' && curTarget.type === 'checkbox';
            isClose && !checkbox && handleClose();
        }

        // If current target isn't editor, close editor.
        !dynamicField && handleClose();
    };

    const handleClose = () =>
    {
        const selectedCells = Array.from(document.querySelectorAll('.selected-field'));
        selectedCells.forEach(field => field.classList.remove('selected-field'));
        setHasInput(false);
    };

    const handleChangeDone = (val) =>
    {
        if (val !== undefined && val !== value)
        {
            if (typeA.includes(schema) || schema === 'boolean')
            {
                onDataChanged && onDataChanged(definition.uniqueId, val);
            }

            setValue(val);

            if (typeA.includes(schema))
            {
                setFocus(false);
                contentRef.current.parentNode.focus();
            }
        }
    };

    const checkEditor = (element) =>
    {
        if (!element)
        {
            return false;
        }

        const list = ['as-dropdown-container', 'as-container', 'dtp-container', 'input-editable', 'm-input-moment'];
        const classValue = element.classList?.value;
        const result = list.some(cls => classValue?.includes(cls));

        if (!result && element.parentNode)
        {
            return checkEditor(element.parentNode);
        }

        return result;
    };

    const handleDateSchema = (focusMode = true) =>
    {
        if (schema !== 'date')
        {
            return;
        }

        if (!focusMode)
        {
            const overlay = document.getElementById('modalRoot');
            overlay && overlay.parentNode.removeChild(overlay);
            return;
        }

        let datePicker;
        const intervelTime = setInterval(() =>
        {
            datePicker = document.querySelectorAll('.m-input-moment')[0];
            if (datePicker)
            {
                clearInterval(intervelTime);
                datePicker.tabIndex = 1;
                datePicker.focus();
                datePicker.addEventListener('keydown', (event) =>
                {
                    event.preventDefault();
                    const key = event.which || event.code || event.keyCode;
                    (key === 'Escape' || key === 27) && handleFocusByKey(key);
                });
            }
        }, 5);
    };

    if (!hasInput || !editable || schema === 'boolean')
    {
        switch (schema)
        {
            case 'boolean':
                return (
                    <div
                        ref={contentRef}
                        className={'boolean'}
                    >
                        {value
                            ? (
                                    <FAIcon
                                        className={'checkbox-icon'}
                                        icon={'check'}
                                        size={'.75rem'}
                                        color={'var(--primary-color)'}
                                    />
                                )
                            : <></>}

                        <CheckBox
                            className='checkbox-field'
                            checked={value}
                            disabled={!editable}
                            onChange={handleChangeDone}
                        />
                    </div>
                );

            case 'currency':
                return (
                    <div
                        ref={contentRef}
                        className={'number'}
                        style={style}
                    >{formatCurrency(content, locale)}
                    </div>
                );

            case 'datetime':
            case 'date':
                return (
                    <div
                        ref={contentRef}
                        className='datetime'
                    >
                        <span className='date'>
                            {moment(value).isValid() ? moment(value).format(format || (schema === 'date' ? 'L' : 'L LT')) : ''}
                        </span>
                    </div>
                );

            case 'numeric':
                return (
                    <div
                        ref={contentRef}
                        className={'number'}
                        style={style}
                    >{formatNumeric(content, format)}
                    </div>
                );

            case 'json':
                return content ? JSON.stringify(content) : null;

            case 'link':
                return <span ref={contentRef}><Link href={value ?? '#'}>{value}</Link></span>;

            case 'select':
            {
                const option = options?.find((option) => option.id === value);
                return option
                    ? (
                            <span ref={contentRef}>
                                {option.color
                                    ? (
                                            <Tag
                                                textCase={'sentence'}
                                                text={option.label}
                                                color={option.color}
                                                size={option.size ?? 'medium'}
                                                textStyle={{ ...style, color: option.textColor }}
                                                isRound
                                            />
                                        )
                                    : <div>{option.label}</div>
                                }
                            </span>
                        )
                    : <span ref={contentRef}>{value}</span>;
            }

            case 'multi-select':
                return options?.filter((option) => content?.includes(option.id)).map((option) => (
                    <Tag
                        key={option?.id}
                        textCase={'sentence'}
                        text={option?.label}
                        color={option?.color}
                        textStyle={{ ...style, color: option?.textColor }}
                        isRound
                    />
                ),
                );

            case 'image':
                return (
                    <div>
                        <Image
                            width={definition.imageWidth}
                            height={definition.imageHeight || '70px'}
                            src={content}
                            fitMode="contain"
                            canEnlarge
                        />
                    </div>
                );

            case 'react-node':
                return <Container>{content || null}</Container>;

            case 'chart':
                return (
                    <DataGridChartCell
                        content={content}
                        options={definition}
                    />
                );
            case 'progress':
                return (
                    <div>
                        <ProgressBar
                            total={content.max}
                            value={content.value}
                            color={content.bgColor}
                            percent
                        />
                    </div>
                );

            default:
                return (
                    <div
                        ref={contentRef}
                        style={style}
                        className={'text'}
                    >
                        {value}
                    </div>
                );
        }
    }

    return (
        <div
            ref={contentRef}
            className='dynamic-container'
            {...schema === 'boolean' ? { onMouseLeave: () => setHasInput(false) } : {}}
        >
            <DynamicField
                {...(typeA.includes(schema) ? { key: `${definition.uniqueId}--${focus}` } : {})}
                schema={DataTypes[schema[0].toUpperCase() + schema.slice(1)]}
                value={value}
                className={'input-editable'}
                options={options}
                autoFocus={focus}
                changeImmediately
                onChange={handleChangeDone}
                onClose={handleBlur}
            />
        </div>
    );
};

export { DataGridCell };
