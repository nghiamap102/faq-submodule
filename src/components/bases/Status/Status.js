import './Status.scss';

import React from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';

export const Status = (props) =>
{
    return (
        <div className={'status-control'}>
            <FAIcon
                icon={'circle'} type={'solid'} size={'12px'}
                color={props.color}
            />
            <h4><T>{props.text}</T></h4>
        </div>
    );
};

Status.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
};

Status.defaultProps = {
    color: 'green',
    text: 'status',
};
