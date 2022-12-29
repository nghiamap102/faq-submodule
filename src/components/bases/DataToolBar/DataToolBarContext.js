import React, { createContext, useEffect, useRef, useState } from 'react';
import { COMBINE_OPTIONS, ADVANCE_FILTER_FEATURE } from './constants';

export const DataToolBarContext = createContext();

const DataToolBarProvider = (props) =>
{
    const containerRef = useRef();
    const [visibleActive, setVisibleActive] = useState();

    const [feature, setFeature] = useState();
    const [dirty, setDirty] = useState({});

    const [valueSearch, setValueSearch] = useState();

    const [sortFields, setSortFields] = useState([]);
    const [isAutoSort, setAutoSort] = useState(false);

    const [filterFields, setFilterFields] = useState([]);
    const [isAutoFilter, setAutoFilter] = useState(false);

    const [fieldsShow, setFieldsShow] = useState([]);

    const [fields, setFields] = useState([]);
    const [primaryFields, setPrimaryFields] = useState(props?.primaryFields || []);
    const [defaultFields, setDefaultFields] = useState(props?.defaultFields || []);

    useEffect(() =>
    {
        setFields(props?.fields);
    }, [props?.fields]);

    useEffect(() =>
    {
        setFieldsShow(props?.fieldsShow);
    }, [props?.fieldsShow]);

    useEffect(() =>
    {
        setDirty({
            'search-feature': valueSearch,
            'data-sort': sortFields?.length,
            'data-filter': filterFields?.length,
            'column-toggle': fieldsShow.slice().sort().join(',') !== defaultFields.sort().join(',')
        });
    }, [valueSearch, sortFields, filterFields, fieldsShow]);

    return (
        <DataToolBarContext.Provider
            value={{
                ADVANCE_FILTER_FEATURE,
                COMBINE_OPTIONS,

                feature,
                setFeature,

                dirty,

                containerRef,
                visibleActive,
                setVisibleActive,

                valueSearch,
                setValueSearch,

                isAutoSort,
                setAutoSort,
                sortFields,
                setSortFields,

                isAutoFilter,
                setAutoFilter,
                filterFields,
                setFilterFields,

                fields,
                setFields,

                defaultFields,
                setDefaultFields,

                primaryFields,
                setPrimaryFields,

                fieldsShow,
                setFieldsShow
            }}
        >
            {props?.children}
        </DataToolBarContext.Provider>
    );
};

export default DataToolBarProvider;
