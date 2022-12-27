import { decorate, observable, action } from 'mobx';
import React from 'react';
import _omit from 'lodash/omit';
import moment from 'moment';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import _groupBy from 'lodash/groupBy';
import Promise from 'bluebird';

import { T } from '@vbd/vui';

import { AdministrativeService } from 'services/administrative.service';
import { CommonHelper } from 'helper/common.helper';
import { LAYERS } from 'extends/ffms/constant/models';

export class DetailTreeStore
{
    appStore = null;
    administrativeSvc = new AdministrativeService();
    loading = false;

    sortField = 'job_created';
    sortDirection = 'ASC';

    totalItem = 0;

    constructor(fieldForceStore)
    {
        this.fieldForceStore = fieldForceStore;

        this.comSvc = fieldForceStore?.comSvc;
        // this.jobSvc = new JobService(fieldForceStore?.appStore?.contexts);

        this.estimated = false;
    }

    setLoading = (loading) =>
    {
        this.loading = loading;
    }

    resetDirectionSort = () =>
    {
        this.sortDirection = 'ASC';
        this.sortField = 'job_created';
    }

    setDirection = ({ direction, field = 'job_created' }) =>
    {
        this.sortDirection = direction;
        this.sortField = field;
    }

    buildTree = (data) =>
    {
        // Jake's note:
        // This particular execution of buildTree is based on the following formula:
        // JOBS as the root node, then all the jobs listed under one root node

        // const treeData = data && data.map ? data.map((node) =>
        // {
        //     return {
        //         ...node,
        //         id: node.Id || node.job_guid,
        //         label: node.Title,
        //         treeNodeInfo: {
        //             'Assignee': node.job_assignee_guid ? node.job_assignee_guid : <T>Chưa phân công</T>,
        //             'time': {
        //                 'completed': node.job_completed_time && new Date(node.job_completed_time),
        //                 'start': node.job_start_time && new Date(node.job_start_time),
        //                 'estimated': {
        //                     'start': node.job_estimated_start_time && new Date(node.job_estimated_start_time),
        //                     'completed': node.job_estimated_completed_before_time && new Date(node.job_estimated_completed_before_time),
        //                 },
        //             },
        //             'address': {
        //                 'state': node.job_destination_address_state,
        //                 'district': node.job_destination_address_district,
        //                 'tehsil': node.job_destination_address_tehsil,
        //             },
        //             'icon': {
        //                 icon: 'info-circle',
        //                 type: 'light',
        //                 tooltip: 'Xem chi tiết',
        //                 onClick: async () =>
        //                 {
        //                     this.jobDetailActive = !this.jobDetailActive;
        //                     this.currentJob = {
        //                         ..._omit(node, 'job_destination_location'),
        //                         job_destination_location: JSON.stringify(
        //                             node.job_destination_location,
        //                         ),
        //                     };

        //                     await this.showJobDetailPopup(node);
        //                 },
        //             },
        //         },
        //     };
        // }) : [];

        // // Set the root node temporarily static as JOBS, will change this later
        // const rootNode = [
        //     {
        //         id: 'jobs',
        //         // label: `${this.i18n.t('Danh sách công việc')} (${treeData.length}${total > treeData.length ? '+' : ''})`,
        //         child: treeData,
        //         arrowVisible: false,
        //         root: false,
        //         expand: true,
        //     },
        // ];

        // Jake's note:
        // This particular execution of buildTree is based on the following formula:
        // _groupBy(array), the keys will act as parent nodes
        const rootNode = [];
        Object.keys(data).forEach(parentId =>
        {
            const treeData = data[parentId] && data[parentId].map ? data[parentId].map((node) =>
            {
                const guidField = Object.keys(node).filter(field => field.includes('guid'))[0];

                return {
                    ...node,
                    id: node.Id || node[guidField],
                    label: node.Title,
                    treeNodeInfo: node.treeNodeInfo,
                };
            }) : [];
            rootNode.push({
                id: parentId,
                // label: `${this.i18n.t('Danh sách công việc')} (${treeData.length}${total > treeData.length ? '+' : ''})`,
                label: parentId,
                child: treeData,
                arrowVisible: true,
                root: false,
                expand: true,
            });

        });

        // return tree
        return rootNode;
    };
}

decorate(DetailTreeStore, {
    sortDirection: observable,

    resetDirectionSort: action,
    setDirection: action,
    buildTree: action,

    loading: observable,
    setLoading: action,
});
