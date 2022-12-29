import React from 'react';

import { CheckBox, CheckBoxProps } from 'components/bases/CheckBox/CheckBox';

export type RadioProps = Omit<CheckBoxProps, 'displayAs'>
export const Radio = (props: RadioProps): JSX.Element =>
{
    return (
        <CheckBox
            {...props}
            displayAs={'radio'}
        />
    );
};
