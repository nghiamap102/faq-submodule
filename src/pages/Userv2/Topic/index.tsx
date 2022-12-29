import { Container, Flex, HD6 } from "@vbd/vui";
import AppStore from "components/app/stores/AppStore";
import { BreadCrumbv2 } from "extends/vbdlis_faq/components/app/BreadCrumbv2";
import { CatSidebar } from "extends/vbdlis_faq/components/app/CatSidebar";
import { Headerv2 } from "extends/vbdlis_faq/components/app/Headerv2";
import SearchBarv2 from "extends/vbdlis_faq/components/app/SearchBarv2";
import { TopicCard } from "extends/vbdlis_faq/components/app/Topic/TopicCard";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import Helper from "extends/vbdlis_faq/utils/Helper";
import { debounce } from "lodash";
import { inject, observer } from 'mobx-react';
import React, { useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

type TopicPageProps = {
    appStore: AppStore;
};
const TopicPage: React.FC<TopicPageProps> = ({
    appStore,
}) => {
    const { projectStore, topicStore, questionStore, keywordStore } = appStore.vbdlisFaqStore;
    const { topicId } = useParams<any>();
    const history = useHistory();
    const { search } = useLocation();
    const param = new URLSearchParams(search);
    useEffect(() => {
        projectStore.getProjects({ start: 0, count: 25 });
        topicStore.getTopics({});
        questionStore.getQuestions({});
    }, []);
    const handleChangeSearch = (value: string) => {
        keywordStore.setSearchKey(value);
        questionStore.getQuestionsFilter({ filterQuery: [`questionTitle:*${keywordStore.searchKey}* AND projectId:${param.get('projectId')}`] });
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
                        handleSearchChange={debounce(handleChangeSearch, 200)}
                        handleSubmit={handleSubmitSearch}
                        value={keywordStore.searchKey}
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
                                <HD6 style={{ fontSize: '24px' }}>{Helper.getStateById(topicStore.topics, topicId)?.topicTitle}</HD6>
                            </Container>
                            {questionStore.questions && (
                                <TopicCard
                                    vbdlisFaqStore={appStore.vbdlisFaqStore}
                                    listTopicChild={Helper.getListTopicChildByProjectIdChar(topicStore.topics, Helper.getStateById(projectStore.projects, param.get('projectId'))?.projectId)}
                                />
                            )}
                        </Container>
                    </Flex>
                </Container>
            </Container>
        </>
    );
};



export default inject('appStore')(observer(TopicPage));
