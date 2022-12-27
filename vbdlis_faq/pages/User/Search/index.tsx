import { Container } from "@vbd/vui";
import AppStore from "components/app/stores/AppStore";
import BreadCrumb from "extends/vbdlis_faq/components/app/BreadCrumb";
import Card from "extends/vbdlis_faq/components/app/Card";
import Header from "extends/vbdlis_faq/components/app/Header";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import { Question } from "extends/vbdlis_faq/stores/QuestionStore";
import Helper from "extends/vbdlis_faq/utils/Helper";
import Validation from "extends/vbdlis_faq/utils/Validation";
import { inject, observer } from "mobx-react";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SearchPageProps = {
    appStore?: AppStore;
};
const SearchPage: React.FC<SearchPageProps> = (props: SearchPageProps) => {
    const { vbdlisFaqStore } = props.appStore;
    const { keywordStore, projectStore, topicStore, questionStore } = vbdlisFaqStore;
    const { search } = useLocation();
    useEffect(() => {
        keywordStore.setSearchKey(new URLSearchParams(search).get("q"));
        topicStore.getTopics();
        questionStore.getQuestions({ filterQuery: [`questionTitle : *${keywordStore.searchKey}*`] });
        projectStore.getProjects();
    }, []);

    return (
        <>
            <Container className="container-init">
                <Header
                    vbdlisFaqStore={vbdlisFaqStore}
                    searchBar
                />
                <Container className="mt-7rem">
                    <Container style={{ width: '90%', margin: '0 auto' }}>
                        <BreadCrumb vbdlisFaqStore={vbdlisFaqStore} mode />
                        <Container style={{ width: '60%', margin: '0 auto', padding: '2rem ' }}>
                            {Validation.isNotEmptyArray(questionStore.questions) && questionStore.questions.map((ele: Question, index: number) => (
                                <Card
                                    key={ele.Id}
                                    linkTo={`${LINK.PROJECT}/${Helper.getStateById(projectStore.projects, ele.projectId).projectId}/topic/${ele.topicId}?id=${ele.projectId}`}
                                    title={ele.questionTitle}
                                    description={ele.questionContent?.slice(0, 100)}
                                    tag={[{ project: `${Helper.getStateById(projectStore.projects, ele.projectId).projectName}`, topic: `${Helper.getStateById(topicStore.topics, ele.topicId).topicTitle}` }]}
                                />
                            ))}
                            {!Validation.isNotEmptyArray(questionStore.questions) && (
                                <Container>
                                    Không tìm thấy dữ liệu
                                </Container>
                            )}
                        </Container>
                    </Container>
                </Container>
            </Container>
        </>
    );
};

export default inject('appStore')(observer(SearchPage));