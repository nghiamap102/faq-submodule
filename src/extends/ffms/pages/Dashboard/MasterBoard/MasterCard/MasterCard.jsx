import './MasterCard.scss';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { FlexPanel } from '@vbd/vui';
import { Container } from '@vbd/vui';

import DoughnutChart from 'extends/ffms/pages/Dashboard/MasterBoard/MasterCard/DoughnutChart/DoughnutChart';
import MiniDetail from 'extends/ffms/pages/Dashboard/MasterBoard/MasterCard/MiniDetail/MiniDetail';
import empty_chart from './images/analyze-chart-summary-empty.svg';

const MasterCard = ({ data, onClick, active }) =>
{
    const { master, colors, titles, detail, ratioNumber } = data;
    const isEmpty = _.size(_.compact(master)) == 0;
    return (
        <div onClick={onClick}>
            <FlexPanel className={`master-card ${active}`}>
                <div className="doughnut">
                    {
                        isEmpty ?
                            <Container
                                className='empty-chart'
                                style={{ backgroundImage: `url(${empty_chart})` }}
                            /> :
                            <DoughnutChart
                                data={master}
                                colors={colors}
                                titles={titles}
                                ratioNumber={ratioNumber}
                            />
                    }
                </div>

                <div className="detail">
                    <MiniDetail
                        data={detail}
                        isEmpty={isEmpty}
                    />
                </div>

            </FlexPanel>
        </div>
    );
};
MasterCard.propTypes = {
    data: PropTypes.object,
    onClick: PropTypes.func,
    active: PropTypes.string
};
export default MasterCard;
