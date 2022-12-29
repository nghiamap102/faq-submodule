import { Property } from 'csstype';

import { CustomOnChange, IControllableField } from 'components/bases/Form/model/smartFormType';

export type TypographyVariant = 'TB1' | 'TB2' | 'HD1' | 'HD2' | 'HD3' | 'HD4' | 'HD5' | 'HD6' | 'Sub1' | 'Sub2'
export type TypographyColor = 'primary' | 'success' | 'default' | 'info' | 'danger' | 'warning'

export type TypographyProps = {
    secondary?: boolean
    className?: string
    onClick?: () => void
    style?: React.CSSProperties
    color?: TypographyColor
    variant: TypographyVariant
}

export type TextProps = Omit<TypographyProps,'variant'>

export type RichTextProps = {
    defaultValue?: string
    placeholder?: string
    className?: string
    color?: Property.Color
    rows?: number
    value?: string
    disabled?: boolean
    onChange?: (value: string) => void
    border?: Property.Border
} & IControllableField & CustomOnChange & Omit<JSX.IntrinsicElements['textarea'], 'onChange' | 'ref'>
