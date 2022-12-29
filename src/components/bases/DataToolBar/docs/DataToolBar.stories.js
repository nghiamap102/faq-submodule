import React, { useState, useEffect } from 'react';

import { DataToolBar } from 'components/bases/DataToolBar/DataToolBar';

const DEFAULT_FIELDS = ['id', 'title', 'address', 'created_on', 'category', 'priority'];
const PRIMARY_FIELDS = ['id', 'title', 'address', 'priority'];
const FIELDS = [{
    'ColumnName': 'id',
    'DisplayName': 'id',
}, {
    'ColumnName': 'title',
    'DisplayName': 'Title',
}, {
    'ColumnName': 'address',
    'DisplayName': 'Address',
}, {
    'ColumnName': 'created_on',
    'DisplayName': 'Created on',
}, {
    'ColumnName': 'category',
    'DisplayName': 'Category',
}, {
    'ColumnName': 'priority',
    'DisplayName': 'Priority',
}];

export default {
    title: 'Display/DataToolBar',
    component: DataToolBar,
    argTypes: {},
    args: {
        fields: FIELDS,
        defaultFields: DEFAULT_FIELDS,
        primaryFields: PRIMARY_FIELDS,
        fieldsShow: DEFAULT_FIELDS,
    },
};


const Template = (args) =>
{
    const [fieldsShow, setFieldsShow] = useState(args.fieldsShow);
    const [defaultFields, setDefaultFields] = useState(args.defaultFields);
    const [primaryFields, setPrimaryFields] = useState(args.primaryFields);
    const [fields, setFields] = useState(args.fields);

    useEffect(function ()
    {
        setFieldsShow(args.fieldsShow);
    }, args.fieldsShow);

    useEffect(function ()
    {
        setDefaultFields(args.defaultFields);
    }, args.defaultFields);

    useEffect(function ()
    {
        setPrimaryFields(args.primaryFields);
    }, args.primaryFields);

    useEffect(function ()
    {
        setFields(args.fields);
    }, args.fields);

    return (
        <DataToolBar
            {...args}
            fieldsShow={fieldsShow}
        />
    );
};

export const Default = Template.bind({});
