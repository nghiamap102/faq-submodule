import React from 'react';
import clsx from 'clsx';
import { FAIcon } from '@vbd/vicon';

import { T } from 'components/bases/Translate/Translate';
import { SectionHeaderProps } from './model';

import './Section.scss';

export const SectionHeader:React.FC<SectionHeaderProps> = (props) =>
{
    const { className, children, textAlign, actions = [], onClick } = props;

    const headerActions = actions.map(({ icon, className, onClick, title }) => (
        <button
            key={icon}
            className={className}
            onClick={(e) =>
            {
                e.preventDefault();
                e.stopPropagation();
                onClick && onClick(e);
            }}
        >
            <FAIcon
                icon={icon}
                size={'1rem'}
                type={'light'}
            />
            <span><T>{title}</T></span>
        </button>
    ));

    return (
        <div
            className={clsx('section-header', onClick && 'clickable', className)}
            style={{ textAlign }}
            onClick={onClick}
        >
            <T>{children}</T>
            {headerActions}
        </div>
    );
};
