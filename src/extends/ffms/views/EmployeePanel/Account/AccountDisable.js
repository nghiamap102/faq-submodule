import './AccountDisable.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Container, TB1,
    withI18n, Column,Button, withModal,
} from '@vbd/vui';

import AvatarInfo from 'extends/ffms/views/AvatarInfo/AvatarInfo';

class AccountDisable extends Component
{
    empStore = this.props.fieldForceStore.empStore;
    comSvc = this.props.fieldForceStore.comSvc;

    state={
        isLoading: false,
    }

    setAccountDisable = async () =>
    {
        this.setState({ isLoading: true });
        await this.empStore.setDisable(this.empStore.currentEmp).then(() =>
        {
            this.setState({ isLoading: false });
            this.empStore.setUnassignDone(false);
        });
    }

    render()
    {
        return (
            <Container className={'disable-emp'}>
                <Column
                    crossAxisAlignment={'center'}
                    style={{ marginTop: 'auto' }}
                >
                    <TB1>Bạn muốn khóa nhân viên này ngay bây giờ?</TB1>
                    <AvatarInfo data={this.empStore.currentEmp} />
                    <Button
                        text={'Khóa'}
                        color={'danger'}
                        className={'step-block-account-btn'}
                        isLoading={this.state.isLoading}
                        onClick={this.setAccountDisable}
                    />
                </Column>
            </Container>
        );
    }
}

AccountDisable.propTypes = {
    data: PropTypes.object, // array of jobs
};

AccountDisable = withModal(withI18n(inject('appStore', 'fieldForceStore')(observer(AccountDisable))));
export default AccountDisable;
