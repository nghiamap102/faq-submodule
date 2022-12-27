import './LockDrawToolButton.scss';

import React from 'react';
import { observer } from 'mobx-react';

import { FAIcon, Container } from '@vbd/vui';

let LockDrawToolButton = (props) =>
{
    const spatialSearchStore = props.store;

    const handleClick = () =>
    {
        spatialSearchStore.lockDrawTool(!spatialSearchStore.isLockedDrawTool);
    };

    return (
        <>
            {
                spatialSearchStore.drawObj && (
                    <Container className="lock-draw-tool-button-container">
                        <FAIcon
                            icon={spatialSearchStore.isLockedDrawTool ? 'lock' : 'unlock'}
                            size={'1rem'}
                            color={'rgb(0, 0, 0)'}
                            onClick={handleClick}
                        />
                    </Container>
                )}
        </>
    );
};

LockDrawToolButton = (observer(LockDrawToolButton));
export { LockDrawToolButton };
