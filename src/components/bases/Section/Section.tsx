import React from 'react';
import clsx from 'clsx';

import { T } from 'components/bases/Translate/Translate';

import { SectionHeader } from './SectionHeader';
import { SectionProps } from './model';

import './Section.scss';

export const Section: React.FC<SectionProps> = (props) =>
{
    const { className, children, header, actions = [], onHeaderClick, innerRef } = props;

    return (
        <div
            ref={innerRef}
            className={clsx('section-panel', className)}
        >
            { header && (
                <SectionHeader
                    actions={actions}
                    onClick={onHeaderClick}
                >
                    <h3><T>{header}</T></h3>
                </SectionHeader>
            )}
            
            <div className={'section-panel-body'}>
                {children}
            </div>
        </div>
    );
};
