import { Container, IconButton, Row2 } from '@vbd/vui';
import { DataGridColumn, DataGridItem } from '@vbd/vui/types/components/bases/DataGrid/types';
import AppStore from 'components/app/stores/AppStore';
import HoverTag from 'extends/vbdlis_faq/components/app/HoverTag';
import TableCPN from 'extends/vbdlis_faq/components/app/Table';
import { LINK } from 'extends/vbdlis_faq/constant/LayerMetadata';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
interface AdminContainerProps {
    appStore: AppStore;
}
const AdminTopic: React.FC<AdminContainerProps> = ({
    appStore,
}) => {
    const { keywordStore, projectStore, topicStore, questionStore } = appStore.vbdlisFaqStore;
    const { search } = useLocation();
    const param = new URLSearchParams(search);
    const history = useHistory();
    useEffect(() => {
        projectStore.getProjects();
        topicStore.getUser();
        if (search) {
            topicStore.setOptions({ id: param.get('id'), method: param.get('method')?.toString() });
            topicStore.getTopics({ filterQuery: [`${topicStore?.options?.method}Id : ${param.get('projectId')}`] });
        } else {
            topicFilter();
        }
        questionStore.getQuestions({});
        topicStore.getTopicsFilter({});
    }, []);
    const topicFilter = () => {
        const postFull = [`${topicStore.options.method}Id : ${Helper.getStateById(projectStore.projects,topicStore.options.id)?.projectId} AND ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO ${moment(keywordStore.timeTo).toISOString()}]`];
        const postMethod = `${topicStore.options.method}Id : ${Helper.getStateById(projectStore.projects,topicStore.options.id)?.projectId }`;
        const postDateBtw = `ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO ${moment(keywordStore.timeTo).toISOString()}]`;
        const postDateTo = ` ModifiedDate_pdt:[* TO ${moment(keywordStore.timeTo).toISOString()}]`;
        const postDateFr = `ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO *]`;
        const startPage = questionStore.currentPage === 1 ? 0 : (questionStore.currentPage - 1) * topicStore.pageSize;
        if (topicStore.options.id && keywordStore.searchKey && keywordStore.timeTo && keywordStore.timeFrom) {
            topicStore.getTopics({ searchKey: keywordStore.searchKey, filterQuery: postFull, start: startPage, count: topicStore.pageSize });
        } else if (topicStore.options.id && keywordStore.timeTo && keywordStore.timeFrom && !keywordStore.searchKey) {
            topicStore.getTopics({ filterQuery: postFull, start: startPage, count: topicStore.pageSize });
        } else if (topicStore.options.id && keywordStore.timeFrom && !keywordStore.timeTo && !keywordStore.searchKey) {
            topicStore.getTopics({ filterQuery: [`${postMethod} AND ${postDateFr}`], start: startPage, count: topicStore.pageSize });
        } else if (topicStore.options.id && !keywordStore.timeFrom && !keywordStore.timeTo && !keywordStore.searchKey) {
            topicStore.getTopics({ filterQuery: [`${postMethod}`], start: startPage, count: topicStore.pageSize });
        } else if (topicStore.options.id && !keywordStore.timeFrom && !keywordStore.timeTo && keywordStore.searchKey) {
            topicStore.getTopics({ searchKey: keywordStore.searchKey, filterQuery: [`${postMethod}`], start: startPage, count: topicStore.pageSize });
        } else if (!topicStore.options.id && keywordStore.timeFrom && !keywordStore.timeTo && !keywordStore.searchKey) {
            topicStore.getTopics({ filterQuery: [`${postDateFr}`], start: startPage, count: topicStore.pageSize });
        } else if (!topicStore.options.id && keywordStore.timeFrom && keywordStore.timeTo && !keywordStore.searchKey) {
            topicStore.getTopics({ filterQuery: [`${postDateBtw}`], start: startPage, count: topicStore.pageSize });
        } else if (!topicStore.options.id && keywordStore.timeFrom && keywordStore.timeTo && keywordStore.searchKey) {
            topicStore.getTopics({ searchKey: keywordStore.searchKey, filterQuery: [`${postDateBtw}`], start: startPage, count: topicStore.pageSize });
        } else if (!topicStore.options.id && !keywordStore.timeFrom && keywordStore.timeTo && !keywordStore.searchKey) {
            topicStore.getTopics({ filterQuery: [`${postDateTo}`], start: startPage, count: topicStore.pageSize });
        } else if (!topicStore.options.id && !keywordStore.timeFrom && keywordStore.timeTo && keywordStore.searchKey) {
            topicStore.getTopics({ searchKey: keywordStore.searchKey, filterQuery: [`${postDateTo}`], start: startPage, count: topicStore.pageSize });
        } else if (!topicStore.options.id && !keywordStore.timeFrom && !keywordStore.timeTo && keywordStore.searchKey) {
            topicStore.getTopics({ searchKey: keywordStore.searchKey, start: startPage, count: topicStore.pageSize });
        } else {
            topicStore.getTopics({ start: startPage, count: topicStore.pageSize });
        }
    }
    const handleChangeSearch = (value: string) => {
        keywordStore.setSearchKey(value);
        topicFilter();
    }
    const handleEdit = (topic: any, close: boolean) => {
        if(close) (topicStore.resetTopic() , topicStore.setIsOpenPopupEdit(false)) 
        if(!close) (topicStore.setTopic(topic) ,topicStore.setIsOpenPopupEdit(true)) 
    }
    const handleRemove = (topic: any) => {
        topicStore.setTopic(topic);
        topicStore.setIsOpenPopupConfirm(true);
    }
    const handleOK = () => {
        topicStore.deleteTopic(topicStore.topic);
    }
    const handleClickFilter = (ele: any) => {
        Helper.renderCount(questionStore?.questions, ele) > 0 ? history.push(`${LINK.ADMIN}/question/list/?id=${ele.Id}&method=topic`) : '';
    }
    const handlechangeOptions = (value: any) => {
        topicStore.setOptions({ id: value });
        topicFilter();
    }
    const handleChangePagination = (page: number) => {
        topicStore.setCurrentPage(page);
        topicFilter();
    };
    const handlChangeItemPerPage = (page: number) => {
        topicStore.setPageSize(page);
        topicStore.setCurrentPage(1);
        topicFilter();
    }
    const handleChangeMethod = (value: string) => {
        topicStore.setOptions({ id: undefined, method: value });
        if (!topicStore?.options.method) topicFilter();
    }
    const filterData = (arr: any[]) => {
        const newArr = arr.map((ele) => {
            ele.modifyDate = moment(ele.ModifiedDate).fromNow();
            ele.author = Helper.getUserById(topicStore.users, ele.CreatedUserId)?.user.username
            ele.questionCount = (
                <HoverTag handleClickFilter={() => handleClickFilter(ele)}>
                    {Helper.renderCount(questionStore?.questions, ele)}
                </HoverTag>
            );
            return ele;
        })
        return newArr
    }
    const topicColumns: DataGridColumn[] = [
        {
            id: 'topicTitle',
            displayAsText: 'Chủ Đề',
        },
        {
            id: 'author',
            displayAsText: 'Tác Giả',
        },
        {
            id: 'projectId',
            displayAsText: 'Dự Án',
        },
        {
            id: 'questionCount',
            displayAsText: 'Câu Hỏi',
        },
        {
            id: 'modifyDate',
            displayAsText: 'Thời Gian Sửa',
        },
    ];
    const actionsColumn: DataGridColumn = {
        id: 'guid',
        headerCellRender: 'Sự Kiện',
        width: 100,
        rowCellRender: function ActionsField(row: DataGridItem, index: number) {
            return (
                <Row2
                    gap={1}
                    items='start'
                >
                    <IconButton
                        tooltip="Sửa"
                        icon={'edit'}
                        variant="empty"
                        size='lg'
                        iconSize="xs"
                        color='info'
                        onClick={() => handleEdit(row, false)}
                    />
                    <IconButton
                        tooltip="Xóa"
                        icon={'trash-alt'}
                        variant="empty"
                        size='lg'
                        iconSize="xs"
                        color='danger'
                        onClick={() => handleRemove(row)}
                    />
                </Row2>
            );
        },
    };
    const handleChangeTime = (value: any, to: boolean) => {
        to ? keywordStore.setTimeTo(moment(value).toISOString()) : keywordStore.setTimeFrom(moment(value).toISOString())
        topicFilter();
    }
    return (
        <>
            <Container
                className='container-xxl'
                style={{ overflow: 'hidden' }}
            >
                <TableCPN
                    total={topicStore.topicsFilter.length}
                    items={filterData(topicStore.topics)}
                    actionsColumn={actionsColumn}
                    column={topicColumns}
                    methodBreadcrumb={false}
                    title='topic'
                    store={topicStore}
                    vbdlisFaqStore={appStore.vbdlisFaqStore}
                    handleChangeSearch={handleChangeSearch}
                    handleChangeMethod={handleChangeMethod}
                    handleClosePopupEdit={(value) => handleEdit(value, true)}
                    handleOK={handleOK}
                    handlechangeOptions={handlechangeOptions}
                    handleChangePagination={handleChangePagination}
                    handleChangeTimeFrom={(value) => handleChangeTime(value, false)}
                    handleChangeTimeTo={(value) => handleChangeTime(value, true)}
                    handleChangeItemPerPage={handlChangeItemPerPage}
                />
            </Container>
        </>
    );
};

export default inject('appStore')(observer(AdminTopic));
