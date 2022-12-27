import './Menu.scss';
import 'react-popper-tooltip/dist/styles.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TooltipTrigger from 'react-popper-tooltip';
import _ from 'lodash';
import { T } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

import { MenuItem } from 'extends/ffms/pages/base/Menu';

const Menu = ({ trigger, children, className, hideArrow, type, childType, placement, onClose, ...props }) =>
{
    const [on, setOn] = useState(false);

    const renderTrigger = (tooltipProps, comp) =>
    {
        const triggerProps = {
            ...tooltipProps.getTriggerProps({
                [_.isFunction(trigger?.type) ? 'innerRef' : 'ref']: tooltipProps.triggerRef,
                className: `trigger ${_.get(trigger, 'props.className') ?? ''}`,
                key: 'T',
                text: _.get(trigger, 'props.label'),
            }),
        };
        return !!comp && React.cloneElement(comp, {
            ...triggerProps, onClick: (e) =>
            {
                setOn(true);
                _.isFunction(props.onClick) && props.onClick(e);
            },
        });
    };

    const renderMenuItem = (propsData) =>
    {
        const customMenuItem =
            <MenuItem {...propsData}>
                <FAIcon
                    size={'1rem'}
                    icon={_.get(propsData, 'icon')}
                />
                <div ><T>{_.get(propsData, 'label')}</T></div>
            </MenuItem>;
        return React.cloneElement(customMenuItem, customMenuItem.props);
    };

    const handleClick = async ({ closeOnClick, onClick }) =>
    {
        _.isFunction(onClick) && onClick();
        if (closeOnClick)
        {
            setOn(false);
        }
    };

    const removeFragment = (node) =>
    {
        let newChild = [];
        if (!_.isArray(node) && node.props?.isComponent)
        {
            return [node];
        }
        if (node.find(item => item?.type == MenuItem))
        {
            return node;
        }
        _.forEach(node, child =>
        {
            if (_.isArray(child.props.children))
            {
                newChild = _.concat(newChild, ...child.props.children);
            }
            else
            {
                newChild = _.concat(newChild, child.props.children);
            }
        });
        if (_.size(newChild) == 0)
        {
            return [];
        }
        return removeFragment(newChild);
    };

    return (
        <TooltipTrigger
            trigger={_.isArray(type) ? type : [type]}
            onVisibilityChange={(e) =>
            {
                setOn(e);
                _.isFunction(onClose) && !e && onClose(e);
            }}
            tooltipShown={on}
            placement={placement}
            tooltip={({
                arrowRef,
                tooltipRef,
                getArrowProps,
                getTooltipProps,
                placement,
            }) => (
                <div
                    {...getTooltipProps({
                        ref: tooltipRef,
                        className: `menu-container ${hideArrow ? 'hide-arrow' : ''}`,
                    })}
                >
                    {!hideArrow && (
                        <div
                            {...getArrowProps({
                                ref: arrowRef,
                                className: 'menu-arrow',
                                'data-placement': placement,
                            })}
                        />
                    )}
                    <div className='menu-body'>
                        {_.map(removeFragment(children), child =>
                        {
                            if (child?.type === MenuItem && !child.props?.isComponent)
                            {
                                if (child.props.children)
                                {
                                    return (
                                        <Menu
                                            {...child.props}
                                            // hideArrow
                                            className='menu-parent'
                                            
                                        >
                                            {_.isArray(child.props.children) ? child.props.children : [child.props.children]}
                                        </Menu>
                                    );
                                }
                                else
                                {
                                    return renderMenuItem({ ...child.props, onClick: () => handleClick(child.props) });
                                }
                            }
                            else
                            {
                                return child;
                            }
                        })}
                    </div>
                </div>
            )}
        >
            {({ getTriggerProps, triggerRef }) => (
                props.label ?
                    <div
                        {...getTriggerProps({
                            ref: triggerRef,
                            className: 'trigger',
                        })}
                        className={className}
                    >
                        {renderMenuItem(props)}
                    </div> :
                    renderTrigger({ getTriggerProps, triggerRef }, trigger)

            )}
        </TooltipTrigger >
    );
};

Menu.defaultProps = {
    type: 'click',
    childType: 'click',
    placement: 'right',
};

export default Menu;
