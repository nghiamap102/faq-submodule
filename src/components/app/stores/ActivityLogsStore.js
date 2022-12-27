import { action, decorate, observable } from 'mobx';

import LayerService from 'services/layer.service';
import ActivityLogsService from 'services/activityLogs.service';
import { UserService } from 'services/user.service';

export class ActivityLogsStore
{
    layerService = new LayerService(process.env.REACT_APP_VDMS_APP_URL);
    activityLogsSvc = new ActivityLogsService();
    userSvc = new UserService();

    appStore = null;

    logs = [];
    fieldsShow = ['model', 'action', 'userId', 'createdDate'];
    layerLogsProps = {};

    paging = {
        total: null,
        currentPage: 1,
        pageSize: 20
    };

    logsObject = null;
    isShowLogsDetail = false;

    filterInfo = null;

    constructor(appStore, modalStore)
    {
        this.modalStore = modalStore;
    }

    init = async () =>
    {
        this.getLogsData();
        await this.getLayerLogsProps();
    };

    clearLogsObject = () =>
    {
        this.logsObject = null;
    };

    buildChangeLog = (data) =>
    {
        const ignoreKeys = []; // ['isDeleted', 'updatedDate'];
        if (!data || !data.length)
        {
            return [];
        }
        for (let i = 0; i < data.length; i++)
        {
            const before = data[i].before || {};
            const after = data[i].after || {};

            const allKeys = [
                ...new Set([...Object.keys(before).map(k => k), ...Object.keys(after).map(k => k)])
            ].filter(k => !ignoreKeys.includes(k)).sort((a, b) => a.length - b.length);

            const childData = [];
            allKeys.forEach(key =>
            {
                if (before[key] === undefined) // add new
                {
                    childData.push({
                        key: key,
                        value: JSON.stringify(after[key]),
                        type: 'new'
                    });
                }
                else if (after[key] === undefined) // delete
                {
                    childData.push({
                        key: key,
                        value: JSON.stringify(before[key]),
                        type: 'delete'
                    });
                }
                else if (before[key] !== after[key]) // update -> remove && add
                {
                    childData.push({
                        key: key,
                        value: JSON.stringify(before[key]),
                        type: 'delete'
                    });
                    childData.push({
                        key: key,
                        value: JSON.stringify(after[key]),
                        type: 'new'
                    });
                }
                else // no change
                {
                    childData.push({
                        key: key,
                        value: JSON.stringify(after[key])
                    });
                }
            });

            data[i].data = childData;
            // data[i].action = data[i].after['isDeleted'] ? 'Delete' : data[i].action;
        }

        return data;
    };

    setLogsData = (rs) =>
    {
        this.logs = this.buildChangeLog(rs?.data);
        this.setPaging({ total: rs.total || 0 });
    };

    convertToLoopbackFilter = (queryObject) =>
    {
        if (queryObject && queryObject && queryObject.queryInfo && queryObject.queryInfo.fields)
        {
            // build and condition
            const mapOp = {
                '=': 'eq',
                'like': 'like',
                '>': 'gt',
                '>=': 'gte',
                '<': 'lt',
                '<=': 'lte'
            };

            // group by ColumnName

            const andCond = []; // keep all AND
            const orCond = []; // keep all OR
            const neqCond = {}; // keep all NOT

            const fields = [];

            queryObject.queryInfo.fields.map(field =>
            {
                if (field.Condition === 'between') // special case, separate into 2 normal field, // field.ValueFilter: "2020-11-11  AND 2020-11-19"
                {
                    const ValueFilter = field.ValueFilter?.split(' ');
                    const fieldL = {
                        ColumnName: field.ColumnName,
                        Combine: field.Combine,
                        Condition: '>=',
                        ValueFilter: new Date(ValueFilter[0])
                    };

                    const fieldR = {
                        ColumnName: field.ColumnName,
                        Combine: field.Combine,
                        Condition: '<=',
                        ValueFilter: new Date(ValueFilter[ValueFilter.length - 1])
                    };

                    fields.push(fieldL);
                    fields.push(fieldR);
                }
                else
                {
                    if (/^[a-f\d]{24}$/i.test(field.ValueFilter)) // detect ObjectId format
                    {
                        field.Condition = '='; // ObjectId not work with operator 'like'
                    }

                    fields.push(field);
                }
            });

            fields.forEach(field =>
            {
                if (field && field.ColumnName && field.Combine && field.Condition && field.ValueFilter)
                {
                    const cond = {};
                    cond[field.ColumnName] = {};
                    cond[field.ColumnName][mapOp[field.Condition]] = field.ValueFilter;

                    if (field.Combine === 'AND')
                    {
                        andCond.push(cond);
                    }
                    else if (field.Combine === 'OR')
                    {
                        orCond.push(cond);
                    }
                    else if (field.Combine === 'NOT')
                    {
                        neqCond[field.ColumnName] = {};
                        neqCond[field.ColumnName]['neq'] = field.ValueFilter;
                    }
                }
            });

            orCond.push({ and: andCond.length ? andCond : [{}] });

            queryObject.where = Object.assign({
                or: orCond.length ? orCond : [{}]
            }, neqCond);
        }

        return queryObject;
    };

    getLogsData = async (page = 1) =>
    {
        this.setPaging({ currentPage: page });

        const queryObject = {
            limit: this.paging.pageSize,
            skip: page * this.paging.pageSize - this.paging.pageSize,
            ...this.filterInfo && {
                queryInfo: {
                    fields: this.filterInfo
                }
            }
        };

        const loopbackQueryObject = this.convertToLoopbackFilter(queryObject);
        const rs = await this.activityLogsSvc.gets(loopbackQueryObject);
        if (rs?.data?.data?.length > 0)
        {
            this.setLogsData(rs.data);
        }
        else if (rs?.data?.data?.length === 0)
        {
            this.setLogsData({});
        }
    };

    setLayerLogsProps = (props) =>
    {
        this.layerLogsProps = props;
    };

    getLayerLogsProps = async () =>
    {
        const [loopbackModelsSource, usersData] = await Promise.all([this.activityLogsSvc.getLoopbackModels(), this.userSvc.getAll()]);

        const usersSource = [];
        if (usersData && usersData.data)
        {
            usersData.data.forEach(user =>
            {
                if (user)
                {
                    usersSource.push({
                        Value: user.userId,
                        Display: `${user?.user?.username}(${user?.user?.email})`
                    });
                }
            });
        }

        const props = {
            model: {
                ColumnName: 'model',
                Config: JSON.stringify({
                    'content': {
                        'source': loopbackModelsSource
                    }
                }),
                DataType: 10, // Select
                DisplayName: 'Model'
            },
            action:
                {
                    ColumnName: 'action',
                    Config: JSON.stringify({
                        'content': {
                            'source': [
                                { 'Value': 'Add', 'Display': 'Add' },
                                { 'Value': 'Update', 'Display': 'Update' },
                                { 'Value': 'Delete', 'Display': 'Delete' }
                            ]
                        }
                    }),
                    DataType: 10, // Select
                    DisplayName: 'Hành Động'
                },
            userId:
                {
                    ColumnName: 'userId',
                    Config: JSON.stringify({
                        'content': {
                            'source': usersSource
                        }
                    }),
                    DataType: 10, // Select
                    DisplayName: 'Người Tạo'
                },
            createdDate:
                {
                    ColumnName: 'createdDate',
                    Config: { dataType: 5, validator: [], content: {} },
                    DataType: 5, // Date
                    DisplayName: 'Ngày Tạo'
                }
        };

        this.setLayerLogsProps(props);
    };

    setPaging = ({ total, currentPage, pageSize }) =>
    {
        this.paging = {
            ...this.paging,
            ...total && { total },
            ...currentPage && { currentPage },
            ...pageSize && { pageSize }
        };
    };

    setFilterInfo = (filterInfo) =>
    {
        this.filterInfo = filterInfo;
    };

    showLogsDetail = () =>
    {
        if (!this.isShowLogsDetail)
        {
            this.isShowLogsDetail = true;
        }
    };

    hideLogsDetail = () =>
    {
        if (this.isShowLogsDetail)
        {
            this.isShowLogsDetail = false;
        }
    };

}

decorate(ActivityLogsStore, {
    logs: observable,
    layerLogsProps: observable,
    logsObject: observable,
    isShowLogsDetail: observable,
    paging: observable,
    fieldsShow: observable,
    sortInfo: observable,
    filterInfo: observable,

    init: action,
    getLogsData: action,
    setLogsData: action,
    clearLogsObject: action,
    setLayerLogsProps: action,
    showLogsDetail: action,
    hideLogsDetail: action,
    getClassifyData: action,
    setPaging: action,
    setFilterInfo: action
});
