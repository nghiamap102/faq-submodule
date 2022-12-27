import './WrapperTags.scss';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import _ from 'lodash';
import moment from 'moment';
import { convertCustomTime, getCurrentMainTab, rebuildOptionData } from 'extends/ffms/services/DashboardService/util';
import { useI18n } from '@vbd/vui';

const WrapperTags = ({ fieldForceStore, children, className, isShowAll, isBrief }) =>
{
    const [data, setData] = useState(null);
    const { t } = useI18n();

    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const currentTab = getCurrentMainTab(dashboardStore.tabs);
    useEffect(() =>
    {
        getTags();
    }, [dashboardStore.config]);

    const handleChangeSearchTag = async (tag) =>
    {
        let currentConfig = toJS(dashboardStore.config);
        const para = _.split(tag.id, ':');

        const item = _.find(currentConfig?.filters, f => f.key == para[0]);
        if (item)
        {
            if (item?.type == 'time-filter')
            {
                item.values = convertCustomTime(item?.data, item?.default);

            }
            else
            {
                let data = undefined;
                if (item?.multi)
                {
                    data = _.filter(item?.values, (item) => item != para[1]);
                    data = _.size(data) > 0 ? data : undefined;
                }
                item.values = data;

                if (_.size(data) === 0)
                {
                    delete item.default;
                }
            }

            currentConfig = rebuildOptionData(item?.key, item.values, currentConfig);
        }

        await dashboardStore.setDashboardConfig({ ...currentConfig }, currentTab);
    };

    const getTags = () =>
    {
        let tags = [];
        const dashboardConfig = toJS(dashboardStore.config);
        if (!dashboardConfig)
        {
            return;
        }
        dashboardConfig.filters && dashboardConfig.filters.forEach(item =>
        {
            switch (item?.type)
            {
                case 'time-filter':
                    tags = _.concat(tags, getTagPeriod(item));
                    break;
                default:
                    tags = _.concat(tags, getTagsByType(item));

            }
        });
        setData(tags);
    };

    const getTagsByType = (item) =>
    {
        const selected = item?.values && (_.isArray(item?.values) ? item?.values : [item?.values]);
        const label = item?.label;
        const data = item?.selected ?? item?.data;
        if (_.size(data) === 0)
        {
            return [];
        }
        const tags = [];
        if (_.size(selected) === 0)
        {
            // isShowAll && tags.push({ id: `${item?.key}:all`, name: getContentByLanguage(item?.placeholder), type: item?.key });
            isShowAll && tags.push({ id: `${item?.key}:all`, name: item?.placeholder, type: item?.key });
        }
        else
        {
            if (isBrief)
            {
                const description = _.join(_.map(selected, (sel) =>
                {
                    const tag = _.find(data, { id: sel });
                    return tag.label;
                }), ', ');
                // tags.push({ id: `${item?.key}:all`, name: getContentByLanguage(item?.label), type: item?.key, description });
                //     return _.get(tag, ['label',language], tag.label);
                // }), ', ');

                if (item?.multi)
                {
                    tags.push({ id: `${item?.key}:all`, name: label, type: item?.key, description });
                }
                else
                {
                    tags.push({ id: `${item?.key}:${description}`, name: description, type: item?.key, description });
                }
            }
            else
            {
                _.forEach(selected, (sel) =>
                {
                    const tag = _.find(data, { id: sel });
                    tag && tags.push({ ...tag, id: `${item?.key}:${sel}`, type: item?.key });
                });
            }
        }
        return tags;
    };

    const getTagPeriod = (item) =>
    {
        const value = item?.values;
        const tag = _.find(item?.data, { id: value.type });
        const fromDate = moment.isMoment(_.get(value, 'from')) ? _.get(value, 'from') : moment(_.get(value, 'from'));
        const toDate = moment.isMoment(_.get(value, 'to')) ? _.get(value, 'to') : moment(_.get(value, 'to'));
        // return [{ id: item?.key, name: value.type === 'Custom' ? `${fromDate.format('MMM D, YYYY')} - ${toDate.isSame(moment(), 'd') ? 'Today' : toDate.format('MMM D, YYYY')} ` : getContentByLanguage(tag.label) }];
        return [{ id: item?.key, name: value.type === 'Custom' ? `${fromDate.format('MMM D, YYYY')} - ${toDate.isSame(moment(), 'd') ? t('Hôm nay') : toDate.format('MMM D, YYYY')} ` : tag.label }];

    };

    return (
        <div className={className}>
            {
                children({ onChange: handleChangeSearchTag, data })
            }
        </div>
    );

};

WrapperTags.propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    fieldForceStore: PropTypes.any,
    children: PropTypes.any,
    className: PropTypes.string,
    isShowAll: PropTypes.bool,
    isBrief: PropTypes.bool,
};

WrapperTags.defaultProps = {
    isShowAll: false,
    isBrief: false,
};
export default inject('fieldForceStore')(observer(WrapperTags));
