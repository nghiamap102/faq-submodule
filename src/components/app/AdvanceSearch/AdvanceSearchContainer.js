import './AdvanceSearchContainer.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Container, PanelFooter } from '@vbd/vui';

import QueryBuilder from './QueryBuilder';
import ResultList from './ResultList';

class AdvanceSearchContainer extends Component
{
    advanceSearchStore = this.props.appStore.advanceSearchStore;

    handleClickResult = (obj, index) =>
    {
        this.advanceSearchStore.showMapPopup(obj, null, null, true);
    };

    handleApply = async () =>
    {
        this.advanceSearchStore.clearResultBeforeSearch(this.advanceSearchStore.selectedQuery);
        await this.advanceSearchStore.doSearch(this.advanceSearchStore.selectedQuery, false);
    };

    render()
    {
        return (
            <Container style={{ ...this.props.style }}>
                <QueryBuilder readOnly={this.props.readOnly} />
                <ResultList
                    readOnly={this.props.readOnly}
                    onItemClicked={this.handleClickResult}
                />
                <PanelFooter
                    disabled={this.props.readOnly}
                    actions={[
                        {
                            text: 'Tìm',
                            onClick: this.handleApply,
                        }]}
                />
            </Container>
        );
    }
}

AdvanceSearchContainer.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    readOnly: PropTypes.bool,
};

AdvanceSearchContainer.defaultProps = {
    className: '',
    style: {},
    readOnly: false,
};

AdvanceSearchContainer = inject('appStore')(observer(AdvanceSearchContainer));
export { AdvanceSearchContainer };
