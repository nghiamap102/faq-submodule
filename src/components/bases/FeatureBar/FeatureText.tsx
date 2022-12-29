import './FeatureText.scss';

import React from 'react';

import { useI18n } from 'components/bases/I18n/useI18n';

export type FeatureTextProps = {
    id?: string
    className?: string
    content?: string
    active?: boolean
    badgeCount?: number
    title?: string
    onClick?: (props: FeatureTextProps, event: React.MouseEvent<HTMLElement>) => void
}

export const FeatureText: React.FC<FeatureTextProps> = (props) =>
{
    const { id, className, content, active, badgeCount, title, onClick } = props;
    const { t } = useI18n();

    const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    {
        onClick && onClick(props, event);
    };

    const badge = badgeCount ? badgeCount : null;
    let adjustContent = content;

    if (content && content.length > 2)
    {
        adjustContent = content.substr(0, 2);
    }

    return (
        <button
            id={id}
            className={`feature-item feature-text ${active ? 'active' : ''} ${className ? className : ''}`}
            badge-count={badge}
            title={t(title)}
            onClick={handleClick}
        >
            <div className="text-container">{adjustContent}</div>
        </button>
    );
};
