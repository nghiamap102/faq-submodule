import React, { createContext, useEffect, useReducer, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';

import { MarkerPopupStore } from 'components/app/stores/MarkerPopupStore';
import { SpatialSearchStore } from 'components/app/SpatialSearch/SpatialSearchStore';

import { LayerHelper } from 'services/utilities/layerHelper';
import LayerService from 'services/layer.service';
import { CaseService } from 'services/case.service';

import { AppConstant } from 'constant/app-constant';

import { CasePopupContent } from './CasePopupContent';

export enum CaseFormMode
{
    NEW = 'NEW',
    EDIT = 'EDIT'
}
const initState = {
    cases: [],
    selectedCaseIds: [],
    selectedCase: null,
    loading: false,
    total: null,
    caseProps: {},
    suspectProps: {},
    allSelectionFieldOptions: null,
    userOU: null,

    columns: [],
    searchKey: '',
    pageIndex: 1,
    pageSize: 50,
    conds: [],
    sortInfo: [{ Field: 'ModifiedDate', Direction: 1 }],
    filterInfo: null,
    filterQuery: [],
    spatialSearch: false,
    geoJson: null,
    distance: null,
    caseForm: {
        open: false,
        mode: CaseFormMode.NEW,
        data: null,
        activityId: null,
    },
};


const CaseContext = createContext({});

const reducer = function (state: any, newState: any)
{
    return ({ ...state, ...newState });
};

type CaseStateProviderProps = {
    appStore?: any
}

// helper
const generateUID = () =>
{
    let firstPart = ((Math.random() * 46656) | 0).toString(36);
    let secondPart = ((Math.random() * 46656) | 0).toString(36);
    firstPart = ('000' + firstPart).slice(-3);
    secondPart = ('000' + secondPart).slice(-3);
    return (firstPart + secondPart).toUpperCase();
};


let CaseProvider: React.FunctionComponent<CaseStateProviderProps> = ({ children, appStore }) =>
{
    const [caseState, setCaseState] = useReducer(reducer, initState);
    const layerService = useRef(new LayerService(AppConstant.c4i2.url)).current;
    const caseService = useRef(new CaseService()).current;
    const spatialSearchStore = useRef(new SpatialSearchStore()).current;
    const markerPopupStore = useRef(new MarkerPopupStore()).current;
    const {
        caseProps,
        pageIndex,
        pageSize,
        searchKey,
        sortInfo,
        filterInfo,
        filterQuery,
        spatialSearch,
    } = caseState;

    const genVictimId = () =>
    {
        return 'NN_' + generateUID();
    };
    const genSuspectId = () =>
    {
        return 'DT_' + generateUID();
    };

    spatialSearchStore.popupContent = useRef(<CasePopupContent />).current;

    const parseCaseData = (data: any, layerProps: any) =>
    {
        return data.map((d: any) =>
        {
            Object.keys(d).forEach(key =>
            {
                if (d[key] === '0001-01-01T00:00:00')
                {
                    d[key] = null;
                }
                else if (typeof d[key] === 'string' && d[key].startsWith('[') && d[key].endsWith(']'))
                {
                    const val = JSON.parse(d[key]);
                    d[key] = val.length === 1 ? val[0] : val.join(', ');
                }
                if (layerProps)
                {
                    const exist = layerProps[key];
                    if (exist)
                    {
                        const value = d[key];
                        // if (exist.DataType === 5 && value) {
                        //     value = new Date(value).toLocaleDateString();
                        // }
                        d[key] = value;
                    }
                }
            });

            let geoData;
            try
            {
                geoData = JSON.parse(d.Location);
            }
            catch (e: any)
            {
                console.error(e.message);
            }

            return {
                ...d,
                id: d.Id,
                title: d.Title,
                x: geoData?.coordinates[1],
                y: geoData?.coordinates[0],
            };
        });
    };
    const getGeoQuery = () =>
    {
        const drawObj: any = spatialSearchStore.drawObj;
        if (drawObj)
        {
            if (drawObj.geometry.type === 'Polygon')
            {
                return JSON.stringify(drawObj.geometry);
            }
            else
            {
                const bufferCoords = spatialSearchStore.drawConfig.bufferCoords;
                return JSON.stringify({
                    type: 'Polygon',
                    coordinates: [bufferCoords],
                });
            }
        }
        return null;
    };
    const getCaseData = async (layerProps?: any, query?: any) =>
    {
        const queryObject = query || {
            returnFields: ['*'],
            count: pageSize,
            filterQuery: filterQuery,
            start: pageIndex * pageSize - pageSize,
            searchKey,
            ...sortInfo && {
                sortOption: {
                    sortInfo: sortInfo,
                },
            },
            ...filterInfo && {
                queryInfo: {
                    fields: filterInfo,
                },
            },
            ...spatialSearch && {
                GeoField: 'Location',
                GeoJson: getGeoQuery(),
            },
        };

        const rs = await caseService.gets(queryObject);

        if (rs?.status?.success && rs?.data)
        {
            let data = rs.data;
            data = parseCaseData(data, layerProps || caseProps);
            return {
                cases: data,
                total: rs.total,
            };
        }
        return null;
    };

    const refetch = async () =>
    {
        setCaseState({ loading: true });
        const data = await getCaseData();
        setCaseState({
            ...data,
        });
        setCaseState({ loading: false });
    };
    const getCaseProps = async () =>
    {
        const layerPropsRs = await layerService.getLayerProps('CHITIETVUVIEC');
        if (layerPropsRs?.status?.success && layerPropsRs?.data?.Properties.length)
        {
            const layerProps: any = {};
            layerPropsRs.data.Properties.forEach((prop: any) =>
            {
                layerProps[prop.ColumnName] = prop;
            });
            return layerProps;
        }
        return null;
    };
    const getsuspectProps = async () =>
    {
        const layerPropsRs = await layerService.getLayerProps('CHITIETDOITUONG');
        if (layerPropsRs?.status?.success && layerPropsRs?.data?.Properties.length)
        {
            const suspectProps: any = {};
            layerPropsRs.data.Properties.forEach((prop: any) =>
            {
                suspectProps[prop.ColumnName] = prop;
            });
            // setCaseState({ suspectProps });
            return suspectProps;
        }
        return null;
    };
    const onCaseSelectionChange = (selected: boolean, caseObj: any) =>
    {
        if (selected)
        {
            caseState.selectedCaseIds.push(caseObj.Id);
        }
        else
        {
            caseState.selectedCaseIds = caseState.selectedCaseIds.filter((id: string) => id !== caseObj.Id);
        }
        setCaseState({
            cases: caseState.cases.map((c: any) =>
            {
                if (c.Id === caseObj.Id)
                {
                    c.isSelected = selected;
                }
                return c;
            }),
            selectedCaseIds: [...caseState.selectedCaseIds],
        });
    };
    const onAllCaseSelectionChange = (selected: boolean) =>
    {
        setCaseState({
            cases: caseState.cases.map((c: any) =>
            {
                return {
                    ...c,
                    isSelected: selected,
                };
            }),
            selectedCaseIds: selected ? caseState.cases.map((c: any) => c.Id) : [],
        });
    };
    const getAllSelectOption = async () =>
    {
        return await LayerHelper.getOptions('CHITIETVUVIEC');
    };

    const getOUName = async (): Promise<string> =>
    {
        const userOU = await caseService.getOU();
        return userOU?.Title;
    };

    const init = async () =>
    {
        setCaseState({ loading: true });
        const caseProps = await getCaseProps();
        const suspectProps = await getsuspectProps();
        const allSelectOption = await getAllSelectOption();
        const caseData = await getCaseData(caseProps);
        const userOU = await getOUName();
        setCaseState({
            caseProps,
            allSelectionFieldOptions: allSelectOption,
            suspectProps,
            ...caseData,
            userOU,
            loading: false,
        });
    };

    const [firstUpdate, setFirstUpdate] = useState(true);

    useEffect(() =>
    {
        if (!firstUpdate)
        {
            refetch();
        }
        else
        {
            setFirstUpdate(false);
        }
    }, [pageIndex, pageSize, sortInfo]);


    useEffect(() =>
    {
        init();
    }, []);

    return (
        <CaseContext.Provider
            value={{
                ...caseState,
                setCaseState,
                getCaseData,
                refetch,
                onCaseSelectionChange,
                onAllCaseSelectionChange,
                layerService,
                caseService,
                spatialSearchStore,
                markerPopupStore,
                genVictimId,
                genSuspectId,
            }}
        >
            {children}
        </CaseContext.Provider>
    );
};

CaseProvider = inject('appStore')(observer(CaseProvider));
export { CaseContext, CaseProvider };
