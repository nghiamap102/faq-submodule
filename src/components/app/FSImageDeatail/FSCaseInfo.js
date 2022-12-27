import './FSimageDetail.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Field, Info, Label,
    FSDataBody,
    FSDataContainer,
    FSDataContent,
    VerticalLine,
    SectionHeader,
} from '@vbd/vui';

class FSCaseInfo extends Component
{
    render()
    {
        let { data } = this.props;
        data = data || {};
        return (
            <FSDataContainer className={'fs-case-container'}>
                <SectionHeader>Thông tin lưu ý</SectionHeader>

                <FSDataBody layout={'flex'}>
                    <FSDataContent>
                        <Field>
                            <Label>Tên</Label>
                            <Info>{data.name}</Info>
                        </Field>
                        <Field>
                            <Label>Nơi làm việc</Label>
                            <Info>{data.agency}</Info>
                        </Field>
                        <Field>
                            <Label>Case #</Label>
                            <Info>{data.case}</Info>
                        </Field>
                    </FSDataContent>

                    <VerticalLine />

                    <FSDataContent>
                        <Field>
                            <Label>Tiền án/Tiền sử</Label>
                            <Info>{data.cremeOrIncident}</Info>
                        </Field>
                        <Field>
                            <Label>Liên lạc #</Label>
                            <Info>{data.contact}</Info>
                        </Field>
                        <Field>
                            <Label>Email</Label>
                            <Info>{data.email}</Info>
                        </Field>
                    </FSDataContent>
                </FSDataBody>
            </FSDataContainer>
        );
    }
}

FSCaseInfo.propTypes = {
    data: PropTypes.object,
};

export default FSCaseInfo;
