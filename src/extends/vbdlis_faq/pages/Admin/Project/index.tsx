import { Container, IconButton, Row2 } from '@vbd/vui';
import { DataGridColumn, DataGridItem } from '@vbd/vui/types/components/bases/DataGrid/types';
import AppStore from 'components/app/stores/AppStore';
import HoverTag from 'extends/vbdlis_faq/components/app/HoverTag';
import TableCPN from 'extends/vbdlis_faq/components/app/Table';
import { LINK } from 'extends/vbdlis_faq/constant/LayerMetadata';
import { Project } from 'extends/vbdlis_faq/stores/ProjectStore';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
interface AdminContainerProps
{
    appStore: AppStore;
}
const AdminProject: React.FC<AdminContainerProps> = ({
    appStore,
}) =>
{
    const { projectStore, topicStore, questionStore, keywordStore } = appStore.vbdlisFaqStore;
    const history = useHistory();
    useEffect(() =>
    {
        projectFilter();
        projectStore.getProjectsFilter();
        projectStore.getUser();
        topicStore.getTopics({})
        questionStore.getQuestions({});
    }, []);
    const projectFilter = () =>
    {
        const postDateBtw = [`ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO ${moment(keywordStore.timeTo).toISOString()}]`];
        const postDateTo = [`ModifiedDate_pdt:[* TO ${moment(keywordStore.timeTo).toISOString()}]`];
        const postDateFr = [`ModifiedDate_pdt:[${moment(keywordStore.timeFrom).toISOString()} TO *]`];
        const startPage = questionStore.currentPage === 1 ? 0 : (questionStore.currentPage - 1) * projectStore.pageSize;
        if (keywordStore.searchKey && keywordStore.timeTo && keywordStore.timeFrom)
        {
            projectStore.getProjects({ searchKey: keywordStore.searchKey, filterQuery: postDateBtw, start: startPage, count: projectStore.pageSize });
        } else if (keywordStore.searchKey && keywordStore.timeFrom && !keywordStore.timeTo)
        {
            projectStore.getProjects({ searchKey: keywordStore.searchKey, filterQuery: postDateFr, start: startPage, count: projectStore.pageSize });
        } else if (keywordStore.searchKey && !keywordStore.timeFrom && keywordStore.timeTo)
        {
            projectStore.getProjects({ searchKey: keywordStore.searchKey, filterQuery: postDateTo, start: startPage, count: projectStore.pageSize });
        } else if (!keywordStore.searchKey && keywordStore.timeFrom && !keywordStore.timeTo)
        {
            projectStore.getProjects({ filterQuery: postDateFr, start: startPage, count: projectStore.pageSize });
        } else if (!keywordStore.searchKey && !keywordStore.timeFrom && keywordStore.timeTo)
        {
            projectStore.getProjects({ filterQuery: postDateTo, start: startPage, count: projectStore.pageSize });
        } else if (!keywordStore.searchKey && keywordStore.timeFrom && keywordStore.timeTo)
        {
            projectStore.getProjects({ filterQuery: postDateBtw, start: startPage, count: projectStore.pageSize });
        } else
        {
            projectStore.getProjects({ searchKey: keywordStore.searchKey, start: startPage, count: projectStore.pageSize });
        }
    }
    const handleChangeSearch = (value: string) =>
    {
        keywordStore.setSearchKey(value);
        projectFilter();
    }
    const handleEdit = (project: any, close: boolean) =>
    {
        if(close) (projectStore.resetProject() , projectStore.setIsOpenPopupEdit(false)) 
        if(!close) (projectStore.setProject(project) ,projectStore.setIsOpenPopupEdit(true)) 
    }
    const handleRemove = (project: Project) =>
    {
        projectStore.setProject(project);
        projectStore.setIsOpenPopupConfirm(true);
    }
    const handleOK = () =>
    {
        projectStore.deleteProject(projectStore.project);
    }
    const handleClickFilterQuestion = (id: string) =>
    {
        history.push(`${LINK.ADMIN}/question/list?id=${id}&method=project`);
    }
    const handleClickFilterTopic = (id: string) =>
    {
        history.push(`${LINK.ADMIN}/topic/list?id=${Helper.getProjectByProjectId(projectStore.projects, id)?.Id}&method=project&projectId=${id}`);
    }
    const handleChangePagination = (page: number) =>
    {
        projectStore.setCurrentPage(page);
        projectFilter();
    };
    const handlChangeItemPerPage = (page: number) =>
    {
        projectStore.setPageSize(page);
        projectStore.setCurrentPage(1);
        projectFilter();
    }
    const filterData = (arr: any[]) =>
    {
        const newArr = arr.map((ele) =>
        {
            ele.modifyDate = moment(ele.ModifiedDate).fromNow();
            ele.author = Helper.getUserById(projectStore.users, ele?.CreatedUserId)?.user.username
            ele.image = (
                <Container
                    className="img-wrapper"
                    style={{ backgroundColor: 'var(--contrast-color)' }}
                >
                    {ele?.projectName?.toUpperCase().slice(0, 1)}
                </Container>
            )
            ele.questionCount = (
                <HoverTag handleClickFilter={() => handleClickFilterQuestion(ele.Id)}>
                    {Helper.renderCount(questionStore?.questions, ele)}
                </HoverTag>
            )
            ele.topicCount = (
                <HoverTag handleClickFilter={() => handleClickFilterTopic(ele.projectId)}>
                    {Helper.renderCount(topicStore?.topics, ele)}
                </HoverTag>
            )
            return ele;
        })
        return newArr
    }
    const actionsColumn: DataGridColumn = {
        id: 'guid',
        headerCellRender: 'Sự Kiện',
        width: 100,
        rowCellRender: function ActionsField(row: DataGridItem, index: number)
        {
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
                        onClick={() => handleEdit(row)}
                    />
                    <IconButton
                        tooltip="Xóa"
                        icon={'trash-alt'}
                        variant="empty"
                        size='lg'
                        iconSize="xs"
                        color='warning'
                        onClick={() => handleRemove(row)}
                    />
                </Row2>
            );
        },
    };
    const projectColumns: DataGridColumn[] = [
        {
            id: 'author',
            displayAsText: 'Tác Giả',
        },
        {
            id: 'image',
            displayAsText: 'Biểu Tượng',
            schema: 'react-node',
        },
        {
            id: 'projectName',
            displayAsText: 'Tên',
        },
        {
            id: 'questionCount',
            displayAsText: 'Câu Hỏi',
            schema: 'react-node',
        },
        {
            id: 'topicCount',
            displayAsText: 'Chủ Đề',
            schema: 'react-node',
        }, {
            id: 'modifyDate',
            displayAsText: 'Thời Gian Sửa',
        },
    ];
    const handleChangeTime = (value: any, to: boolean) =>
    {
        to ? keywordStore.setTimeTo(moment(value).toISOString()) : keywordStore.setTimeFrom(moment(value).toISOString())
        projectFilter();
    }
    return (
        <>
            <Container
                className='container-xxl'
                style={{ overflow: 'hidden' }}
            >
                <TableCPN
                    total={projectStore.projectsFilter.length}
                    items={filterData(projectStore.projects)}
                    actionsColumn={actionsColumn}
                    column={projectColumns}
                    methodBreadcrumb={false}
                    title='project'
                    store={projectStore}
                    vbdlisFaqStore={appStore.vbdlisFaqStore}
                    handleChangeSearch={handleChangeSearch}
                    handleClosePopupEdit={(value) => handleEdit(value, true)}
                    handleOK={handleOK}
                    handleChangePagination={handleChangePagination}
                    handleChangeTimeFrom={(value) => handleChangeTime(value, false)}
                    handleChangeTimeTo={(value) => handleChangeTime(value, true)}
                    handleChangeItemPerPage={handlChangeItemPerPage}
                />
            </Container>
        </>
    );
};

export default inject('appStore')(observer(AdminProject));
