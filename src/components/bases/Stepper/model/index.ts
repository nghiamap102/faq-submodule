export interface StepperProps {
    className?: string;
    current?: number;
    direction?: 'horizontal' | 'vertical';
    labelPlacement?: 'horizontal' | 'vertical';
    progressDot?: boolean;
    size?: 'default' | 'small';
    type?: 'default' | 'navigation';
    onChange?: (current: number) => void;
}

export interface StepProps {
    title?: string;
    subTitle?: string;
    status?: 'wait' | 'current' | 'finish' | 'error';
    icon?: string;
    disabled?: boolean;
    description?: string;
    index?: number;
    size?: 'default' | 'small';
    spinIcon?: boolean,
    typeIcon?: 'solid' | 'regular' | 'light';
    dot?: boolean,
    onClick?: (index: number) => void;
    clickable?: boolean;
}
