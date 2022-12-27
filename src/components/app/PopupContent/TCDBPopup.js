import React, { Component } from 'react';

import { Field, Label, Info, ContainField } from '@vbd/vui';

export class TCDBContent extends Component
{
    getAddress(item)
    {
        return [item.Street, item.Ward, item.District, item.Province].filter(s => s && s !== '').join(', ');
    }

    render()
    {
        const address = this.getAddress(this.props);

        let color = '';

        if ((this.props.Status & 256) === 256)
        {
            color = '#07ff07';
        }
        else if ((this.props.Status & 16384) === 16384)
        {
            color = 'darkgray';
        }
        else if ((this.props.Status & 64) === 64)
        {
            color = 'yellow';
        }
        else if ((this.props.Status & 32) === 32)
        {
            color = '#ef7930';
        }
        else if ((this.props.Status & 16384) === 16384)
        {
            color = 'darkgray';
        }
        else if ((this.props.Status & 128) === 128)
        {
            color = 'red';
        }

        return (
            <ContainField>

                <Field>
                    <Label>Biển số</Label>
                    <Info>{this.props.PlateNumber}</Info>
                </Field>

                <Field>
                    <Label>Tốc độ</Label>
                    <Info color={color}>{this.props.Speed.toFixed(2)} km/h</Info>
                </Field>

                <Field>
                    <Label>Vị trí</Label>
                    <Info>{address}</Info>
                </Field>

                <Field>
                    <Label>Giờ thiết bị</Label>
                    <Info>{this.props.UTC7Time}</Info>
                </Field>

            </ContainField>
        );
    }
}
