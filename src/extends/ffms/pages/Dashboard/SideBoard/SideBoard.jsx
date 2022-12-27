import React from 'react';
import * as _ from 'lodash';

import { PanelHeader } from '@vbd/vui';

import FilterBoard from 'extends/ffms/pages/Dashboard/FilterBoard/FilterBoard';
import MasterBoard from 'extends/ffms/pages/Dashboard/MasterBoard/MasterBoard';

const SideBoard = () =>
{
    return (
        <>
            <PanelHeader>Bảng điều khiển</PanelHeader>
            <FilterBoard />
            <MasterBoard />
        </>
    );
};

export default SideBoard;
