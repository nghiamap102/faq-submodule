import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { DataToolBarContext } from './DataToolBarContext';
import DataToolBarControl from './DataToolBarControl';
import DataToolBarActive from './DataToolBarActive/DataToolBarActive';
import DataToolBarProvider from './DataToolBarContext';
import { PopOver } from 'components/bases/Modal/PopOver';

import { DATA_TYPE } from 'helper/data.helper';

const DataToolBarContainer = ({ onFeatureClick, ...props }) =>
{
    const { setFeature, containerRef, visibleActive, setVisibleActive } = useContext(DataToolBarContext);

    const onBlur = () =>
    {
        setVisibleActive(false);
        setFeature(null);
    };

    return (
        <div ref={containerRef}>
            <DataToolBarControl
                onSetVisiblePopup={setVisibleActive}
                onFeatureClick={onFeatureClick}
            />

            {
                visibleActive &&
                <PopOver
                    anchorEl={containerRef}
                    onBackgroundClick={onBlur}
                >
                    <DataToolBarActive {...props} />
                </PopOver>
            }
        </div>
    );
};

DataToolBarContainer.propTypes = {
    onFeatureClick: PropTypes.func,
};

export const DataToolBar = (props) =>
{
    return (
        <DataToolBarProvider {...props} >
            <DataToolBarContainer {...props} />
        </DataToolBarProvider>
    );
};

DataToolBar.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape({
        ColumnName: PropTypes.string,
        DisplayName: PropTypes.string,
        DataType: PropTypes.oneOf(Object.values(DATA_TYPE)),
    })),
    defaultFields: PropTypes.arrayOf(PropTypes.string), // Fields that are shown by default
    primaryFields: PropTypes.arrayOf(PropTypes.string), // Fields that can't be hidden
    fieldsShow: PropTypes.arrayOf(PropTypes.string), // Fields that are currently showing

    onFeatureClick: PropTypes.func,
    onSearch: PropTypes.func,
    onSort: PropTypes.func,
    onFilter: PropTypes.func,
    onColumnToggle: PropTypes.func,
};

