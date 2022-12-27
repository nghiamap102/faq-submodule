import './SearchContainer.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Container } from '@vbd/vui';

import { SearchBoxContainer } from './SearchBoxContainer';

class SearchContainer extends Component
{
    render()
    {
        return (
            <Container className="ml-search-searchbox-parent">
                <Container className="ml-search-searchbox-visibility-container visible">
                    <Container className="ml-search-searchbox">
                        <SearchBoxContainer
                            isSimpleContent={this.props.isSimpleContent}
                        />
                    </Container>
                </Container>
            </Container>
        );
    }
}

SearchContainer.propTypes = {
    isProvider: PropTypes.bool,
    isSimpleContent: PropTypes.bool,
};

SearchContainer.defaultProps = {
    isProvider: false,
    isSimpleContent: false,
};

SearchContainer = inject('appStore')(observer(SearchContainer));
export { SearchContainer };
