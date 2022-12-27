import './FilterItem.scss';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    FlexPanel, Container,
    FAIcon, Tag, EmptyData, T,
    withI18n,
} from '@vbd/vui';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

import { FFMSCommonHelper } from 'extends/ffms/helper/common-helper';
import { PlainListItem } from 'extends/ffms/components/ListItem/PlainListItem';

export class FilterItem extends Component
{
    state = {
        countData: 0,
    };

    componentDidMount()
    {
        if (this.props.data && this.props.data.length)
        {
            this.setState({ countData: this.props.data.length });
        }
    }

    render()
    {
        let container;
        const { className, title, icon, iconType, iconOnly, type, data, size, onClick, total, innerRef, position, disabled } = this.props;

        const defaultColor = 'var(--default-color)';
        const defaultTextStyle = { color: 'var(--default-text-color)' };
        if (data && Array.isArray(data))
        {
            if (data.length === 0)
            {
                container = 'Chưa có bộ lọc nào được áp dụng';
            }
            else if (total === data.length)
            {
                container = <T params={[FFMSCommonHelper.pluralizeMe(this.props.fieldForceStore.appStore.contexts.tenant, this.props.t(title).toLowerCase(), total)]}>Tất cả %0%</T>;
            }
            else
            {
                container = (
                    <>
                        {
                            data.map((d, index) =>
                            {
                                return (
                                    <PopperTooltip
                                        key={index}
                                        placement={position || 'top'}
                                        trigger={['click', 'hover']}
                                        tooltip={d?.text}
                                    >
                                        <Container className={`${type === 'icon' ? 'fi-icon ' : ''}fi-container-item`}>
                                            {
                                                type === 'icon' ?
                                                    <>
                                                        <FAIcon
                                                            icon={icon || d.icon}
                                                            type={iconType || d.iconType}
                                                            size={size || '1rem'}
                                                            color={d?.color}
                                                            className={'fi-icon'}
                                                        />
                                                        { !iconOnly && <T>{d?.text}</T> }
                                                    </> :
                                                    <Tag
                                                        className={'tag-caption'}
                                                        size={'large'}
                                                        text={d?.text}
                                                        color={d?.color || defaultColor}
                                                        textStyle={d.textStyle || defaultTextStyle}
                                                    />
                                            }
                                        </Container>
                                    </PopperTooltip>
                                );
                            })
                        }
                    </>
                );
            }
        }
        else
        {
            container = <EmptyData />;
        }

        return (
            <FlexPanel flex={1} className={`fi-panel ${className ? className : ''}`}>
                <PlainListItem
                    label={
                        <>
                            <T>{title}</T>
                        </>
                    }
                    sub={
                        <Container className={`fi-container fi-form-row ${disabled ? 'active' : ''}`}>
                            {container}
                        </Container>
                    }
                    disableSelection={false}
                />
            </FlexPanel>
        );
    }
}

FilterItem.propTypes = {
    title: PropTypes.string,
    type: PropTypes.oneOf(['icon', 'tag']),
    style: PropTypes.object,
    icon: PropTypes.string,
    iconOnly: PropTypes.bool,
    iconType: PropTypes.string,
    size: PropTypes.string,
    onRemoveTag: PropTypes.func,
    // onClick: PropTypes.func,
    position: PropTypes.string,
    data: PropTypes.array,
    disabled: PropTypes.bool,
};

FilterItem.defaultProps = {
    style: {},
    title: '',
    type: 'icon',
    icon: '',
    iconType: 'solid',
    size: '1rem',
    position: 'top',
    iconOnly: false,
    data: [],
};

FilterItem = withI18n(inject('appStore', 'fieldForceStore')(observer(FilterItem)));
export default FilterItem;
