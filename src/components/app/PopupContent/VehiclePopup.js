import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { InviteButton } from 'components/app/MapContextButton/InviteButton';

import { Field, Label, Info, ContainField, Button } from '@vbd/vui';

// import { SipStoreContext } from '../stores/SipStore';

export class VehicleContent extends Component
{
    handleCall = (phoneNumber) =>
    {
        // this.context.startCall(phoneNumber);
    };

    render()
    {
        // const nowTime = new Date();
        // const startTime = new Date(new Date().setDate(nowTime.getDate() - 3));

        switch (this.props.TransType)
        {
            case 1:
                // type = 'Xe cảnh sát';
                break;
            case 2:
                // type = 'Xe theo dõi';
                break;
            case 4:
                // type = 'Thiết bị di động';
                break;
            case 8:
                // type = 'Xe máy';
                break;
            case 16:
                // type = 'Body Camera';
                break;
            default:
        }

        let color = '';
        if ((this.props.Status & 256) === 256)
        {
            color = '#07ff07';
        }
        else if ((this.props.Status & 16384) === 16384)
        {
            color = 'darkgray';
        }
        else if ((this.props.Status & 64) === 64)
        {
            color = 'yellow';
        }

        return (
            <ContainField className={'vp'}>
                {
                    this.props.userData && this.props.userData.Username &&
                    <Field>
                        <Label>User</Label>
                        <Info>
                            {this.props.userData.Username}
                            <InviteButton userData={this.props.userData}/>
                        </Info>
                    </Field>
                }

                {
                    this.props.userData && this.props.userData.PhoneNumber &&
                    <Field>
                        <Label>Liên Lạc</Label>
                        <Info>
                            {this.props.userData.PhoneNumber}
                            <Button
                                text={'Gọi'}
                                onClick={() => this.handleCall(this.props.userData.PhoneNumber)}
                            />
                        </Info>
                    </Field>
                }


                <Field>
                    <Label>Quản lý</Label>
                    <Info>{this.props.Administrator || 'Chưa xác định'}</Info>
                </Field>

                <Field>
                    <Label>Tốc độ</Label>
                    <Info color={color}>{this.props.Speed.toFixed(2)} km/h</Info>
                </Field>

                <Field>
                    <Label>Vị trí</Label>
                    <Info>{this.props.Address} </Info>
                </Field>

                <Field>
                    <Label>Giờ cập nhật</Label>
                    <Info>{this.props.LastReceived}</Info>
                </Field>

                <Field>
                    <Label>Tổ công tác</Label>
                    <Info>{this.props.Team}</Info>
                </Field>
            </ContainField>
        );
    }
}

// VehicleContent.contextType = SipStoreContext;

VehicleContent.propTypes = {
    Id: PropTypes.string,
    Administrator: PropTypes.string,
    Provider: PropTypes.string,
    Business: PropTypes.string,
    PlateNumber: PropTypes.string,
    Address: PropTypes.string,
    Speed: PropTypes.number,
    LastReceived: PropTypes.string,
    UTC7Time: PropTypes.string,
    Team: PropTypes.string,
    TransType: PropTypes.number,
    Status: PropTypes.number
};

VehicleContent.defaultProps = {
    Id: '',
    Administrator: '',
    Provider: '',
    Business: '',
    PlateNumber: '',
    Address: '',
    Speed: '',
    LastReceived: '',
    UTC7Time: '',
    Team: '',
    TransType: 0,
    Status: 0
};
