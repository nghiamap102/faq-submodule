import React, { Component, createRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { T } from 'components/bases/Translate/Translate';
import { Loading } from 'components/bases/Modal/Loading';
import { Constants } from 'constant/Constants';

export class AdvanceSelectPopup extends Component
{
    state = { options: [], keyPressValue: null };

    scrollRef = createRef()
    containerRef = createRef()
    clickable = false
    numOfCol = 1

    componentDidMount()
    {
        const { options, noneSelectValue, searchKey, searchable } = this.props;
        this.setState({ searchKey });

        !searchable && this.containerRef.current?.focus();

        const isEmpty = (value) =>
        {
            return !value || Object.keys(value).length === 0;
        };

        if (!isEmpty(noneSelectValue))
        {
            options.unshift({ id: 'non-select', dropdownDisplay: noneSelectValue });
        }

        document.addEventListener('keydown', this.handleKeyPress, true);
        document.addEventListener('wheel', this.preventScroll, { capture: true, passive: false });

        const element = document.querySelector('.as-dropdown-item.active');
        element && element.scrollIntoView({ block: 'center' });
    }

    componentWillUnmount()
    {
        document.removeEventListener('keydown', this.handleKeyPress, true);
        document.removeEventListener('wheel', this.preventScroll, { capture: true, passive: false });
    }

    static getDerivedStateFromProps(nextProps, prevState)
    {
        if (nextProps.options && nextProps.options !== prevState.options)
        {
            if (nextProps.isVisible)
            {
                // when searching
                if (prevState.isSearching)
                {
                    return { options: prevState.options };
                }
                else // load state when option change
                {
                    return { options: nextProps.options, keyPressValue: nextProps.selectedValue };
                }
            }
            else
            {
                // when turn off popup
                return { options: nextProps.options };
            }
        }

        return null;
    }

    preventScroll = (event) =>
    {
        const path = event.path || (event.composedPath && event.composedPath()); // event.composedPath() for cross browser compatibility
        const isAdvanceSelectDropdown = path?.some(elm => this.scrollRef.current === elm);
        if (!isAdvanceSelectDropdown)
        {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    handleKeyPress = (e) =>
    {
        // stop scroll when click arrow up arrow down
        e.stopPropagation();
        
        const { multi, selectedValue, isGridView, getInputRef, searchable } = this.props;
        const { keyPressValue, options } = this.state;

        if (this.props.isVisible)
        {
            const currentTarget = document.activeElement;
            let index = options?.findIndex((op) => op.id === keyPressValue) || 0;

            const isFocusPopup = currentTarget && currentTarget === this.containerRef.current;

            switch (e.which)
            {
                case Constants.KEYS.ENTER:
                    multi
                        ? this.onSelectItem(e, keyPressValue, !selectedValue.includes(keyPressValue))
                        : this.props.onSelectChange && this.props.onSelectChange(keyPressValue, undefined, e);
                    return;

                case Constants.KEYS.UP:
                    if (!isGridView)
                    {
                        index--;
                        index = index < 0 ? options.length - 1 : index;
                        break;
                    }

                    if (!isFocusPopup)
                    {
                        return;
                    }

                    index -= this.numOfCol;
                    if (searchable && isFocusPopup && index < 0)
                    {
                        const input = getInputRef();
                        input && input.focus();
                        index = -1;
                        break;
                    }

                    index = index < 0 ? index + options.length : index;
                    break;

                case Constants.KEYS.DOWN:
                    if (!isGridView)
                    {
                        index++;
                        index = index >= options.length ? 0 : index;
                        break;
                    }

                    if (!isFocusPopup)
                    {
                        this.containerRef.current.focus();
                        break;
                    }
                    
                    index += this.numOfCol;
                    index = index >= options.length ? index - options.length : index;
                    break;

                case Constants.KEYS.LEFT:
                    if (isGridView)
                    {
                        if (currentTarget && currentTarget === this.containerRef.current)
                        {
                            index--;
                            index = index < 0 ? options.length - 1 : index;
                            break;
                        }
                    }
                    return;
                
                case Constants.KEYS.RIGHT:
                    if (isGridView)
                    {
                        if (currentTarget && currentTarget === this.containerRef.current)
                        {
                            index++;
                            index = index >= options.length ? 0 : index;
                            break;
                        }
                    }
                    return;

                default:
                    return;
            }
        
            if (index >= 0 && !!options[index])
            {
                this.setState({ keyPressValue: options[index].id }, () =>
                {
                    const element = document.querySelector('.as-dropdown-item.keypress-active');
                    element && element.scrollIntoView({ block: 'center' });
                });
            }
        }
    };

    onSelectItem = (e, optionId, active) =>
    {
        const { multi, selectedValue, onSelectChange } = this.props;

        if (multi && Array.isArray(selectedValue))
        {
            let values;

            if (active)
            {
                values = [...selectedValue, optionId];
            }
            else
            {
                values = selectedValue.filter((val) => val !== optionId);
            }

            onSelectChange(values, optionId, e);
        }
        else
        {
            onSelectChange(optionId, undefined , e);
        }
    };

    renderDropdownContent = (option, hasDividers) =>
    {
        const { selectedValue, multi } = this.props;
        const keyPressActive = this.state.keyPressValue === option.id;

        let isActive = false;

        if (multi && Array.isArray(selectedValue))
        {
            isActive = selectedValue.includes(option.id);
        }
        else
        {
            isActive = selectedValue === option.id;
        }

        return (
            <li
                key={option.id}
                className={
                    `as-dropdown-item ${isActive ? 'active' : ''} \
                     ${keyPressActive ? 'keypress-active' : ''} \
                     ${hasDividers ? 'dividers' : ''}`
                }
                onClick={(e) => this.onSelectItem(e, option.id, !isActive)}
            >
                <div className="as-dropdown-item-button">
                    <T>{option.dropdownDisplay}</T>
                </div>
            </li>
        );
    };

    render()
    {
        const { options } = this.state;
        const { isVisible, titleText, width, hasDividers, searchable, isGridView, isLoading } = this.props;

        const col = (options.length === 1 || options.length === 2) ? options.length : Math.ceil(Math.sqrt(options.length));
        this.numOfCol = col;

        let gridTemplateColumns = '';
        for (let i = 1; i <= col; i++)
        {
            gridTemplateColumns += 'auto ' ;
        }

        return (
            <div
                ref={this.containerRef}
                id='advance-select-popup'
                className={`as-dropdown-container ${isVisible ? 'visible' : ''}`}
                style={{ width }}
                tabIndex={(!searchable && !isGridView) ? 0 : 1}
            >
                {isLoading && (
                    <Loading
                        spinnerSize='sm'
                        direction="row"
                        text="Loading options..."
                        overlay
                    />
                )}

                {titleText && (
                    <div className="as-dropdown-title">
                        <span><T>{titleText}</T></span>
                    </div>
                )}

                <ScrollView containerRef={scrollElm => this.scrollRef.current = scrollElm}>
                    <ul
                        className={clsx('as-dropdown-list', { 'grid-view': isGridView })}
                        style={{ ...(isGridView ? { gridTemplateColumns } : {}) }}
                    >
                        {
                            options && options.map((option) =>
                            {
                                return this.renderDropdownContent(option, hasDividers);
                            })
                        }
                    </ul>
                </ScrollView>
            </div>
        );
    }
}

AdvanceSelectPopup.propTypes = {
    onSelectChange: PropTypes.func,
    multi: PropTypes.bool,
    isVisible: PropTypes.bool,
    isLoading: PropTypes.bool,
    options: PropTypes.array.isRequired,
    selectedValue: PropTypes.any,
    width: PropTypes.string,
    noneSelectValue: PropTypes.string,
    titleText: PropTypes.string,
    searchable: PropTypes.bool,
    isGridView: PropTypes.bool,
    getInputRef: PropTypes.func,
};

AdvanceSelectPopup.defaultProps = {
    selectedValue: '',
    titleText: '',
    noneSelectValue: '',
    isVisible: false,
    isGridView: false,
    onSelectChange: () =>
    {
    },
};

