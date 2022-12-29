import './FeatureText.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { useI18n } from 'components/bases/I18n/useI18n';

const FeatureText = (props) =>
{
    const { t } = useI18n();

    const handleClick = (event) =>
    {
        props.onClick && props.onClick(props, event);
    };

    const badge = props.badgeCount === 0 ? null : props.badgeCount;
    let content = props.content;

    if (content && content.length > 2)
    {
        content = content.substr(0, 2);
    }

    return (
        <button
            className={`feature-item feature-text ${props.active ? 'active' : ''} ${props.className}`}
            onClick={handleClick}
            badge-count={badge}
            title={t(props.title)}
        >
            <div className="text-container">{content}</div>
        </button>
    );
};

FeatureText.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    content: PropTypes.string.isRequired,
    active: PropTypes.bool,
    badgeCount: PropTypes.number,
    title: PropTypes.string,
    onClick: PropTypes.func,
};

FeatureText.defaultProps = {
    id: '',
    className: '',
    badgeCount: null,
    active: false,
    icon: '',
    onClick: () =>
    {
    },
};

export { FeatureText };
