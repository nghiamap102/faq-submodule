import './QueryBuilderGroup.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { QueryBuilderRule } from 'components/bases/QueryBuilder/QueryBuilderRule';
import { Button } from '../Button/Button';
import { CheckBox } from '../CheckBox';
// import LayerService from 'services/layer.service';
import { CommonHelper } from 'helper/common.helper';
import { Radio } from 'components/bases/Radio/Radio';

class QueryBuilderGroup extends Component
{
    // layerSvc = new LayerService();
    ruleRefs = [];
    groupRefs = [];

    state = {
        no: false,
        condition: 'AND',
        groups: [],
        rules: [],
        queryDataChild: {},
    };

    componentDidMount()
    {
        this.fillFormStatus(this.props.queryData);
    }

    clickCondition = (value) =>
    {
        this.setState({ condition: value });
    };

    clickNo = () =>
    {
        this.setState({ no: !this.state.no });
    };

    addRule = () =>
    {
        const id = { idRandom: CommonHelper.uuid() };
        const rulesTemp = [...this.state.rules, id];
        this.setState({ rules: rulesTemp });
    };

    addGroup = () =>
    {
        const id = { idRandom: CommonHelper.uuid() };
        const groupsTemp = [...this.state.groups, id];
        this.setState({ groups: groupsTemp });
    };

    deleteSelf = () =>
    {
        this.props.deleteGroup();
    };

    deleteRule = (idRandom) =>
    {
        this.ruleRefs = this.ruleRefs.filter((x) => x !== null);
        this.ruleRefs = this.ruleRefs.filter((x) => x.props.ruleID !== idRandom);

        this.setState({ rules: this.state.rules.filter((x) => x.idRandom !== idRandom) });
    };

    deleteGroup = (idRandom) =>
    {
        this.groupRefs = this.groupRefs.filter((x) => x !== null);
        this.groupRefs = this.groupRefs.filter((x) => x.props.idGroup !== idRandom);

        this.setState({ groups: this.state.groups.filter((x) => x.idRandom !== idRandom) });
    };

    setRuleRef = (ref) =>
    {
        this.ruleRefs.push(ref);
    };

    setGroupRef = (ref) =>
    {
        this.groupRefs.push(ref);
    };

    fillFormStatus = (data) =>
    {
        if (data.condition && data.layer)
        {
            this.setState({ no: data.no, condition: data.condition });

            const rs = this.layerSvc?.getLayerProps(data.layer);
            let props = [];

            if (rs.data)
            {
                props = rs.data.Properties;
            }

            for (let i = 0; i < data.rules.length; i++)
            {
                if (data.rules[i].condition)
                {
                    process.nextTick(() =>
                    {
                        this.setState({ groups: [...this.state.groups, data.rules[i]], queryDataChild: data.rules[i] });
                    });
                }
                else
                {
                    process.nextTick(() =>
                    {
                        this.setState({ rules: [...this.state.rules, data.rules[i]] });

                        const refRule = this.ruleRefs[this.ruleRefs.length - 1];
                        refRule.fillRuleStatus(data.rules[i], props);
                    });
                }
            }
        }
    };

    queryFormStatus = () =>
    {
        this.ruleRefs = this.ruleRefs.filter((x) => x !== null);
        this.groupRefs = this.groupRefs.filter((x) => x !== null);

        const query = {};
        const rules = this.ruleRefs || {};
        const groups = this.groupRefs || {};
        let i, j;

        query['no'] = this.state.no;
        query['condition'] = this.state.condition;
        query['rules'] = [];
        query['layer'] = this.props.layer;

        for (i = 0; i < rules.length; i++)
        {
            query.rules.push(rules[i].queryFormStatus());
        }

        for (j = 0; j < groups.length; j++)
        {
            query.rules[query.rules.length] = groups[j].queryFormStatus();
        }

        return query;
    };

    render()
    {
        const rulesJsx = this.state.rules.map((c, index) => (
            <QueryBuilderRule
                key={index}
                ref={this.setRuleRef}
                ruleID={c.idRandom}
                options={this.props.options}
                props={this.props.props}
                deleteRule={() => this.deleteRule(c.idRandom)}
            />
        ));

        const groupsJsx = this.state.groups.map((c) => (
            <div
                key={c.idRandom}
                className={'qr-rule'}
            >
                <QueryBuilderGroup
                    ref={this.setGroupRef}
                    queryData={this.state.queryDataChild}
                    idGroup={c.idRandom}
                    options={this.props.options}
                    layer={this.props.layer}
                    props={this.props.props}
                    isFirst={false}
                    deleteGroup={() => this.deleteGroup(c.idRandom)}
                />
            </div>
        ));

        return (
            <div className={`qr-group ${this.props.isFirst ? 'qr-group-root' : ''}`}>
                <div className={'qr-group-header'}>
                    <div className={'qr-group-operator'}>
                        <CheckBox
                            label="Không"
                            checked={this.state.no}
                            onChange={this.clickNo}
                        />
                        <Radio
                            label="Và"
                            checked={this.state.condition === 'AND'}
                            onChange={() => this.clickCondition('AND')}
                        />
                        <Radio
                            label="Hoặc"
                            checked={this.state.condition === 'OR'}
                            onChange={() => this.clickCondition('OR')}
                        />
                    </div>

                    <div className={'qr-group-expander'} />

                    <div className={'qr-group-actions'}>
                        <Button
                            icon={'plus'}
                            text={'Thêm điều kiện'}
                            onClick={this.addRule}
                        />
                        <Button
                            icon={'plus'}
                            text={'Thêm nhóm'}
                            onClick={this.addGroup}
                        />
                        {
                            !this.props.isFirst && (
                                <Button
                                    icon={'trash-alt'}
                                    text={'Xóa'}
                                    onClick={this.deleteSelf}
                                />
                            )}
                    </div>
                </div>

                {rulesJsx}

                {groupsJsx}
            </div>
        );
    }
}

QueryBuilderGroup.propTypes = {
    layerData: PropTypes.array,
    idGroup: PropTypes.string,
    queryData: PropTypes.object,
    isFirst: PropTypes.bool,
    deleteGroup: PropTypes.func,
    deleteRule: PropTypes.func,
    /**
     * Array of property objects. Property object format: { ColumnName: "", DisplayName: ""}
     */
    props: PropTypes.array.isRequired,
};

QueryBuilderGroup.defaultProps = {
    layerData: [],
    idGroup: '',
    isFirst: true,
    deleteGroup: () =>
    {
    },
    deleteRule: () =>
    {
    },
};
export { QueryBuilderGroup };
