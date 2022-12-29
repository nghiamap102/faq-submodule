import './LazyLoadList.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { ListItem } from 'components/bases/List/List';
import { Container } from 'components/bases/Container/Container';
import { EmptyButton } from 'components/bases/Button/Button';

export class LazyLoadList extends Component
{
    state = {
        activeIndex: -1,
    };

    handleClickItem(obj, index)
    {
        this.setState({ activeIndex: index });

        if (typeof (this.props.onItemClicked) === 'function')
        {
            this.props.onItemClicked(obj, index);
        }
    }

    render()
    {
        const items = this.props.items;

        return (
            <Container className="lazy-load-list-container">
                <ScrollView onYReachEnd={this.props.onYReachEnd}>
                    {
                        items.map((item, i) =>
                        {
                            return (
                                <ListItem
                                    key={i}
                                    label={item[this.props.titleField]}
                                    sub={item[this.props.subTitleField]}
                                    iconUrl={item[this.props.iconUrlField]}
                                    active={this.state.activeIndex === i}
                                    trailing={this.props.onMenuClick && (
                                        <EmptyButton
                                            size="sm"
                                            icon="ellipsis-v"
                                            onlyIcon
                                            onClick={this.props.onMenuClick}
                                        />
                                    )}
                                    onClick={() => this.handleClickItem(item, i)}
                                />
                            );
                        })
                    }
                </ScrollView>
                {this.props.isSearching && (
                    <Container className="loading-container">
                        <Container className="lds-ripple">
                            <Container />
                            <Container />
                        </Container>
                    </Container>
                )}
            </Container>
        );
    }
}

LazyLoadList.propTypes = {
    items: PropTypes.any,
    isSearching: PropTypes.bool,
    titleField: PropTypes.string,
    subTitleField: PropTypes.string,
    iconUrlField: PropTypes.string,
    onItemClicked: PropTypes.func,
    onMenuClick: PropTypes.func,
    onYReachEnd: PropTypes.func,
};
