import './FeatureItem.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { FAIcon, useI18n } from '@vbd/vui';
import { SVGIconPath } from 'extends/ffms/bases/IconSvg/SVGIcon';

export const FeatureLink = (props) =>
{
    const { t } = useI18n();
    const { badgeCount, className, icon, to, tooltip } = props;
    const badge = badgeCount === 0 ? null : badgeCount;

    return (
        <NavLink
            className={`feature-item ${className}`}
            badge-count={badge}
            to={to}
            title={t(tooltip)}
        >
            {
                props.iconType === 'svg' ?
                    (
                        <SVGIconPath
                            className={'svg-icon--xsmall'}
                            name={icon}
                            fill={'rgba(var(--contrast-color-rgb), 0.5)'}
                        />
                    ) :
                    (
                        <FAIcon
                            icon={icon}
                            type={'light'}
                            size={'1.25rem'}
                        />
                    )
            }
        </NavLink>
    );
};

FeatureLink.propTypes = {
    id: PropTypes.string,
    to: PropTypes.string.isRequired,
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    badgeCount: PropTypes.number,
    tooltip: PropTypes.string,
    iconType: PropTypes.string, // svg
};

FeatureLink.defaultProps = {
    className: '',
    badgeCount: null,
    icon: '',
};
