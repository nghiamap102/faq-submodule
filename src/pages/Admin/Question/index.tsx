import { Container, IconButton, Popup, Row2 } from '@vbd/vui';
import { DataGridColumn, DataGridItem } from '@vbd/vui/types/components/bases/DataGrid/types';
import AppStore from 'components/app/stores/AppStore';
import HoverTag from 'extends/vbdlis_faq/components/app/HoverTag';
import Preview from 'extends/vbdlis_faq/components/app/Preview';
import TableCPN from 'extends/vbdlis_faq/components/app/Table';
import { Question } from 'extends/vbdlis_faq/stores/QuestionStore';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
interface AdminQuestionProps {
    appStore: AppStore;
}
export const AdminQuestion: React.FC<AdminQuestionProps> = ({ appStore }) => {
    const [isOpenPopupContent, setIsOpenPopupContent] = useState(false)
    const { projectStore, questionStore, topicStore, keywordStore } = appStore.vbdlisFaqStore;
    const { search } = useLocation();
    const param = new URLSearchParams(search)
    const questionsFilter = () => {
        const postFull = [`${questionStore.options.method}Id : ${questionStore.options.id} AND ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO ${moment(keywordStore.timeTo).toISOString()}]`];
        const postMethod = `${questionStore.options.method}Id : ${questionStore.options.id}`;
        const postDateBtw = `ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO ${moment(keywordStore.timeTo).toISOString()}]`;
        const postDateTo = ` ModifiedDate_pdt:[* TO ${moment(keywordStore.timeTo).toISOString()}]`;
        const postDateFr = `ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO *]`;
        const startPage = questionStore.currentPage === 1 ? 0 : (questionStore.currentPage - 1) * questionStore.pageSize;
        if (questionStore.options.id && keywordStore.searchKey && keywordStore.timeTo && keywordStore.timeFrom) {
            questionStore.getQuestions({ searchKey: keywordStore.searchKey, filterQuery: postFull, start: startPage, count: questionStore.pageSize });
        } else if (questionStore.options.id && keywordStore.timeTo && keywordStore.timeFrom && !keywordStore.searchKey) {
            questionStore.getQuestions({ filterQuery: postFull, start: startPage, count: questionStore.pageSize });
        } else if (questionStore.options.id && keywordStore.timeFrom && !keywordStore.timeTo && !keywordStore.searchKey) {
            questionStore.getQuestions({ filterQuery: [`${postMethod} AND ${postDateFr}`], start: startPage, count: questionStore.pageSize });
        } else if (questionStore.options.id && !keywordStore.timeFrom && !keywordStore.timeTo && !keywordStore.searchKey) {
            questionStore.getQuestions({ filterQuery: [`${postMethod}`], start: startPage, count: questionStore.pageSize });
        } else if (questionStore.options.id && !keywordStore.timeFrom && !keywordStore.timeTo && keywordStore.searchKey) {
            questionStore.getQuestions({ searchKey: keywordStore.searchKey, filterQuery: [`${postMethod}`], start: startPage, count: questionStore.pageSize });
        } else if (!questionStore.options.id && keywordStore.timeFrom && !keywordStore.timeTo && !keywordStore.searchKey) {
            questionStore.getQuestions({ filterQuery: [`${postDateFr}`], start: startPage, count: questionStore.pageSize });
        } else if (!questionStore.options.id && keywordStore.timeFrom && keywordStore.timeTo && !keywordStore.searchKey) {
            questionStore.getQuestions({ filterQuery: [`${postDateBtw}`], start: startPage, count: questionStore.pageSize });
        } else if (!questionStore.options.id && keywordStore.timeFrom && keywordStore.timeTo && keywordStore.searchKey) {
            questionStore.getQuestions({ searchKey: keywordStore.searchKey, filterQuery: [`${postDateBtw}`], start: startPage, count: questionStore.pageSize });
        } else if (!questionStore.options.id && !keywordStore.timeFrom && keywordStore.timeTo && !keywordStore.searchKey) {
            questionStore.getQuestions({ filterQuery: [`${postDateTo}`], start: startPage, count: questionStore.pageSize });
        } else if (!questionStore.options.id && !keywordStore.timeFrom && keywordStore.timeTo && keywordStore.searchKey) {
            questionStore.getQuestions({ searchKey: keywordStore.searchKey, filterQuery: [`${postDateTo}`], start: startPage, count: questionStore.pageSize });
        } else if (!questionStore.options.id && !keywordStore.timeFrom && !keywordStore.timeTo && keywordStore.searchKey) {
            questionStore.getQuestions({ searchKey: keywordStore.searchKey, start: startPage, count: questionStore.pageSize });
        } else {
            questionStore.getQuestions({ start: startPage, count: questionStore.pageSize });
        }
    }
    useEffect(() => {
        projectStore.getProjects();
        questionStore.getUser();
        topicStore.getTopics({});
        if (search) questionStore.setOptions({ id: param.get('id'), method: param.get('method') });
        questionsFilter();
        questionStore.getQuestionsFilter({});
        keywordStore.getKeywords({});
    }, []);
    const handleChangeSearch = (value: string) => {
        keywordStore.setSearchKey(value);
        questionsFilter();
    }
    const handleEdit = (topic: any, close: boolean) => {
        if (close) (questionStore.resetQuestion(), questionStore.setIsOpenPopupEdit(false))
        if (!close) (questionStore.setQuestion(topic), questionStore.setIsOpenPopupEdit(true))
    }
    const handleRemove = (question: Question) => {
        questionStore.setQuestion(question);
        questionStore.setIsOpenPopupConfirm(true);
    }
    const handleOK = () => {
        questionStore.deleteQuestion(questionStore.question);
    }
    const handleShowContent = (question: Question) => {
        if (question.questionContent) {
            questionStore.setQuestion(question);
            setIsOpenPopupContent(true);
        }
    }
    const handleChangeMethod = (value: string) => {
        questionStore?.setOptions({ id: undefined, method: value });
        if (!questionStore?.options.method) questionsFilter();
    }
    const handlechangeOptions = (value: any) => {
        questionStore.setOptions({ id: value });
        questionsFilter();
    }
    const actionsColumn: DataGridColumn = {
        id: 'guid',
        headerCellRender: 'Sự Kiện',
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
    const questionColumns: DataGridColumn[] = [
        {
            id: 'projectName',
            displayAsText: 'Dự Án',
        },
        {
            id: 'author',
            displayAsText: 'Tác Giả',
        },
        {
            id: 'topicTitle',
            displayAsText: 'Chủ Đề',
        },
        {
            id: 'questionTitle',
            displayAsText: 'Tiêu Đề',
        },
        {
            id: 'publicStatus',
            displayAsText: 'Trạng Thái',
        },
        {
            id: 'modifyDate',
            displayAsText: 'Thời Gian Sửa',
        },
    ];
    const handleFIlterProject = (id: string) => {
        questionStore.setOptions({ id: id, method: 'project' });
        questionsFilter();
    }
    const handleFIlterTopic = (id: string) => {
        questionStore.setOptions({ id: id, method: 'topic' });
        questionsFilter();
    }
    const filterData = (arr: any[]) => {
        const newArr = arr.map((ele) => {
            ele.modifyDate = moment(ele.ModifiedDate).fromNow();
            ele.author = Helper.getUserById(questionStore.users, ele.CreatedUserId)?.user.username
            ele.projectName =
                <HoverTag handleClickFilter={() => handleFIlterProject(ele.projectId)}>
                    {Helper.getStateById(projectStore.projects, ele.projectId)?.projectName}
                </HoverTag>
            ele.topicTitle =
                <HoverTag handleClickFilter={() => handleFIlterTopic(ele.topicId)}>
                    {Helper.getStateById(topicStore.topics, ele.topicId)?.topicTitle}
                </HoverTag>
            ele.publicStatus = ele.public_status
                ? <Container className='status_active'>Public</Container>
                : <Container className='status_inactive'>Pending</Container>
            return ele;
        })
        return newArr;
    }
    const handleChangePagination = (page: number) => {
        questionStore.setCurrentPage(page);
        questionsFilter();
    };
    const handleChangeItemPerPage = (page: number) => {
        questionStore.setPageSize(page);
        questionStore.setCurrentPage(1);
        questionsFilter();
    }
    const handleChangeTime = (value: any, to: boolean) => {
        to ? keywordStore.setTimeTo(moment(value).toISOString()) : keywordStore.setTimeFrom(moment(value).toISOString())
        questionsFilter();
    }
    const statsQuestion = () => {
        const startPage = questionStore.currentPage === 1 ? 0 : (questionStore.currentPage - 1) * questionStore.pageSize;
        const [loading, setLoading] = useState(false);
        useEffect(() => {
            setTimeout(() => {
                setLoading(!loading);
            }, 600);
        }, [])
        const publicArr = questionStore.questionsFilter.filter((ele) => {
            if (ele.public_status) {
                return ele
            }
        })
        const pendingArr = questionStore.questionsFilter.filter((ele) => {
            if (!ele.public_status) {
                return ele
            }
        })
        const arr = [
            {
                title: 'total',
                color: 'rgb(24, 144, 255)',
                colorbg: 'rgba(24, 144, 255, 0.16)',
                color_text: 'rgb(12, 83, 183)',
                icon: 'file',
                count: useMemo(() => questionStore.questionsFilter.length, [loading]),
                onClick: () => questionStore?.getQuestions({ start: startPage, count: questionStore.pageSize }),
            },
            {
                title: 'public',
                color: 'rgb(84, 214, 44)',
                colorbg: 'rgba(84, 214, 44, 0.16)',
                color_text: 'rgb(34, 154, 22)',
                icon: 'check',
                count: useMemo(() => publicArr.length, [loading]),
                percentage: useMemo(() => publicArr.length / questionStore.questionsFilter.length * 100, [loading]),
                onClick: () => questionStore?.getQuestions({ filterQuery: [`public_status : 1`], start: startPage, count: questionStore.pageSize }),
            },
            {
                title: 'pending',
                color: 'rgb(255, 72, 66)',
                colorbg: 'rgba(255, 72, 66, 0.16)',
                color_text: 'rgb(183, 33, 54)',
                icon: 'times',
                count: useMemo(() => pendingArr.length, [loading]),
                percentage: useMemo(() => pendingArr.length / questionStore.questionsFilter.length * 100, [loading]),
                onClick: () => questionStore?.getQuestions({ filterQuery: [`public_status : 0`] }),
            },
        ]
        return arr;
    }
    return (
        <>
            <Container
                className='container-xxl pt-0'
                style={{ overflow: 'hidden', height: '100%' }}
            >
                <TableCPN
                    vbdlisFaqStore={appStore.vbdlisFaqStore}
                    store={questionStore}
                    title='question'
                    total={questionStore.questionsFilter.length}
                    items={filterData(questionStore.questions)}
                    column={questionColumns}
                    actionsColumn={actionsColumn}
                    listStats={statsQuestion()}
                    handlechangeOptions={handlechangeOptions}
                    handleOK={handleOK}
                    handleChangeMethod={handleChangeMethod}
                    handleClosePopupEdit={(value) => handleEdit(value, true)}
                    handleChangeSearch={debounce(handleChangeSearch, 500)}
                    handleChangePagination={handleChangePagination}
                    handleChangeTimeFrom={(value) => handleChangeTime(value, false)}
                    handleChangeTimeTo={(value) => handleChangeTime(value, true)}
                    handleChangeItemPerPage={handleChangeItemPerPage}
                    methodBreadcrumb
                />
                {isOpenPopupContent && (
                    <Popup
                        title='Content'
                        className='popup-content'
                        onClose={() => setIsOpenPopupContent(false)}
                    >
                        <Preview content={questionStore?.question?.questionContent} />
                    </Popup>
                )}
            </Container>
        </>
    );
};


export default inject('appStore')(observer(AdminQuestion));