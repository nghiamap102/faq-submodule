import { Container, IconButton, Popup, Row2 } from '@vbd/vui';
import { DataGridColumn, DataGridItem } from '@vbd/vui/types/components/bases/DataGrid/types';
import AppStore from 'components/app/stores/AppStore';
import Preview from 'extends/vbdlis_faq/components/app/Preview';
import TableCPN from 'extends/vbdlis_faq/components/app/Table';
import { Feedback } from 'extends/vbdlis_faq/stores/FeedbackStore';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
interface AdminFeedbackProps {
    appStore: AppStore;
}
const AdminFeedback: React.FC<AdminFeedbackProps> = ({ appStore }) => {
    const { projectStore, topicStore, questionStore, feedbackStore, keywordStore } = appStore.vbdlisFaqStore;
    const [isOpenPopupContent, setIsOpenPopupContent] = useState(false)
    useEffect(() => {
        projectStore.getProjects();
        topicStore.getTopics({});
        feedbackStore.getFeedbacks({});
        feedbackFilter();
        feedbackStore.getFeedbacksFilter({});
        feedbackStore.getUser();
        questionStore.getQuestions({});
    }, []);
    const feedbackFilter = () => {
        const postFull = [`${feedbackStore.options.method}Id : ${feedbackStore.options.id} AND ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO ${moment(keywordStore.timeTo).toISOString()}]`];
        const postMethod = `${feedbackStore.options.method}Id : ${feedbackStore.options.id}`;
        const postDateBtw = `ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO ${moment(keywordStore.timeTo).toISOString()}]`;
        const postDateTo = ` ModifiedDate_pdt:[* TO ${moment(keywordStore.timeTo).toISOString()}]`;
        const postDateFr = `ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO *]`;
        const startPage = feedbackStore.currentPage === 1 ? 0 : (feedbackStore.currentPage - 1) * feedbackStore.pageSize;
        if (feedbackStore.options.id && keywordStore.searchKey && keywordStore.timeTo && keywordStore.timeFrom) {
            feedbackStore.getFeedbacks({ searchKey: keywordStore.searchKey, filterQuery: postFull, start: startPage, count: feedbackStore.pageSize });
        } else if (feedbackStore.options.id && keywordStore.timeTo && keywordStore.timeFrom && !keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ filterQuery: postFull, start: startPage, count: feedbackStore.pageSize });
        } else if (feedbackStore.options.id && keywordStore.timeFrom && !keywordStore.timeTo && !keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ filterQuery: [`${postMethod} AND ${postDateFr}`], start: startPage, count: feedbackStore.pageSize });
        } else if (feedbackStore.options.id && !keywordStore.timeFrom && !keywordStore.timeTo && !keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ filterQuery: [`${postMethod}`], start: startPage, count: feedbackStore.pageSize });
        } else if (feedbackStore.options.id && !keywordStore.timeFrom && !keywordStore.timeTo && keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ searchKey: keywordStore.searchKey, filterQuery: [`${postMethod}`], start: startPage, count: feedbackStore.pageSize });
        } else if (!feedbackStore.options.id && keywordStore.timeFrom && !keywordStore.timeTo && !keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ filterQuery: [`${postDateFr}`], start: startPage, count: feedbackStore.pageSize });
        } else if (!feedbackStore.options.id && keywordStore.timeFrom && keywordStore.timeTo && !keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ filterQuery: [`${postDateBtw}`], start: startPage, count: feedbackStore.pageSize });
        } else if (!feedbackStore.options.id && keywordStore.timeFrom && keywordStore.timeTo && keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ searchKey: keywordStore.searchKey, filterQuery: [`${postDateBtw}`], start: startPage, count: feedbackStore.pageSize });
        } else if (!feedbackStore.options.id && !keywordStore.timeFrom && keywordStore.timeTo && !keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ filterQuery: [`${postDateTo}`], start: startPage, count: feedbackStore.pageSize });
        } else if (!feedbackStore.options.id && !keywordStore.timeFrom && keywordStore.timeTo && keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ searchKey: keywordStore.searchKey, filterQuery: [`${postDateTo}`], start: startPage, count: feedbackStore.pageSize });
        } else if (!feedbackStore.options.id && !keywordStore.timeFrom && !keywordStore.timeTo && keywordStore.searchKey) {
            feedbackStore.getFeedbacks({ searchKey: keywordStore.searchKey, start: startPage, count: feedbackStore.pageSize });
        } else {
            feedbackStore.getFeedbacks({ start: startPage, count: feedbackStore.pageSize });
        }
    }
    const handleChangeSearch = (value: string) => {
        keywordStore.setSearchKey(value);
        feedbackFilter();
    }
    const handleEdit = (feedback: Feedback, close: boolean) => {
        if(close) (feedbackStore.resetFeedback() , feedbackStore.setIsOpenPopupEdit(false)) 
        if(!close) (feedbackStore.setFeedback(feedback) ,feedbackStore.setIsOpenPopupEdit(true)) 
    }
    const handleRemove = (feedback: Feedback) => {
        feedbackStore.setFeedback(feedback);
        feedbackStore.setIsOpenPopupConfirm(true);
    }
    const handleOK = () => {
        feedbackStore.deleteFeedback(feedbackStore.feedback);
    }
    const handleShowContent = (feedback: Feedback) => {
        feedbackStore.setFeedback(feedback);
        setIsOpenPopupContent(true);
    }
    const handleChangeMethod = (value: string) => {
        feedbackStore.setOptions({ id: undefined, method: value });
        if (!feedbackStore?.options.method) feedbackFilter();
    }
    const handlechangeOptions = (value: any) => {
        feedbackStore.setOptions({ id: value });
        feedbackFilter();
    }
    const handleChangePagination = (page: number) => {
        feedbackStore.setCurrentPage(page);
        feedbackFilter();
    };
    const handlChangeItemPerPage = (page: number) => {
        feedbackStore.setPageSize(page);
        feedbackStore.setCurrentPage(1);
        feedbackFilter();
    }
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
                        tooltip='Sửa'
                        icon={'edit'}
                        variant="empty"
                        size='lg'
                        iconSize="xs"
                        color='info'
                        onClick={() => handleEdit(row, false)}
                    />
                    <IconButton
                        tooltip='Xóa'
                        icon={'trash-alt'}
                        variant="empty"
                        size='lg'
                        iconSize="xs"
                        color='danger'
                        onClick={() => handleRemove(row)}
                    />
                    <IconButton
                        tooltip="Xem Nội Dung"
                        icon={'book'}
                        variant="empty"
                        size='lg'
                        iconSize="xs"
                        color='warning'
                        onClick={() => handleShowContent(row)}
                    />
                </Row2>
            );
        },
    };
    const projectColumns: DataGridColumn[] = [
        {
            id: 'feedbackTitle',
            displayAsText: 'Chủ Đề Góp ý',
        },
        {
            id: 'author',
            displayAsText: 'Tác Giả',
        },
        {
            id: 'projectName',
            displayAsText: 'Dự Án',
        },
        {
            id: 'topicTitle',
            displayAsText: 'Chủ Đề',
        },
        {
            id: 'questionTitle',
            displayAsText: 'Câu Hỏi',
        },

    ];
    const filterData = (arr: any[]) => {
        const newArr = arr.map((ele) => {
            ele.author = Helper.getUserById(feedbackStore.users, ele.CreatedUserId)?.user.username
            ele.projectName = Helper.getStateById(projectStore.projects, ele?.projectId)?.projectName;
            ele.topicTitle = Helper.getStateById(topicStore.topics, ele?.topicId)?.topicTitle;
            ele.questionTitle = Helper.getStateById(questionStore.questions, ele?.questionId)?.questionTitle;
            return ele;
        })
        return newArr
    }
    const handleChangeTime = (value: any, to: boolean) => {
        to ? keywordStore.setTimeTo(moment(value).toISOString()) : keywordStore.setTimeFrom(moment(value).toISOString())
        feedbackFilter();
    }
    return (
        <>
            <Container
                className='container-xxl'
                style={{ overflow: 'hidden' }}
            >
                <TableCPN
                    vbdlisFaqStore={appStore.vbdlisFaqStore}
                    items={filterData(feedbackStore.feedbacks)}
                    actionsColumn={actionsColumn}
                    title="feedback"
                    store={feedbackStore}
                    column={projectColumns}
                    methodBreadcrumb={false}
                    total={feedbackStore.feedbacksFilter.length}
                    handleChangeSearch={handleChangeSearch}
                    handleOK={handleOK}
                    handleClosePopupEdit={(value) => handleEdit(value, true)}
                    handleChangeMethod={handleChangeMethod}
                    handlechangeOptions={handlechangeOptions}
                    handleChangePagination={handleChangePagination}
                    handleChangeItemPerPage={handlChangeItemPerPage}
                    handleChangeTimeFrom={(value) => handleChangeTime(value, false)}
                    handleChangeTimeTo={(value) => handleChangeTime(value, true)}
                />
                {isOpenPopupContent && (
                    <Popup
                        className='popup-content'
                        title='Content'
                        onClose={() => setIsOpenPopupContent(false)}
                    >
                        <Preview content={feedbackStore?.feedback?.feedbackContent} />
                    </Popup>
                )}
            </Container>
        </>
    );
};

export default inject('appStore')(observer(AdminFeedback));
