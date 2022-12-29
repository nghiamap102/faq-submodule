import React, { useState } from 'react';
import { FAIcon } from '@vbd/vicon';

import { Row2 } from 'components/bases/Layout';
import { T } from 'components/bases/Translate/Translate';

import './Collapse.scss';

interface CollapseProps
{
    className?: string,
    title?: string,
    leading?: React.ReactNode,
    disable?: boolean,
    expanded?: boolean
}

const Collapse:React.FC<CollapseProps> = (props) =>
{
    const [expanded, setExpanded] = useState(props.expanded);
    const toggle = () =>
    {
        setExpanded(!expanded);
    };

    return (
        <div className={`collapse-container ${props.disable ? 'disable' : ''}`}>
            <Row2
                className={'collapse-header'}
                justify='start'
            >
                {
                    <div className={'collapse-header-leading-container'}>
                        {props.leading}
                    </div>
                }
                <Row2 justify='between'>
                    <span
                        className={'collapse-header-title'}
                        onClick={toggle}
                    >
                        <T>{props.title}</T>
                    </span>
                    <FAIcon
                        className={'collapse-header-arrow-icon'}
                        type='solid'
                        icon={expanded ? 'chevron-up' : 'chevron-down'}
                        size='1rem'
                        color={'var(--contrast)'}
                        onClick={toggle}
                    />
                </Row2>
            </Row2>
            {
                expanded && (
                    <div className={`collapse-body ${expanded ? 'expanded' : ''}`}>
                        {props.children}
                    </div>
                )}
        </div>
    );
};

export { Collapse };
