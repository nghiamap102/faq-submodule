import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { DataSortPanel } from './DataSortPanel';
import { DataSearchPanel } from './DataSearchPanel';
import { DataFilterPanel } from './DataFilterPanel';
import { ColumnTogglePanel } from './ColumnTogglePanel';

import { DataToolBarContext } from '../DataToolBarContext';

const DataToolBarActive = (props) =>
{
    const { feature } = useContext(DataToolBarContext);

    if (!feature)
    {
        return null;
    }

    let panel;

    switch (feature.id)
    {
        case 'search-feature':
            panel = <DataSearchPanel onSearch={props.onSearch} />;
            break;
        case 'data-sort':
            panel = <DataSortPanel onSort={props.onSort} />;
            break;
        case 'data-filter':
            panel = <DataFilterPanel onFilter={props.onFilter} />;
            break;
        case 'column-toggle':
            panel = (
                <ColumnTogglePanel onColumnToggle={props.onColumnToggle} />
            );
            break;
        default:
            panel = null;
    }

    return panel;
};

export default DataToolBarActive;

DataToolBarActive.propTypes = {
    onSearch: PropTypes.func,
    onSort: PropTypes.func,
    onFilter: PropTypes.func,
    onColumnToggle: PropTypes.func,
};

