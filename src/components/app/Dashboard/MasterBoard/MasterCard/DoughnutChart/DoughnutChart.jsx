import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import RatioNumber from 'extends/ffms/pages/Dashboard/MasterBoard/MasterCard/RatioNumber';

const options = {
    cutoutPercentage: 85,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    plugins: {
        datalabels: {
            color: 'white',
            display: false,
        },
    },
};

const DoughnutChart = function ({ data, colors, titles, ratioNumber })
{
    const value = {
        labels: titles,
        datasets: [
            {
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
            },
        ],
    };

    return (
        <>
            <Doughnut
                className="dashboard-doughnut-chart"
                data={value}
                options={options}
            />
            {
                ratioNumber &&
                <RatioNumber
                    label={ratioNumber.label}
                    value={ratioNumber.value}
                    description={`${ratioNumber.value} ${ratioNumber.label}`}
                    isTooltip
                />
            }
        </>
    );
};

DoughnutChart.propTypes = {
    data: PropTypes.array,
    colors: PropTypes.array,
    titles: PropTypes.array,
    ratioNumber: PropTypes.any,
};

export default DoughnutChart;
