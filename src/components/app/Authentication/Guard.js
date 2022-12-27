import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

function Guard(props)
{
    const profile = props.appStore.profile;

    if (!props.products)
    {
        return props.children;
    }

    for (const productName of Object.keys(props.products))
    {
        if (profile.products[productName] >= props.products[productName])
        {
            return props.children;
        }
    }

    return null;
}

Guard.propTypes = {
    products: PropTypes.any
};

export default inject('appStore')(observer(Guard));
