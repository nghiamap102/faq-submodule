import './BufferSizeControl.scss';

import React from 'react';
import { observer } from 'mobx-react';

import {
    Container, Row, Expanded,
    Input,
    T,
} from '@vbd/vui';

let BufferSizeControl = (props) =>
{
    const spatialSearchStore = props.store;

    const onRadiusChange = (value) =>
    {
        spatialSearchStore.setRadius(value);
    };

    return (
        spatialSearchStore.drawObj && spatialSearchStore.drawObj.geometry.type.toLowerCase() !== 'polygon' && (
            <Container className="buffer-size-control">
                <Row crossAxisAlignment="center">
                    <Container className="label">
                        <T params={['m']}>Bán kính (%0%):</T>
                    </Container>
                    <Expanded>
                        <Input
                            type={'number'}
                            value={spatialSearchStore.drawConfig.radius}
                            step={100}
                            min={0}
                            width="100%"
                            onChange={onRadiusChange}
                        />
                    </Expanded>
                </Row>
            </Container>
        )
    );
};

BufferSizeControl = observer(BufferSizeControl);
export { BufferSizeControl };
