import { useEffect, useRef, useState } from 'react';

type ISetInput = (element: HTMLInputElement | null) => void;
type ISetFormat = (format: string) => void;
type IFormatValue = (value: string) => string;
type IFormat = (value: string, indexOfChange: number, isDecreased?: boolean) => string

type IUseFormat = (onlyNumber?: boolean) => {
    formatValue: IFormatValue,
    setInput: ISetInput,
    setFormat: ISetFormat,
}

const useFormat: IUseFormat = (onlyNumber = true) =>
{
    // to re-setSelectionRange. If using focusIndex as state, useEffect wont run when focusIndex is set same value
    const [toggle, setToggle] = useState<boolean>(true);

    const [prevValue, setPreValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const format = useRef<string>('');
    const indexOfSpec = useRef<number[]>([]);
    const focusIndex = useRef<number>();

    useEffect(() =>
    {
        focusIndex.current && inputRef.current && inputRef.current.setSelectionRange(focusIndex.current, focusIndex.current);
    }, [toggle]);

    const formatValue: IFormatValue = (value: string) =>
    {
        if (!value || value.length > format.current.length)
        {
            return value;
        }

        if (onlyNumber)
        {
            value = value.replace(/[^0-9]/g, '');
        }

        let indexOfChange: number = value.length;
        if (inputRef.current)
        {
            indexOfChange = inputRef.current.selectionStart || indexOfChange;
        }

        if (prevValue.length >= value.length)
        {
            setPreValue(value);
            value = handleFormat(value, indexOfChange, true);
            return value;
        }

        setPreValue(value);
        value = handleFormat(value, indexOfChange);
        return value;
    };

    const handleFormat: IFormat = (value, indexOfChange, isDecreased = false) =>
    {
        // isDecreased means value.length is decreased

        let i = 0;
        let numOfSpecialChar = 0;
        while (i < indexOfSpec.current.length)
        {
            const number = indexOfSpec.current[i];
            if (number <= value.length)
            {
                value = value.slice(0, number) + format.current[number] + value.slice(number);
                number === indexOfChange && numOfSpecialChar++;
                i++;
                continue;
            }
            break;
        }

        const reFocusIndex = indexOfChange + numOfSpecialChar > value.length ? value.length : indexOfChange + numOfSpecialChar;
        focusIndex.current = indexOfSpec.current.includes(reFocusIndex - 1) ? isDecreased ? reFocusIndex - 1 : reFocusIndex + 1 : reFocusIndex;
        setToggle(!toggle);
        return value;
    };

    const setInput: ISetInput = (element) => inputRef.current = element;

    const setFormat: ISetFormat = (formatString) =>
    {
        format.current = formatString.replace(/[a-zA-Z0-9]/g, 'X');
        indexOfSpec.current = format.current.split('').map((char, index) => char !== 'X' ? index : -1).filter(num => num >= 0);
    };

    return { setInput, formatValue, setFormat };
};

export default useFormat;

