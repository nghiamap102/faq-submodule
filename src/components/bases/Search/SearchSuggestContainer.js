import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { SuggestList } from './SuggestList';

import './SearchSuggestCotainer.scss';

class SearchSuggestContainer extends Component
{
    static propTypes = {
        searchResults: PropTypes.array.isRequired,
    };

    handleSelect = (data) =>
    {
        if (this.props.onSelect)
        {
            this.props.onSelect(data);
        }
    };

    render ()
    {
        const { searchResults , handleClickSetting } = this.props;

        return (
            <ScrollView
                className="ml-directions-suggestion-container ml-directions-suggestions-shown"
                style={{ 'maxHeight': this.props.maxHeight ? this.props.maxHeight : 700 }}
            >
                <SuggestList
                    data={searchResults}
                    onSelect={this.handleSelect}
                    onClickSetting={handleClickSetting ? handleClickSetting : null}
                />
            </ScrollView>
        );
    }
}

export { SearchSuggestContainer };
