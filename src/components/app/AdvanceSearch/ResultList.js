import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Container, PanelHeader, LazyLoadList } from '@vbd/vui';

class ResultList extends Component
{
    advanceSearchStore = this.props.appStore.advanceSearchStore;

    render()
    {
        const result = this.advanceSearchStore.getResult(this.advanceSearchStore.selectedQuery);
        const items = result ? result.data : [];

        return (
            <Container style={{ ...this.props.style }}>
                <PanelHeader>
                    Kết quả tìm kiếm
                </PanelHeader>

                <LazyLoadList
                    items={items}
                    titleField="Title"
                    iconUrlField="IconUrl"
                    isSearching={this.advanceSearchStore.isSearching}
                    onItemClicked={this.props.onItemClicked}
                    onYReachEnd={this.props.onYReachEnd}
                />
            </Container>
        );
    }
}

ResultList = inject('appStore')(observer(ResultList));
export default ResultList;
