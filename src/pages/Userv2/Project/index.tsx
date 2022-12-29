import { Container, Flex, HD6 } from "@vbd/vui";
import AppStore from "components/app/stores/AppStore";
import { BreadCrumbv2 } from "extends/vbdlis_faq/components/app/BreadCrumbv2";
import { CatSidebar } from "extends/vbdlis_faq/components/app/CatSidebar";
import { Headerv2 } from "extends/vbdlis_faq/components/app/Headerv2";
import SearchBarv2 from "extends/vbdlis_faq/components/app/SearchBarv2";
import { getListParentTopicByProjectId } from "extends/vbdlis_faq/components/app/Topic/ModifiedTopic";
import { TopicCard } from "extends/vbdlis_faq/components/app/Topic/TopicCard";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import { Topic } from "extends/vbdlis_faq/stores/TopicStore";
import Helper from "extends/vbdlis_faq/utils/Helper";
import { debounce } from "lodash";
import { inject, observer } from 'mobx-react';
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

type ProjectPageProps = {
    appStore: AppStore;
};
const ProjectPage: React.FC<ProjectPageProps> = ({
    appStore,
}) => {
    const { projectStore, topicStore, keywordStore, questionStore } = appStore.vbdlisFaqStore;
    const { projectId } = useParams<any>();
    const history = useHistory();
    useEffect(() => {
        projectStore.getProjects({ start: 0, count: 25 });
        topicStore.getTopics({});
        questionStore.getQuestions({});
    }, []);
    const handleChangeSearch = (value: string) => {
        keywordStore.setSearchKey(value);
        questionStore.getQuestionsFilter({ filterQuery: [`questionTitle:*${keywordStore.searchKey}* AND projectId:${projectId}`] });
    }
    const handleSubmitSearch = (e: React.SyntheticEvent) => {
        e.preventDefault();
        history.push(`${LINK.SEARCH_PAGE}?q=${keywordStore.searchKey}`);
    }
    return (
        <>
            <Container
                className="table-init relative mb-20"
                style={{ minHeight: '85vh' }}
            >
                <Headerv2 background>
                    <SearchBarv2
                        style={{ width: '40%' }}
                        vbdlisFaqStore={appStore.vbdlisFaqStore}
                        value={keywordStore.searchKey}
                        handleSearchChange={debounce(handleChangeSearch, 200)}
                        handleSubmit={handleSubmitSearch}
                    />
                </Headerv2>
                <Container className="container">
                    <BreadCrumbv2 vbdlisFaqStore={appStore.vbdlisFaqStore} />
                    <Flex
                        className="my-7"
                    >
                        <CatSidebar
                            data={projectStore?.projects}
                            style={{ width: '25%' }}
                            vbdlisFaqStore={appStore.vbdlisFaqStore}
                        />
                        <Container
                            width="75%"
                        >
                            <Container>
                                <HD6
                                    style={{ fontSize: '30px' }}
                                >
                                    {Helper.getStateById(projectStore.projects, projectId)?.projectName}
                                </HD6>
                            </Container>
                            {questionStore.questions && getListParentTopicByProjectId(topicStore.topics, Helper.getStateById(projectStore.projects, projectId)?.projectId).map((ele: Topic) => (
                                <TopicCard
                                    key={ele.Id}
                                    topicParent={ele}
                                    vbdlisFaqStore={appStore.vbdlisFaqStore}
                                    listTopicChild={Helper.getListTopicByParentId(topicStore.topics, ele.Id)}
                                />
                            ))}
                        </Container>
                    </Flex>
                </Container>
            </Container>
        </>
    );
};


export default inject('appStore')(observer(ProjectPage));
