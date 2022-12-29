import './QueryBuilderRule.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Input } from '../Input';
import { Button } from '../Button/Button';
import { AdvanceSelect } from 'components/bases/AdvanceSelect/AdvanceSelect';
import { FormControlLabel, FormGroup } from 'components/bases/Form';

class QueryBuilderRule extends Component
{
    state = {
        property: '',
        operator: null,
        value: '',
        props: this.props.props,
        operators: [],
    };

    handlePropertyChanged = (property) =>
    {
        this.setState({ property, operators: this.getOperators(property) });
    };

    handleOperatorChanged = (operator) =>
    {
        this.setState({ operator });
    };

    handleValueChange = (value) =>
    {
        this.setState({ value });
    };

    fillRuleStatus(data, props)
    {
        this.setState({
            props: props,
            property: data.property,
            operator: data.operator,
            value: data.value,
            operators: this.getOperators(data.property),
        });
    }

    queryFormStatus = () =>
    {
        return {
            property: this.state.property,
            operator: this.state.operator,
            value: this.state.value,
        };
    };

    getOperators = (property) =>
    {
        const propSelected = this.props.props.find((x) => x.ColumnName === property);

        if (propSelected)
        {
            if (propSelected.DataType === 1 || propSelected.DataType === 2 || propSelected.DataType === 4)
            {
                return [
                    { id: 2, label: '=' },
                    { id: 3, label: '>' },
                    { id: 4, label: '<' },
                    { id: 5, label: '>=' },
                    { id: 6, label: '<=' },
                ];
            }
            else if (propSelected.DataType === 3 || propSelected.DataType === 6 || propSelected.DataType === 8)
            {
                return [
                    { id: 0, label: 'Bằng' },
                    { id: 1, label: 'Giống' },
                ];
            }
        }

        return [];
    };

    render()
    {
        return (
            <FormGroup
                className={'qr-rule'}
                direction={'row'}
            >
                <FormControlLabel
                    control={(
                        <AdvanceSelect
                            width="200px"
                            value={this.state.property}
                            options={this.props.props.map((item) =>
                            {
                                return { id: item.ColumnName, label: item.DisplayName };
                            })}
                            placeholder={'Chọn thuộc tính'}
                            onChange={(event) => this.handlePropertyChanged(event)}
                        />
                    )}
                />

                <FormControlLabel
                    control={(
                        <AdvanceSelect
                            width="200px"
                            value={this.state.operator}
                            options={this.state.operators}
                            placeholder={'Chọn toán tử'}
                            onChange={(event) => this.handleOperatorChanged(event)}
                        />
                    )}
                />

                <FormControlLabel
                    className={'qr-rule-value'}
                    control={(
                        <Input
                            placeholder={'Giá trị'}
                            autoComplete="off"
                            spellCheck="false"
                            value={this.state.value}
                            onChange={this.handleValueChange}
                        />
                    )}
                />

                <div className={'qr-rule-actions'}>
                    <Button
                        color={'danger'}
                        icon={'trash-alt'}
                        text={'Xóa'}
                        onClick={this.props.deleteRule}
                    />
                </div>
            </FormGroup>
        );
    }
}

QueryBuilderRule.propTypes = {
    ruleID: PropTypes.string,
    options: PropTypes.object,
    onClick: PropTypes.func,
    deleteRule: PropTypes.func,
};

QueryBuilderRule.defaultProps = {
    ruleID: '',
    onClick: () =>
    {
    },
    deleteRule: () =>
    {
    },
    options: {},
};

export { QueryBuilderRule };
