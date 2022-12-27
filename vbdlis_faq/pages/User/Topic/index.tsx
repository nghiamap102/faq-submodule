import { Col2, Container, FAIcon, Flex, HD6, Row2, T } from '@vbd/vui';
import AppStore from 'components/app/stores/AppStore';
import BreadCrumb from 'extends/vbdlis_faq/components/app/BreadCrumb';
import Header from 'extends/vbdlis_faq/components/app/Header';
import Preview from 'extends/vbdlis_faq/components/app/Preview';
import Rating from 'extends/vbdlis_faq/components/app/Rating';
import { Question } from 'extends/vbdlis_faq/stores/QuestionStore';
import { Topic } from 'extends/vbdlis_faq/stores/TopicStore';
import Helper from 'extends/vbdlis_faq/utils/Helper';
import Validation from 'extends/vbdlis_faq/utils/Validation';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './Topic.scss';
interface TopicContainerProps {
    appStore: AppStore
}
const TopicContainer = ({ appStore }: TopicContainerProps) => {
    const vbdlisFaqStore = appStore.vbdlisFaqStore;
    const { projectStore, topicStore, questionStore, keywordStore } = vbdlisFaqStore;
    const { projectId, topicId } = useParams();
    const { search } = useLocation();
    useEffect(() => {
        projectStore.getProjects({ start: 0, count: 25 });
        topicStore.getTopics({ filterQuery: [`projectId : ${projectId} `] });
        topicStore.getStateById({ filterQuery: [`id : ${topicId}`] });
        questionStore.getQuestions({ filterQuery: [`topicId : ${topicId} AND projectId :${new URLSearchParams(search).get("id")}`] });
    }, []);

    const renderListTopic = () => {
        const newArr = topicStore?.topics?.filter((ele: Topic) => {
            if (topicStore.topic.parentId === ele.parentId) {
                return ele;
            }
        })
        return newArr;
    }

    return (
        <>
            <Container className="container-init">
                <Header
                    vbdlisFaqStore={vbdlisFaqStore}
                    searchBar
                />
                <Container className='content-wrapper mb-10' style={{ width: '58%', margin: '7rem auto' }}>
                    <BreadCrumb vbdlisFaqStore={vbdlisFaqStore} mode />
                    <Row2 >
                        <Col2>
                            <Container className='question-wrapper'>
                                <Container className='question-inner'>
                                    {Validation.isNotEmptyArray(questionStore?.questions) && questionStore.questions.map((ele: Question, index: number) => (
                                        <Preview
                                            key={ele.Id}
                                            content={ele.questionContent}
                                        />
                                    ))}
                                </Container>
                                <Container className='rating-section'>
                                    <Rating />
                                </Container>
                            </Container>
                        </Col2>
                        <Col2
                            width="4/12"
                            className='ml-20'
                        >
                            <Link
                                to={`/vbdlisfaq/home/${projectId}`}
                                className="help mb-4"
                            >
                                <HD6>Trợ Giúp</HD6>
                            </Link>
                            <Container>
                                {Validation.isNotEmptyArray(renderListTopic()) && renderListTopic().map((ele: Topic, index: number) => (
                                    <Link
                                        key={ele.Id}
                                        to={`/vbdlisfaq/home/project/${projectId}/topic/${ele.Id}?id=${Helper.getProjectByProjectId(projectStore.projects, projectId).Id}`}
                                    >
                                        <Flex
                                            items='center'
                                            className='my-4 items'
                                        >
                                            <FAIcon
                                                type="solid"
                                                size="18px"
                                                icon='book'
                                                color="var(--bg-color-primary3)"
                                                className="mr-5"
                                            />
                                            {topicId === ele.Id && <HD6 className='active'>{ele.topicTitle}</HD6>}
                                            {topicId !== ele.Id && <HD6 className='inactive'>{ele.topicTitle}</HD6>}
                                        </Flex>
                                    </Link>
                                ))}
                            </Container>

                            {!Validation.isNotEmptyArray(renderListTopic()) && <T>Hiện Tại Chưa Có Thêm Dữ Liệu</T>}
                        </Col2>
                    </Row2>
                </Container>
            </Container>
        </>
    );
};

export default inject('appStore')(observer(TopicContainer));
