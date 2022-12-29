import React from 'react';
import clsx from 'clsx';
import { FAIcon, SVG, SVGName } from '@vbd/vicon';

import { T } from 'components/bases/Translate/Translate';

import './ListItem.scss';

const ICON_POSITION_ENUM: Record<IconPosition, string> = {
    top: 'flex-start',
    middle: 'center',
    bottom: 'flex-end',
};

type IconType = 'solid' | 'regular' | 'light'
type IconPosition = 'top' | 'middle' | 'bottom'

export type ListItemProps = {
    className?: string,
    active?: boolean
    isImportant?: boolean
    iconUrl?: string
    iconClass?: string
    iconColor?: string
    iconType?: IconType
    iconTypeSvg ?: boolean
    icon?: React.ReactNode
    label?: React.ReactNode
    sub?: React.ReactNode
    // true to disable selection model
    disableSelection?: boolean
    splitter?: boolean
    iconPosition?: IconPosition
    trailing?: React.ReactNode
    onClick?: () => void
    direction?: 'row' | 'column'
}

export const ListItem = (props: ListItemProps): JSX.Element =>
{
    const { disableSelection, active, className, direction = 'row', splitter } = props;
    const { icon, iconUrl, iconClass, iconColor, iconType = 'light', iconPosition = 'middle', iconTypeSvg } = props;
    const { label, isImportant, sub, trailing, onClick } = props;

    const listItemWrapperClasses = clsx(
        `list-item--direction-${direction}`,
        {
            ['list-item-reader']: disableSelection,
            ['list-item-container']: !disableSelection,
            ['active']: active,
            ['splitter']: splitter,
        },
        className,
    );

    return (
        <div
            className={listItemWrapperClasses}
            onClick={onClick}
        >
            {(iconUrl || iconClass || icon) && (
                <div
                    className="list-item-icon"
                    style={{ alignSelf: ICON_POSITION_ENUM[iconPosition] }}
                >
                    <div className="list-icon list-item-icon-inner">
                        {iconUrl && (
                            <img
                                alt={'icon-url'}
                                src={iconUrl}
                            />
                        )}

                        {iconClass && !iconTypeSvg && (
                            <FAIcon
                                icon={iconClass}
                                color={iconColor}
                                type={iconType}
                                size={'1.125rem'}
                            />
                        )}

                        {iconClass && iconTypeSvg && (
                            <SVG
                                name={iconClass as SVGName}
                                width={'18px'}
                                height={'18px'}
                                fill={'rgba(var(--contrast), 0.5)'}
                            />
                        )}

                        {icon && icon}
                    </div>
                </div>
            )}

            <div className="list-item-content">
                <div className="list-item-title ml-ellipsis">
                    <T>{label}</T>
                    {isImportant && <span style={{ color: 'red' }}>&nbsp;(*)</span>}
                </div>

                {sub && (
                    <div className="list-item-subtitle-line ml-ellipsis">
                        <div className="list-item-subtitle">
                            <T>{sub}</T>
                        </div>
                    </div>
                )}
            </div>

            {trailing && <div className="list-item-secondary">{trailing}</div>}
        </div>
    );
};
