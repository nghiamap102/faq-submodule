import './MasterBoard.scss';

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';

import { PanelBody } from '@vbd/vui';
import MasterCard from 'extends/ffms/pages/Dashboard/MasterBoard/MasterCard/MasterCard';
import { useQueryPara } from 'extends/ffms/pages/hooks/useQueryPara';

const MasterBoard = ({ fieldForceStore }) =>
{
    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const [activeIndex, setActiveIndex] = useState(dashboardStore.masterIndex);
    
    const history = useHistory();
    const param = useQueryPara();

    const onCardClick = (index) =>
    {
        setActiveIndex(index);
        dashboardStore.setCurrentDetail(index);
        param.set('master', `${index}`);
        history.push(`${history.location.pathname}?${param.toString()}`);
    };
    return (
        <PanelBody scroll>
            {
                _.map(_.without(_.cloneDeep(dashboardStore.layers), undefined), (item, index) =>
                    <MasterCard
                        key={index}
                        data={item}
                        active={index === activeIndex ? 'active' : ''}
                        onClick={() => onCardClick(index)}
                    />
                )
            }
        </PanelBody>
    );
};

MasterBoard.propTypes = {
    fieldForceStore: PropTypes.any
};


export default inject('fieldForceStore')(observer(MasterBoard));
