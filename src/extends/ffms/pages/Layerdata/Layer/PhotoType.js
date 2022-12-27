import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
    Sub1, CheckBox, Input, FormControlLabel,
} from '@vbd/vui';

export class PhotoType extends Component
{
    state = {
        data: {},
    };

    componentDidMount()
    {
        const { data } = this.props;

        this.setState({
            data: { ...data } ?? {},
        });
    }

    handleValueChange = (key, value) =>
    {
        this.changeAttr(key, value);
    };

    changeAttr = (key, value) =>
    {
        const { data } = this.state;
        data[key] = value;
        this.setState({ data });
        if (typeof (this.props.onChange) === 'function')
        {
            this.props.onChange(data.phototype_id, key, value);
        }
    };

    render()
    {
        const { data } = this.state;
        return (
            <div className="photo-card">
                <FormControlLabel
                    label={'Photo Type Id'}
                    className={'sub-label'}
                    labelWidth={'100px'}
                    control={
                        <>
                            <Sub1>{data['phototype_id'] || ''}</Sub1>
                        </>
                    }
                />
                <FormControlLabel
                    label={'Photo Type Name'}
                    labelWidth={'100px'}
                    control={
                        <Input
                            name={'phototype_name'}
                            value={data['phototype_name'] || ''}
                            onChange={(value) =>
                                this.handleValueChange('phototype_name', value)
                            }
                        />
                    }
                />
                <FormControlLabel
                    label={'Enabled'}
                    labelWidth={'100px'}
                    control={
                        <CheckBox
                            checked={data['phototype_status'] ? true : false}
                            onChange={(value) =>
                                this.handleValueChange('phototype_status', value)
                            }
                        />
                    }
                />
            </div>
        );
    }
}

PhotoType.propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func,
};

PhotoType = inject('appStore', 'fieldForceStore')(observer(PhotoType));
PhotoType = withRouter(PhotoType);
export default PhotoType;
