import './EmployeeInfoPopup.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Popup } from '@vbd/vui';

import EmployeeInfo from 'extends/ffms/views/EmployeeInfoPopup/EmployeeInfo';

export class EmployeeInfoPopup extends Component
{
    constructor(props)
    {
        super(props);
    }
    handleCloseModal = () =>
    {
        this.props.onToggle();
    }

    render()
    {
        return (
            <>
                {
                    this.props.isActive &&
                    <Popup
                        isShow
                        title={'Employee'}
                        onClose={this.handleCloseModal}
                        width={'1200px'}
                        height={'80%'}
                    >
                        <EmployeeInfo
                            data={this.props.data}
                        />
                    </Popup>
                }
            </>
        );
    }
}
EmployeeInfoPopup.propTypes = {
    onCancel: PropTypes.func,
    onToggle: PropTypes.func,
    isActive: PropTypes.bool,
};
EmployeeInfoPopup.defaultProps = {
    queryData: {},
};
