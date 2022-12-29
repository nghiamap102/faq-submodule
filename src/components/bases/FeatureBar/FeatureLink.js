import './FeatureItem.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { FAIcon } from '@vbd/vicon';

import { useI18n } from 'components/bases/I18n/useI18n';

export const FeatureLink = (props) =>
{
    const { badgeCount, className, icon, to, tooltip, exact } = props;

    const { t } = useI18n();

    const badge = badgeCount === 0 ? null : badgeCount;

    return (
        <NavLink
            className={`feature-item ${className}`}
            badge-count={badge}
            to={to}
            exact={exact}
            title={t(tooltip)}
        >
            <FAIcon
                icon={icon}
                type={'light'}
                size={'1.25rem'}
            />
        </NavLink>
    );
};

FeatureLink.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    badgeCount: PropTypes.number,
    tooltip: PropTypes.string,
};

FeatureLink.defaultProps = {
    className: '',
    badgeCount: null,
    icon: '',
};
