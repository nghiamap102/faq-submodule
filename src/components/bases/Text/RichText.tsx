import React, { ChangeEventHandler, forwardRef } from 'react';

import { RichTextProps } from './model/textType';

export const RichText = forwardRef<HTMLTextAreaElement, RichTextProps>((props, ref) =>
{
    const { onChange, customOnChange, className, color, rows = 5, border = 'block',...restProps } = props;

    const handleChange:ChangeEventHandler<HTMLTextAreaElement> = (event) =>
    {
        customOnChange && customOnChange(event);
        !customOnChange && typeof onChange === 'function' && onChange && onChange(event.target.value);
    };

    return (
        <textarea
            ref={ref}
            className={className}
            style={{
                minHeight: (rows * 17) + 'px',
                maxHeight: (rows * 17) + 'px',
                color,
                padding: '5px',
                border,
            }}
            rows={rows}
            data-autofocus
            onChange={handleChange}
            {...restProps}
        />
    );
});

RichText.displayName = 'RichText';
