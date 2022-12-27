import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

class InitDataManager extends Component
{
    caseStore = this.props.appStore.caseStore;

    constructor(props)
    {
        super(props);

        this.caseStore.init();
    }

    render()
    {
        return (<></>);
    }
}

InitDataManager = inject('appStore')(observer(InitDataManager));
export { InitDataManager };
