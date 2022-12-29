import './DataToolBarControl.scss';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Container } from 'components/bases/Container/Container';
import { EmptyButton } from 'components/bases/Button/Button';
import { DataToolBarContext } from './DataToolBarContext';

const DataToolBarControl = (props) =>
{
    const { ADVANCE_FILTER_FEATURE, feature, setFeature, dirty } = useContext(DataToolBarContext);

    const handleFeatureClick = (item) =>
    {
        setFeature(item);

        props.onFeatureClick && props.onFeatureClick(item.id);
        props.onSetVisiblePopup(true);
    };

    return (
        <Container className={'afc-feature-container'}>
            {
                ADVANCE_FILTER_FEATURE.map((item) => (
                    <EmptyButton
                        key={item.id}
                        icon={item.icon}
                        tooltip={item.tooltip}
                        color={dirty[item.id] ? 'primary' : 'default'}
                        iconSize="sm"
                        backgroundColor={item.id === feature?.id ? 'var(--contrast-highlight)' : ''}
                        onlyIcon
                        onClick={() => handleFeatureClick(item)}
                    />
                ),
                )
            }
        </Container>
    );
};

DataToolBarControl.propTypes = {
    onFeatureClick: PropTypes.func,
    onSetVisiblePopup: PropTypes.func,
};

DataToolBarControl.defaultProps = {};

export default DataToolBarControl;
