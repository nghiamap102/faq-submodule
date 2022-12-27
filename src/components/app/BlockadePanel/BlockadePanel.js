import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Container, Row,
    FormGroup, FormControlLabel,
    InputGroup, CheckBox, InputAppend, Input,
} from '@vbd/vui';

class BlockadePanel extends Component
{
    blockadeStore = this.props.appStore.blockadeStore;

    componentDidMount()
    {
        const { selectedBlockade } = this.blockadeStore;
        this.blockadeStore.getFlagpoles(selectedBlockade);
    }

    onRadiusChange = (radius) =>
    {
        const { selectedBlockade } = this.blockadeStore;

        this.blockadeStore.updateBlockade('radius', radius);
        this.blockadeStore.getFlagpoles(selectedBlockade);
    };

    onCkbDurationChange = () =>
    {
        this.blockadeStore.updateBlockade('criteria', 0);
    };

    onCkbDistanceChange = () =>
    {
        this.blockadeStore.updateBlockade('criteria', 1);
    };

    onCkbWayChange = () =>
    {
        this.blockadeStore.updateBlockade('euclid', 0);
    };

    onCkbSkyWayChange = () =>
    {
        this.blockadeStore.updateBlockade('euclid', 1);
    };

    render()
    {
        const selectedBlockade = this.blockadeStore.selectedBlockade;
        const { readOnly } = this.props;

        if (!selectedBlockade)
        {
            return <></>;
        }

        return (
            <Container className="blockade-detail-panel-builder">
                <FormGroup>
                    <FormControlLabel
                        label={'Bán kính'}
                        control={(
                            <InputGroup>
                                <Input
                                    disabled={readOnly}
                                    type="number"
                                    step={10}
                                    placeholder={'Nhập bán kính'}
                                    value={String(selectedBlockade.radius)}
                                    onChange={this.onRadiusChange}
                                />
                                <InputAppend>m</InputAppend>
                            </InputGroup>
                        )}
                    />

                    <Row>
                        <CheckBox
                            disabled={readOnly}
                            label="Đường chim bay"
                            checked={selectedBlockade.euclid === 1}
                            onChange={this.onCkbSkyWayChange}
                        />
                        <CheckBox
                            disabled={readOnly}
                            label="Đường đi"
                            checked={selectedBlockade.euclid === 0}
                            onChange={this.onCkbWayChange}
                        />
                    </Row>
                </FormGroup>
            </Container>
        );
    }
}

BlockadePanel.propTypes = {
    readOnly: PropTypes.bool,
};

BlockadePanel.defaultProps = {
    readOnly: false,
};

BlockadePanel = inject('appStore')(observer(BlockadePanel));
export { BlockadePanel };
