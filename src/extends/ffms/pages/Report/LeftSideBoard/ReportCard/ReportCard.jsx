import 'extends/ffms/pages/Report/Report.scss';
import './ReportCard.scss';

import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { Container, FlexPanel, T } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

const ReportCard = ({ data, onClick, active }) =>
{
    const { CreatedDate, Title } = data;
    
    return (
        <Container
            className={'report-card-item'}
            onClick={onClick}
        >
            <FlexPanel className={`bar report-card ${active}`}>
                <Container className="icon">
                    <FAIcon
                        type="duotone"
                        icon="file-excel"
                        className="ic-report-item"
                        size="1.8rem"
                        
                    />
                </Container>
                <Container className="row-bar">
                    <Container className="report-card-title">
                        <span title={Title}>{Title}</span>
                    </Container>
                    <Container className="report-card-datetime">
                        <T>Ngày tạo</T>:&nbsp;
                        <Moment format='DD/MM/YYYY'>
                            {CreatedDate}
                        </Moment>
                    </Container>
                </Container>
            </FlexPanel>
        </Container>
        
    );
};

ReportCard.propTypes = {
    data: PropTypes.object,
    onClick: PropTypes.func,
    active: PropTypes.string
};
export default ReportCard;
