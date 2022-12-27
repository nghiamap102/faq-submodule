import unknownLocImage from 'images/no_street_view.png';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Image, Field, Info, ContainField } from '@vbd/vui';

class SimplePopupContent extends Component
{
    render()
    {
        return (
            <ContainField>
                <Field>
                    <Info>{this.props.address}</Info>
                </Field>
                {this.props.id && (
                    <Field>
                        <Info>
                            <Image
                                width="330px"
                                canEnlarge={false}
                                src={unknownLocImage}
                            />
                        </Info>
                    </Field>
                )}
            </ContainField>
        );
    }
}

SimplePopupContent = inject('appStore')(observer(SimplePopupContent));
export { SimplePopupContent };
