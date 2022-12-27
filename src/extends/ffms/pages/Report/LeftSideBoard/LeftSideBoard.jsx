import PropTypes from 'prop-types';
import './LeftSideBoard.scss';
import React from 'react';
import * as _ from 'lodash';

import { PanelHeader } from'@vbd/vui';
import { T } from '@vbd/vui';
import ReportListBoard from './ReportListBoard';
import LayerReport from './LayerReport';

const LeftSideBoard = (props) =>
{
    return (
        <>
            <PanelHeader><T>{_.get(props, 'layerReport.reportName', 'Loading...')}</T> ({props.total})</PanelHeader>
            <LayerReport className='report-layer-dropdown' />
            <ReportListBoard {...props} />
        </>
    );
};

LeftSideBoard.propTypes = {
    total: PropTypes.number,
    loading: PropTypes.bool,
};

export default LeftSideBoard;
