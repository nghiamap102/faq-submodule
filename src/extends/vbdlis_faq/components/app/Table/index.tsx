import { Col2, Container, DataGrid, DateTimePicker, Drawer, FAIcon, Flex, HD6, Input, ResponsiveGrid, ResponsiveGridItem, Row, T, Table } from '@vbd/vui';
import { ConfirmPopup } from 'extends/ffms/pages/base/Popup/Confirm';
import { ROUTE_NAME } from 'extends/vbdlis_faq/constant/LayerMetadata';
import FeedbackStore from 'extends/vbdlis_faq/stores/FeedbackStore';
import ProjectStore from 'extends/vbdlis_faq/stores/ProjectStore';
import QuestionStore from 'extends/vbdlis_faq/stores/QuestionStore';
import TopicStore from 'extends/vbdlis_faq/stores/TopicStore';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { observer } from 'mobx-react';
import { ReactChild, ReactNode, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import BlockStats from '../BlockStats';
import { BreadCrumbAdmin } from '../BreadcrumbAdmin';
import ModifiedFeedback from '../Feedback/ModifiedFeedback';
import Filter from '../Filter';
import { FilterMethod } from '../FilterMethod';
import ModifieldProject from '../Project/ModifieldProject';
import ModifiedQuestion from '../Question/ModifiedQuestion';
import ModifiedTopic from '../Topic/ModifiedTopic';
import './Table.scss';
type Table = {
    title: string;
    column?: any;
    items?: any;
    methodBreadcrumb?: boolean
    vbdlisFaqStore: VBDLISFAQStore;
    store: ProjectStore | TopicStore | QuestionStore | FeedbackStore;
    listStats?: any[];
    handleOK?: () => void;
    handleChangePagination?: (page: number) => void;
    handleChangeSearch: (...args: any) => any;
    handleClosePopupEdit?: (value: any) => void;
    handleChangeMethod?: (value: string) => void;
    handlechangeOptions?: (value: string) => void;
    handleChangeItemPerPage?: (value: any) => void;
    handleChangeTimeFrom?: (value: any) => void;
    handleChangeTimeTo?: (value: any) => void;
    total?: number;
    actionsColumn?: any;
}
const TableCPN = ({
    title,
    column,
    items,
    methodBreadcrumb,
    vbdlisFaqStore,
    handleOK,
    store,
    listStats,
    handleChangeSearch,
    handleClosePopupEdit,
    handleChangeMethod,
    handlechangeOptions,
    handleChangePagination,
    handleChangeItemPerPage,
    handleChangeTimeFrom,
    handleChangeTimeTo,
    total,
    actionsColumn,
}: Table) => {
    const [loading, setLoading] = useState(false);
    const totalItem = useMemo(() => total, [loading]);
    useEffect(() => {
        setTimeout(() => {
            setLoading(true)
        }, 500);
    }, [])
    const history = useHistory();
    const renderFilter = () => {
        const methods = [{ id: 'project', label: 'Project' }, { id: 'topic', label: 'Topic' }]
        if (title === ROUTE_NAME.FEEDBACK) methods.push({ id: 'question', label: 'Question' })
        if (title === ROUTE_NAME.TOPIC) methods.pop();
        return (
            <Filter
                handleChangeMethod={handleChangeMethod}
                vbdlisFaqStore={vbdlisFaqStore}
                store={store}
                handlechangeOptions={handlechangeOptions}
                methods={methods}
                handleChangeTimeFrom={handleChangeTimeFrom}
                handleChangeTimeTo={handleChangeTimeTo}
                handleChangeSearch={handleChangeSearch}
            />
        )
    }
    return (
        <Container className='table-container'>
            <HD6 className='uppercase'>DANH SÁCH <T>{title}</T></HD6>
            <BreadCrumbAdmin
                title={title}
                method={methodBreadcrumb}
            />
            <Flex justify='end' >
                <Container
                    className='btn btn--primary'
                    onClick={() => title === 'question' ? history.push(`create`) : store?.setIsOpenPopupAdd(true)}
                >
                    <FAIcon
                        icon='plus'
                        size='14px'
                        color="var(--base-color)"
                        className="mr-2"
                    />
                    <T>Thêm Mới Dữ Liệu</T>
                </Container>
            </Flex >
            {listStats &&
                <Container className='container-bg-white'>
                    <ResponsiveGrid>
                        {listStats?.map((ele) => (
                            <ResponsiveGridItem key={ele?.title}>
                                <BlockStats
                                    color={ele?.color}
                                    percentage={ele?.percentage}
                                    title={ele?.title}
                                    count={ele?.count}
                                    icon={ele?.icon}
                                />
                            </ResponsiveGridItem>
                        ))}
                    </ResponsiveGrid>
                </Container>
            }
            <Container className='table-wrapper container-bg-white p-0'>
                {listStats &&
                    <Container
                        className='flex items-center px-5 mb-5 '
                        style={{ backgroundColor: 'var(--dark-gray2)', lineHeight: '2' }}
                    >
                        {listStats?.map((ele) => (
                            <FilterMethod
                                key={ele.title}
                                color_text={ele.color_text}
                                colorbg={ele.colorbg}
                                count={ele.count}
                                title={ele.title}
                                onClick={ele.onClick}
                            />
                        ))}
                    </Container>
                }
                {renderFilter()}
                <Container style={{ height: '60vh', padding: '0 10px' }} >
                    <DataGrid
                        columns={column}
                        items={items}
                        pagination={{
                            pageIndex: store.currentPage,
                            pageSize: store.pageSize,
                            pageSizeOptions: [10, 20, 50, 100, 200],
                            onChangePage: handleChangePagination,
                            onChangeItemsPerPage: handleChangeItemPerPage,
                        }}
                        total={totalItem}
                        trailingControlColumns={[actionsColumn]}
                        rowNumber
                    />
                </Container>
            </Container>
            {
                store?.isOpenPopupConfirm &&
                <ConfirmPopup
                    body="Bạn chắc chắn có mún xóa không?"
                    onCancel={() => store?.setIsOpenPopupConfirm(false)}
                    onOk={handleOK}
                />
            }
            {
                store?.isOpenPopupAdd &&
                <Drawer
                    width={`${title === 'question' || title === 'feedback' ? '63%' : '40%'}`}
                    position='right'
                    onClose={() => store?.setIsOpenPopupAdd(false)}
                >
                    <HD6 style={{ textTransform: 'capitalize', paddingLeft: '1rem' }}>Thêm Mới <T>{title}</T></HD6>
                    {renderModify(title, vbdlisFaqStore)}
                </Drawer>
            }
            {
                store?.isOpenPopupEdit &&
                <Drawer
                    width={`${title === 'question' || title === 'feedback' ? '63%' : '40%'}`}
                    position='right'
                    onClose={handleClosePopupEdit}
                >
                    <HD6 style={{ textTransform: 'capitalize', paddingLeft: '1rem' }}>Cập Nhật <T>{title}</T></HD6>
                    {renderModify(title, vbdlisFaqStore)}
                </Drawer>
            }
        </Container >
    );
};

export const renderModify = (type: string, vbdlisFaqStore: VBDLISFAQStore) => {
    switch (type) {
        case ROUTE_NAME.PROJECT:
            return <ModifieldProject vbdlisFaqStore={vbdlisFaqStore} />
        case ROUTE_NAME.TOPIC:
            return <ModifiedTopic vbdlisFaqStore={vbdlisFaqStore} />
        case ROUTE_NAME.QUESTION:
            return <ModifiedQuestion
                mode='v2'
                vbdlisFaqStore={vbdlisFaqStore}
                   />
        case ROUTE_NAME.FEEDBACK:
            return <ModifiedFeedback vbdlisFaqStore={vbdlisFaqStore} />
        default:
            break;
    }
}
export default observer(TableCPN);