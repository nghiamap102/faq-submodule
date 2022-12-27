import { Container, Flex, HD6 } from "@vbd/vui";
import AppStore from "components/app/stores/AppStore";
import { BreadCrumbv2 } from "extends/vbdlis_faq/components/app/BreadCrumbv2";
import { Headerv2 } from "extends/vbdlis_faq/components/app/Headerv2";
import SearchBarv2 from "extends/vbdlis_faq/components/app/SearchBarv2";
import { SearchItem } from "extends/vbdlis_faq/components/app/SearchItem";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import Helper from "extends/vbdlis_faq/utils/Helper";
import { debounce } from "lodash";
import { inject, observer } from 'mobx-react';
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

type SearchPageProps = {
    appStore: AppStore;
};
const SearchPage: React.FC<SearchPageProps> = ({ appStore }) => {
    const { projectStore, topicStore, questionStore, keywordStore } = appStore.vbdlisFaqStore;
    const { search } = useLocation();
    const history = useHistory();
    const param = new URLSearchParams(search);
    const keyword = param.get('q');
    useEffect(() => {
        projectStore.getProjects({ start: 0, count: 25 });
        topicStore.getTopics({});
        questionStore.getQuestions({ filterQuery: [`questionTitle:*${keyword}*`] });
        keywordStore.setSearchKey(keyword);
    }, []);

    const handleChangeSearch = (value: string) => {
        keywordStore.setSearchKey(value);
        questionStore.getQuestionsFilter({ filterQuery: [`questionTitle : *${keywordStore.searchKey}*`] });
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
                        <Container
                            width="70%"
                            className="pb-14"
                            style={{ margin: "0 auto" }}
                        >
                            <Container className="mb-10" >
                                <HD6
                                    className="heading"
                                    style={{ color: 'black' }}
                                >
                                    {questionStore.questions.length} kết quả cho từ khóa {`"${keyword}"`}
                                </HD6>
                            </Container>
                            {questionStore.questions.map((ele => (
                                <SearchItem
                                    key={ele.Id}
                                    link={`question?projectId=${Helper.getStateById(projectStore.projects, ele.projectId).projectId}&topicId=${ele.topicId}`}
                                    title={ele.questionTitle}
                                />
                            )))}
                        </Container>
                    </Flex>
                </Container>
            </Container>
        </>
    );
};

export default inject('appStore')(observer(SearchPage));
