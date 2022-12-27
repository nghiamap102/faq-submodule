import './SearchSuggestCotainer.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { SuggestList } from './SuggestList';
import { ScrollView } from '@vbd/vui';

import PropTypes from 'prop-types';

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

    // handleAddSpecialLocation = (location) =>
    // {
    //     if (this.props.appState.ensureLogin() && location)
    //     {
    //         PopupManager.create('AddSpecialLocationDialog', this.props.appState, {
    //             id: 'add-special-location',
    //             data: location
    //         });
    //     }
    // };


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

SearchSuggestContainer = inject('appStore')(observer(SearchSuggestContainer));
export { SearchSuggestContainer };
