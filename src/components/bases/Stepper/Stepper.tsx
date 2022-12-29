import React from 'react';
import clsx from 'clsx';
import { useWindowSize } from 'hooks/useWindowSize';

import Step from './Step';

import './Stepper.scss';
import { StepperProps, StepProps } from './model';

const Stepper: React.FC<StepperProps> = (props) =>
{
    const { direction = 'horizontal', labelPlacement = 'horizontal', size = 'default', type = 'default' } = props;
    const { className, current, onChange, children, progressDot } = props;

    const [ width ] = useWindowSize();

    const handleChange = (index: number) => onChange && onChange(index);

    const classes = clsx(
        className,
        'stepper__container',
        width <= 576 ? 'stepper__container--vertical' : `stepper__container--${direction}`,
        ((labelPlacement === 'vertical' && !progressDot && direction !== 'vertical') || (progressDot && direction !== 'vertical')) && 'stepper__container__label--vertical',
        size === 'small' && 'stepper__container--small',
        progressDot && 'stepper__container--dot',
        type === 'navigation' && 'stepper-navigation',
    );

    const injectStepProps = (child: React.ReactNode, index: number) =>
    {
        const status = current !== undefined ? detectStepStatus(current, index) : current;
        const injectProps: StepProps = { index, size, dot: progressDot, onClick: handleChange, clickable: !!onChange, ...(status ? { status } : {}) };

        return isStepComponent(child) ? React.cloneElement(child, injectProps) : child;
    };

    const detectStepStatus = (currentIndex: number, index: number): Pick<StepProps, 'status'>['status'] =>
    {
        return currentIndex > index ? 'finish' : currentIndex === index ? 'current' : undefined;
    };
    const isStepComponent = (element: React.ReactNode): element is React.ReactElement<StepProps> => React.isValidElement(element) && element.type === Step;

    return (
        <div className={classes}>
            { React.Children.map(children, injectStepProps) }
        </div>
    );
};

export default Stepper;
