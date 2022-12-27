import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation, useHistory } from 'react-router-dom';

import { T } from '@vbd/vui';

import { useQueryPara } from 'extends/ffms/pages/hooks/useQueryPara';

export const Tab = (props) =>
{
    const { title, onClick, index, flex, link, isParam, code, value } = props;
    const [active, setActive] = useState(props.active);

    const para = useQueryPara();
    const location = useLocation();
    const history = useHistory();

    let to = link;

    useEffect(() =>
    {
        setActive(props.active);
    }, [props.active]);

    if (isParam)
    {
        code && para.set(code, value);
        to = `${location.pathname}?${para.toString()}`;
    }

    const handleClick = (index) =>
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
            activeClassName={isParam ? '' : 'active'}
            to={to}
            exact
            onClick={() => handleClick(index)}
        >
            <T>{title}</T>
        </NavLink>
    );

};

Tab.propTypes = {
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
    flex: true,
    onClick: () =>
    {
    },
};
