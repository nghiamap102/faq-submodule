import './DataList.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Expanded, Row, TB1 } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

const DataItem = ({ data, iconLoading, onDelete, hideDelete, renderLabel }) =>
{
    return (
        <Row
            mainAxisAlignment={'space-between'}
            crossAxisAlignment={'center'}
            itemMargin={'md'}
            className={'account-list-item'}
            crossAxisSize={'min'}
        >
            {renderLabel && <TB1>{renderLabel(data)}</TB1>}
            <Expanded/>
            {
                !hideDelete &&
                <FAIcon
                    icon={iconLoading ? 'spinner' : 'trash-alt'}
                    spin={iconLoading}
                    size={'14px'}
                    className={'trash-icon'}
                    onClick={() => onDelete(data)}
                />
            }
        </Row>
    );
};

DataItem.propTypes = {
    data: PropTypes.array,
    onDelete: PropTypes.func,
    hideDelete: PropTypes.bool,
    renderLabel: PropTypes.func,
    iconLoading: PropTypes.bool,
};

DataItem.defaultProps = {
    iconLoading: false,
};

export default DataItem;
