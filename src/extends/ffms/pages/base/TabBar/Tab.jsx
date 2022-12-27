import './Tab.scss';
import React,{ useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation,useHistory } from 'react-router-dom';
import _ from 'lodash';

import { T } from '@vbd/vui';
import { useQueryPara } from 'extends/ffms/pages/hooks/useQueryPara';

const Tab = (props) =>
{
    const { title, onClick, index, flex, link, isParam, code, value } = props;
    const [active, setActive] = useState(props.active);
    const para = useQueryPara();
    const location = useLocation();
    const history = useHistory();
    let to = link;
        
    useEffect(()=>
    {
        setActive(props.active);
    },[props.active]);

    if (isParam)
    {
        code && para.set(code,value);
        to = `${location.pathname}?${para.toString()}`;
    }

    const handleClick = (index)=>
    {
        if (!active)
        {
            history.push(to);
            onClick(index);
        }
    };
    
    return (
        <NavLink
            className={`tab-item-header ${active === true ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
            onClick={() => handleClick(index)}
            activeClassName={isParam == false && to ? 'active' : ''}
            exact
            to={to ?? location.pathname}
        >
            <T>{title}</T>
        </NavLink>
        
    );

};

Tab.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    index: PropTypes.number,
    active: PropTypes.bool,
    flex: PropTypes.bool,
    onClick: PropTypes.func,
    link: PropTypes.string,
    isParam: PropTypes.bool,
    code: PropTypes.string,
    value: PropTypes.any,
};


Tab.defaultProps = {
    className: '',
    flex: true,
    onClick: () =>
    {},
};
export default Tab;
