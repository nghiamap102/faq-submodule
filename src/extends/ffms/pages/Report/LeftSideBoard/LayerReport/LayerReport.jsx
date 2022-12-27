import './LayerReport.scss';

import React, { useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import Loading from 'extends/ffms/pages/base/Loading';
import { useQueryPara } from 'extends/ffms/pages/hooks/useQueryPara';
import PopupWrapper from 'extends/ffms/pages/base/Popup';
import SelectionItem from 'extends/ffms/pages/base/SelectionItem';

const LayerReport = ({ style, className, fieldForceStore }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const [list, setList] = useState([]);
    const [layerActive, setLayerActive] = useState(toJS(reportStore.layerReport));
    const [open, setOpen] = useState(false);
    const history = useHistory();
    const param = useQueryPara();
  
    useEffect(()=>
    {
        setList(toJS(reportStore.configList));
    }, [reportStore.configList]);

    useEffect(()=>
    {
        setLayer(toJS(reportStore.layerReport));
    }, [reportStore.layerReport]);

    const handleClick = (item)=>
    {
        setLayer(item);
        setOpen(false);
        reportStore.setLoading(true);
        reportStore.setLayerReport(item, true);
    };

    const setLayer = (item)=>
    {
        if (item)
        {
            setLayerActive(item);
            param.set('layer', item.layer.toLowerCase());
            param.delete('id');
            history.push(`${history.location.pathname}?${param.toString()}`);
        }
    };

    if (!list)
    {
        return <Loading/>;
    }

    return (
        <PopupWrapper
            trigger={
                <div
                    style={style}
                    className={className}
                >
                    <i className="fas fa-caret-down layer-report" />
                </div>}
            modal={false}
            width='15rem'
            placement='bottom-end'
            open={open}
            onClick={()=>setOpen(true)}
            
        >
            {
                _.map(list, item=>(
                    <SelectionItem
                        icon='list-alt'
                        key={item.layer}
                        text={item.displayName}
                        onClick={()=>handleClick(item)}
                        active={_.get(layerActive,'layer') === item.layer}
                    />
                ))
            }
        </PopupWrapper>
       
    );
};

LayerReport.propTypes = {
    className: PropTypes.string,
    style: PropTypes.any,
    fieldForceStore: PropTypes.any,
};

export default inject('fieldForceStore')(observer(LayerReport));
