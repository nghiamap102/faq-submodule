import './MasterCard.scss';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { FlexPanel, Container } from '@vbd/vui';

import DoughnutChart from 'components/app/Dashboard/MasterBoard/MasterCard/DoughnutChart/DoughnutChart';
import MiniDetail from 'components/app/Dashboard/MasterBoard/MasterCard/MiniDetail/MiniDetail';
import empty_chart from './images/analyze-chart-summary-empty.svg';

const MasterCard = ({ data, onClick, active }) =>
{
    const { master, colors, titles, detail, ratioNumber } = data;
    const isEmpty = _.size(_.compact(master)) === 0;

    return (
        <Container onClick={onClick}>
            <FlexPanel className={`master-card ${active}`}>
                <Container className="master-card-doughnut">
                    {
                        isEmpty
                            ? (
                                    <Container
                                        className="empty-chart"
                                        style={{ backgroundImage: `url(${empty_chart})` }}
                                    />
                                )
                            : (
                                    <DoughnutChart
                                        data={master}
                                        colors={colors}
                                        titles={titles}
                                        ratioNumber={ratioNumber}
                                    />
                                )
                    }
                </Container>

                <MiniDetail
                    data={detail}
                    isEmpty={isEmpty}
                />

            </FlexPanel>
        </Container>
    );
};
MasterCard.propTypes = {
    data: PropTypes.object,
    onClick: PropTypes.func,
    active: PropTypes.string,
};
export default MasterCard;
