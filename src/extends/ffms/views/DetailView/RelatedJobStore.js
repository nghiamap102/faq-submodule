import { decorate, observable, action } from 'mobx';
import React from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import _groupBy from 'lodash/groupBy';

import { T } from '@vbd/vui';

import { AdministrativeService } from 'services/administrative.service';
import { CommonHelper } from 'helper/common.helper';
import JobService from 'extends/ffms/services/JobService';

export class RelatedJobStore
{
    appStore = null;
    jobStatuses = [];
    jobs = [];
    jobsByCases = {};
    administrativeSvc = new AdministrativeService();

    totalItem = 0;
    MAXIMUM = 50;
    mainTab = 1;
    hashParam = {};
    tabs = [];

    constructor(fieldForceStore)
    {
        this.fieldForceStore = fieldForceStore;

        this.comSvc = fieldForceStore?.comSvc;
        this.jobSvc = new JobService(fieldForceStore?.appStore?.contexts);

        this.estimated = false;
        this.jobStatuses = [];
        this.jobs = [];
        this.jobsByCases = {};
    }

    setMainTab = (tabIndex) =>
    {
        this.mainTab = tabIndex;
    };

    setHashParam = (hash) =>
    {
        this.hashParam = hash;
    }

    setTabs = (tabs) => this.tabs = tabs;

    initPermissionDetailTabs = (location, cb = null)=>
    {
        let tab = null;
        let isPermit = true;

        if (location.hash)
        {
            tab = this.tabs.find(tab=> tab.hash === location.hash);
            if (tab)
            {
                this.setMainTab(tab.id);
                this.setHashParam({ hash: location.hash });
            }
        }
        else if (this.tabs.length > 0)
        {
            this.setMainTab(this.tabs[0].id);
            tab = this.tabs[0];
        }

        if (this.tabs.length === 0 || (location.hash && !tab))
        {
            isPermit = false;
        }

        const path = location.pathname + location.search;
        cb && cb(tab, isPermit, path);

    }

    getJobData = async (filter = {}, sorter = null) =>
    {
        if (filter.skip === undefined)
        {
            filter.skip = 0;
        }
        if (filter.take === undefined)
        {
            filter.take = this.MAXIMUM;
        }
        
        filter.take = Math.min(filter.take, this.MAXIMUM);
        
        if (sorter)
        {
            filter.sortBy = [{ Field: sorter.sortField, Direction: sorter.sortDirection }];
        }

        const result = await this.jobSvc.search(filter);
        if (result && Array.isArray(result.data))
        {
            // this.jobs = await this.getAdministrativeValues(rs.data.data);
            this.jobs = result.data.map((d) =>
            {
                const jobStatus = CommonHelper.toDictionary(this.jobStatuses, 'jobstatus_name', 'jobstatus_id');
                d.job_status_id = jobStatus[d.job_status_id];
                d.treeNodeInfo = {
                    'job_created': d.job_created,
                    'Assignee': d.job_assignee_guid ? d.job_assignee_guid : <T>Chưa phân công</T>,
                    'time': {
                        'completed': d.job_completed_time && new Date(d.job_completed_time),
                        'start': d.job_start_time && new Date(d.job_start_time),
                        'estimated': {
                            'start': d.job_estimated_start_time && new Date(d.job_estimated_start_time),
                            'completed': d.job_estimated_completed_before_time && new Date(d.job_estimated_completed_before_time),
                        },
                    },
                    'address': {
                        'state': d.job_destination_address_state,
                        'district': d.job_destination_address_district,
                        'tehsil': d.job_destination_address_tehsil,
                    },
                };
                return d;
            });
            this.totalItem = result.total;
        }
        else
        {
            this.jobs = [];
            this.totalItem = 0;
        }

        // Jake's note: Below is the GroupByEmployee execution of the tree. Commented for future use.
        const jobsByCase = this.jobs.length > 0 ? _groupBy(this.jobs, c => c.job_case_guid) : {};
        this.jobsByCases = jobsByCase;
        return jobsByCase;
    };

    getJobDataDebounced = AwesomeDebouncePromise(this.getJobData.bind(this), 500);
    

}

decorate(RelatedJobStore, {
    jobs: observable,
    jobsByCases: observable,
    getJobData: action,

    totalItem: observable,

    setMainTab: action,
    mainTab: observable,

    setHashParam: action,
    hashParam: observable,

    setTabs: action,
    tabs: observable,

    initPermissionDetailTabs: action,
});
