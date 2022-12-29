import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Popup, PopupFooter } from 'components/bases/Popup/Popup';
import { TreeSelect } from 'components/bases/Tree/TreeSelect';
import { Button } from 'components/bases/Button/Button';

export class TreeSelectPopup extends Component
{
    handleTreeChecked = (nodeSelected) =>
    {
        this.nodeSelected = nodeSelected;
    };

    handleSave = () =>
    {
        const { onSave, onClose } = this.props;

        onSave && onSave(this.nodeSelected);
        onClose && onClose();
    };

    render()
    {
        const { data, nodeSelected, expandAll, onClose, ...rest } = this.props;

        if (!data || data.length === 0)
        {
            return null;
        }

        return (
            <Popup
                width={'500px'}
                onClose={onClose}
                {...rest}
            >
                <TreeSelect
                    height={'500px'}
                    data={data}
                    expandAll={expandAll}
                    nodeSelected={nodeSelected}
                    onChecked={this.handleTreeChecked}
                />

                <PopupFooter>
                    <Button
                        className="tsp-btn-save"
                        color="primary"
                        text="Lưu"
                        onClick={this.handleSave}
                    />
                </PopupFooter>

            </Popup>
        );
    }
}

TreeSelectPopup.propTypes = {
    data: PropTypes.array,
    expandAll: PropTypes.bool,
    onSave: PropTypes.func,
    onClose: PropTypes.func,
    nodeSelected: PropTypes.array,
};

TreeSelectPopup.defaultProps = {
    data: [],
    expandAll: false,
};
