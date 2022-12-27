import './Accordion.scss';

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { T } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';
import { isEmpty } from 'helper/data.helper';
class Accordion extends Component
{
    state = {
        active: this.props.active || 0,
        items: this.props.items || [],
        ownUpdate: false,
    }

    // getDerivedStateFromProps is now called every time a component is rendered or props change
    // outUpdate is compare the incoming active to the previous active by storing the previous props in state
    static getDerivedStateFromProps(nextProps, prevState)
    {
        if (prevState.ownUpdate || nextProps.items.length === prevState.items.length)
        {
            return {
                active: prevState.active,
                ownUpdate: false,
            };
        }
        else if (nextProps.active !== prevState.active)
        {
            return {
                active: nextProps.active,
                items: nextProps.items,
            };
        }
        return null;
    }

    onChangeActive = (index) =>
    {
        const { active } = this.state;
        if (active === index)
        {
            this.setState({
                active: false,
            });
        }
        else
        {
            this.setState({
                active: index,
                ownUpdate: true,
            });
        }
    }

    render()
    {
        const { items, className, actions, width, iconExpand, multiple } = this.props;

        return (
            <div
                className={`${className} accordion`}
                style={{ width: width }}
            >
                {
                    items.map((data, index) =>
                        <AccordionItem
                            key={index}
                            actions={actions}
                            multiple={multiple}
                            iconExpand={iconExpand}
                            data={data}
                            // active for single mode
                            active={this.state.active === index}
                            onActive={()=>this.onChangeActive(index)}
                        />,
                    )
                }
            </div>
        );
    }
}
Accordion.propTypes = {
    items: PropTypes.array,
    className: PropTypes.string,
    actions: PropTypes.array,
    width: PropTypes.string,
    iconExpand: PropTypes.string,
    multiple: PropTypes.bool,
    active: PropTypes.number,
};
Accordion.defaultProps = {
    items: [],
    className: '',
    actions: [],
    width: '',
    iconExpand: '',
    multiple: false,
    active: 0,
};
export default Accordion ;

class AccordionItem extends React.Component
{
    state = {
        height: 0,
        expanded: this.props.data.expanded || false,
    }

    constructor(props)
    {
        super(props);
        this.acdRef = React.createRef();
    }

    componentDidMount()
    {
        window.setTimeout(() =>
        {
            const rf = this.acdRef.current;
            const height = rf.querySelector('.accordion-content').scrollHeight;
            this.setState({
                height: height,
            });
        }, 500);
    }

    onClick = () =>
    {
        this.props.multiple ? this.setState({ expanded: !this.state.expanded }) : this.props.onActive();
    }

    render()
    {
        const { data, actions, iconExpand, multiple, active } = this.props;
        const { height, expanded } = this.state;
        const isOpen = () => (multiple ? expanded : active);
        
        return (
            <div
                ref={this.acdRef}
                className={isOpen() ? 'accordion-item open' : 'accordion-item'}
            >
                <div className={'accordion-header'}>
                    <h3
                        onClick={this.onClick}
                    >
                        {!isEmpty(data.header) ? <T>{data.header}</T> : <T>{'Tiêu đề'}</T>}
                    </h3>
                    <div className={'accordion-header-actions'}>
                        <button
                            onClick={this.onClick}
                        >
                            <FAIcon
                                icon={iconExpand ? iconExpand : isOpen() ? 'minus' : 'plus'}
                                size={'1rem'}
                                type={'light'}
                                tooltip={isOpen() ? 'Thu nhỏ' : 'Mở rộng'}
                            />
                        </button>
                        {
                            actions && actions.length > 0 && actions.map((action) =>
                                <button
                                    key={action.icon}
                                    onClick={()=>action.onClick(data)}
                                >
                                    <FAIcon
                                        icon={action.icon}
                                        size={'1rem'}
                                        type={'light'}
                                        tooltip={action.tooltip}
                                    />
                                </button>,
                            )
                        }
                        
                    </div>
                </div>

                <div
                    className={'accordion-content'}
                    style={{ height: `${isOpen() ? height : 0}px` }}
                >
                    <div className={'accordion-content-inner'}>
                        {data.content}
                    </div>
                </div>
            </div>);
    }
}
AccordionItem.propTypes = {
    data: PropTypes.any,
    actions: PropTypes.array,
    iconExpand: PropTypes.string,
    multiple: PropTypes.bool,
    active: PropTypes.any,
    onActive: PropTypes.func,
};
AccordionItem.defaultProps = {
    actions: [],
    onActive: () =>
    {
    },
};
export { AccordionItem };
