import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import {
    Field, Info, Label,
    FSDataBody, FSDataContainer, FSDataContent,
    Button,
    Container,
} from '@vbd/vui';

import FSHistory from 'components/app/FSImageDeatail/FSHistory';

import { FaceAlertService } from 'services/face-alert.service';

class FSQuickInfo extends Component
{
    faceAlertSvc = new FaceAlertService();

    state = {
        showHistory: false,
    };

    handleShowHistory = () =>
    {

        this.setState({ showHistory: true });
    };

    handleHideHistory = () =>
    {
        this.setState({ showHistory: false });
    };

    render()
    {
        const { data, probe } = this.props;
        return (
            <FSDataContainer className={'fs-quickInfo'}>
                <FSDataBody layout={'flex'}>
                    <FSDataContent>
                        <Field>
                            <Label>Tên đầy đủ</Label>
                            <Info>{data.name}</Info>
                        </Field>
                        <Field>
                            <Label>Ngày sinh</Label>
                            {data.dateOfBirth && <Info><Moment format={'L'}>{data.dateOfBirth}</Moment></Info>}
                        </Field>
                    </FSDataContent>

                    <FSDataContent>
                        <Field>
                            <Label>Tỉnh/Thành phố</Label>
                            <Info>{data.province}</Info>
                        </Field>
                        <Field>
                            <Label>ID</Label>
                            <Info>{data.personId}</Info>
                        </Field>
                    </FSDataContent>

                    {
                        data.faceId && (
                            <Container>
                                <Button
                                    color={'primary'}
                                    text={'Lịch sử'}
                                    onClick={this.handleShowHistory}
                                />
                            </Container>
                        )
                    }

                    {
                        probe &&
                        (
                            <FSDataContent>
                                <Field>
                                    <Label>Xác thực</Label>
                                    <Info />
                                </Field>
                            </FSDataContent>
                        )
                    }
                </FSDataBody>

                {
                    this.state.showHistory && (
                        <FSHistory
                            gallery={data}
                            onHide={this.handleHideHistory}
                        />
                    )}
            </FSDataContainer>
        );
    }
}

FSQuickInfo.propTypes = {
    data: PropTypes.object.isRequired,
    probe: PropTypes.object,
};

export default FSQuickInfo;
