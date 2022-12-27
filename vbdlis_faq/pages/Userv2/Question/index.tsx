import { Container, Flex, HD6, Popup } from "@vbd/vui";
import AppStore from "components/app/stores/AppStore";
import { BreadCrumbv2 } from "extends/vbdlis_faq/components/app/BreadCrumbv2";
import { CatSidebar } from "extends/vbdlis_faq/components/app/CatSidebar";
import { Headerv2 } from "extends/vbdlis_faq/components/app/Headerv2";
import Preview from "extends/vbdlis_faq/components/app/Preview";
import ModifiedQuestion from "extends/vbdlis_faq/components/app/Question/ModifiedQuestion";
import { MoreQuestion } from "extends/vbdlis_faq/components/app/Question/MoreQuestion";
import Ratingv2 from "extends/vbdlis_faq/components/app/Ratingv2";
import SearchBarv2 from "extends/vbdlis_faq/components/app/SearchBarv2";
import { SuggestionQuestion } from "extends/vbdlis_faq/components/app/Topic/SuggestionTopic";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import Helper from "extends/vbdlis_faq/utils/Helper";
import { debounce } from "lodash";
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

type QuestionPageProps = {
    appStore: AppStore;
};
const QuestionPage: React.FC<QuestionPageProps> = ({ appStore }) => {
    const { projectStore, topicStore, questionStore, keywordStore } = appStore.vbdlisFaqStore;
    const { search } = useLocation();
    const { questionId } = useParams<any>()
    const history = useHistory();
    const [isOpenPopupQuestion, setIsOpenPopupQuestion] = useState<boolean>(false);
    useEffect(() => {
        projectStore.getProjects({ start: 0, count: 25 });
        topicStore.getTopics({});
        questionStore.getQuestions({});
    }, []);
    const question = Helper.getStateById(questionStore.questions, questionId);
    const handleChangeSearch = (value: string) => {
        keywordStore.setSearchKey(value);
        questionStore.getQuestionsFilter({ filterQuery: [`questionTitle:*${keywordStore.searchKey}* AND projectId:${question?.projectId}`] });
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
                            style={{ width: '20%' }}
                            vbdlisFaqStore={appStore.vbdlisFaqStore}
                        />
                        <Container
                            width="50%"
                            className="pb-14"
                        >
                            {question && (
                                <Container
                                    className="mb-7"
                                >
                                    <Container className="mb-5">
                                        <HD6 style={{ fontSize: '26px', textTransform: 'capitalize' }}>{question?.questionTitle}</HD6>
                                    </Container>
                                    <Preview content={question?.questionContent} />
                                </Container>
                            )}
                            <Ratingv2 />
                            <MoreQuestion
                                onClick={() => setIsOpenPopupQuestion(true)}
                            />
                            {isOpenPopupQuestion && (
                                <Popup
                                    title="Gửi câu hỏi"
                                    onClose={() => setIsOpenPopupQuestion(false)}
                                >
                                    <ModifiedQuestion vbdlisFaqStore={appStore.vbdlisFaqStore} />
                                </Popup>
                            )}
                        </Container>
                        <Container width="30%">
                            <SuggestionQuestion
                                vbdlisFaqStore={appStore.vbdlisFaqStore}
                                listQuestion={Helper.getQuestionByProjectIdAndTopicId(questionStore.questions, question?.projectId, question?.topicId)}
                                listTopicChild={Helper.getListTopicChildByProjectIdChar(topicStore.topics, Helper.getStateById(projectStore.projects, question?.projectId)?.projectId)}
                            />
                        </Container>
                    </Flex>
                </Container>
            </Container>
        </>
    );
};



export default inject('appStore')(observer(QuestionPage));
