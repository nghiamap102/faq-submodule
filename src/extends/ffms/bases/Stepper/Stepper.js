import './Stepper.scss';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Container, Column, T } from '@vbd/vui';
import { Button } from '@vbd/vui';

export const Stepper = (props) =>
{
    const { list, current } = props;
    const [steps, setSteps] = useState([...list]);
    const [active, setActive] = useState({ ...list[current] });
    useEffect(() =>
    {
        setActive(list[current]);
    }, [list], current);

    const nextStep = () =>
    {
        if (steps[steps.length - 1].key === active.key)
        {
            return;
        }
  
        const index = steps.findIndex((step) => step.key === active.key);
        setSteps((prevStep) =>
            prevStep.map((step) =>
            {
                if (step.key === active.key)
                {
                    step.isDone = true;
                }
                return step;
            }),
        );
        setActive(steps[index + 1]);
    };
  
    const backStep = () =>
    {
        const index = steps.findIndex((step) => step.key === active.key);
        if (index === 0)
        {
            return;
        }
  
        setSteps((prevStep) =>
            prevStep.map((step) =>
            {
                if (step.key === active.key)
                {
                    step.isDone = false;
                }
                return step;
            }),
        );
        setActive(steps[index - 1]);
    };
  
    return (
        <Column
            mainAxisAlignment={'space-between'}
            className={'step-wizard'}
        >
            <Container className={'step-wizard-process'}>
                <ul>
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            step={step}
                            active={active}
                            index={index}
                        />
                    ))}
                </ul>
            </Container>

            <Container flex={1} className="step-wizard-content">
                {<active.component />}
            </Container>
        </Column>
    );
};

Stepper.propTypes = {
    list: PropTypes.array,
    current: PropTypes.number,
    onClick: PropTypes.func,
};
Stepper.defaultProps = {
    onClick: () =>
    {
    },
};
export default Stepper;


const Step = ({ step, active, index }) => (
    
    <li
        className={`step ${active.key === step.key ? 'active' : ''} ${step.isDone ? 'done' : ''}`}
    >
        <span className={'title'}><T>{step.title}</T></span>
        <span className={'label'}><T>{step.label}</T></span>
        {
            step.isIcon &&
            <Button
                onlyIcon
                icon={step.icon}
                className={'icon'}
            />
        }
        {
            step.isNumber &&
            <span className={'aaa'}>{index + 1}</span>
        }
    </li>
);
Step.propTypes = {
    step: PropTypes.object,
    active: PropTypes.object,
    index: PropTypes.number,
};
Step.defaultProps = {
    index: 1,
};
