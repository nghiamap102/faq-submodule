import { useRef, useEffect, forwardRef, ForwardedRef } from 'react';

import ScrollBar from 'lib/react-perfect-scrollbar';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { Sub1 } from 'components/bases/Text';
import { CustomOnChange, IControllableField } from '../Form/model/smartFormType';

import './MultilineInput.scss';

export type MultilineInputProps = IControllableField & CustomOnChange & Omit<JSX.IntrinsicElements['textarea'], 'onChange'> & {
    className?: string;
    maxTextareaHeight?: string;
    onChange?: Function;
    autoFocus?: boolean;
    defaultValue?: string;
    id?: string;
}

export const MultilineInput = forwardRef((props: MultilineInputProps, ref: ForwardedRef<HTMLTextAreaElement>) =>
{
    const { customOnChange, onChange, className, autoFocus, maxTextareaHeight, rows = 2, defaultValue, value, id, errorText, ...textareaProps } = props;

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const scrollRef = useRef<ScrollBar | null>(null);
    const containerRef = useRef<HTMLElement | null>(null);

    useEffect(() =>
    {
        if (inputRef.current)
        {
            updateInputHeight();
        }
    }, []);

    useEffect(() =>
    {
        updateInputHeight();
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        updateInputHeight();
        customOnChange && customOnChange(event);
        !customOnChange && onChange && onChange(event.target.value);
    };

    const updateInputHeight = () =>
    {
        if (!inputRef.current)
        {
            return;
        }
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';

        if (containerRef.current)
        {
            containerRef.current.scrollTop = inputRef.current.offsetHeight;
        }
        scrollRef?.current?.['updateScroll']();
    };

    return (
        <>
            <div
                className={`multiline_input${(className) ? ' ' + className : ''}`}
                style={{ height: maxTextareaHeight }}
            >
                <ScrollView
                    ref={scrollRef}
                    containerRef={(element: HTMLElement) => containerRef.current = element}
                    onSync={(_: any) =>
                    {}}
                >
                    <div className="multiline_input">
                        <textarea
                            ref={(e) =>
                            {
                                !!ref && (isCallBackRef(ref) ? ref(e) : ref.current = e);
                                inputRef.current = e;
                            }}
                            {...textareaProps}
                            className="post-textarea"
                            id={id}
                            autoComplete="off"
                            rows={rows}
                            defaultValue={defaultValue}
                            autoFocus={autoFocus}
                            onChange={handleChange}
                        />
                    </div>
                </ScrollView>
            </div>
            {errorText && (
                typeof errorText === 'string'
                    ? <Sub1 color={'danger'}>{errorText}</Sub1>
                    : errorText.map((text: string, index: number) => (
                        <>
                            <Sub1
                                key={`error-${index}`}
                                color={'danger'}
                            >
                                {text}
                            </Sub1>
                            <br />
                        </>
                    ))
            )}
        </>
    );
});

MultilineInput.displayName = 'MultilineInput';

const isCallBackRef = (ref: Exclude<ForwardedRef<HTMLTextAreaElement>, null>): ref is (instance: HTMLTextAreaElement | null) => void => !('current' in ref);

