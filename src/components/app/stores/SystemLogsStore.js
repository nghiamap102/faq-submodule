import { decorate, observable } from 'mobx';
import { action } from 'mobx';
import moment from 'moment';

import { SystemLogsService } from 'services/systemLogs.service';

const formatDate = (logs) =>
{
    return logs.map(i =>
    {
        i.createdAt = moment(new Date(i.createdAt)).format('L LTS');
        return i;
    });
};

export class SystemLogsStore
{
    TAB = {
        'system-logs-info': 1,
        'system-logs-warn': 2,
        'system-logs-error': 3,
        'system-logs-crash': 4,

    };

    tabSelected = 'system-logs-info';
    logs = [];

    totalItem = 0;
    pageSize = 100;
    pageIndex = 1;

    constructor()
    {
        this.systemLogSv = new SystemLogsService();
    }

    async setTab(tab)
    {
        this.tabSelected = tab;
        this.pageIndex = 1;
        this.totalItem = 0;

        const count = await this.systemLogSv.getCount(this.TAB[this.tabSelected]);

        this.setTotalItem(count);
        return await this.getLogs();
    }

    setTotalItem(newTotalItem)
    {
        this.totalItem = newTotalItem;
    }

    setPageSize = (pageSize) =>
    {
        this.pageSize = pageSize;
        this.getLogs();
    };

    setPageIndex = async (pageIndex) =>
    {
        this.pageIndex = pageIndex;
        await this.getLogs();
    };

    async getLogs()
    {
        this.logs = []; // quick reset

        const res = await this.systemLogSv.gets({
            type: this.TAB[this.tabSelected],
            limit: this.pageSize,
            skip: (this.pageIndex - 1) * this.pageSize,
        });

        this.logs = (res && res.data) ? res.data : [];
    }
}

decorate(SystemLogsStore, {
    tabSelected: observable,
    logs: observable,
    totalItem: observable,
    pageSize: observable,
    pageIndex: observable,
    infiniteMode: observable,

    setTab: action,
    setPageSize: action,
    setPageIndex: action,
    setTotalItem: action,
});
