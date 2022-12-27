import { Container, HD6 } from "@vbd/vui";
import AppStore from "components/app/stores/AppStore";
import BreadCrumb from "extends/vbdlis_faq/components/app/BreadCrumb";
import Collapse from "extends/vbdlis_faq/components/app/Collapse";
import Header from "extends/vbdlis_faq/components/app/Header";
import SearchBar from 'extends/vbdlis_faq/components/app/SearchBar';
import SearchContainer from 'extends/vbdlis_faq/components/app/SearchContainer';
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import Helper from "extends/vbdlis_faq/utils/Helper";
import { debounce } from "lodash";
import { inject, observer } from "mobx-react";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
type ProjectDetailProps = {
    appStore?: AppStore;

};
const ProjectDetail: React.FC<ProjectDetailProps> = ({
    appStore,
}) => {
    const { vbdlisFaqStore } = appStore;
    const { projectStore, topicStore, keywordStore, questionStore } = vbdlisFaqStore;
    const { projectId } = useParams<any>();
    const history = useHistory();
    useEffect(() => {
        let isInit = false;
        if (!isInit) {
            projectStore.getProjects({ start: 0, count: 25 });
            topicStore.getTopics({});
        }
        return () => {
            isInit = true;
        };
    }, []);
    const handleChangeSearch = (value: string) => {
        keywordStore.setSearchKey(value);
        questionStore.getQuestionsFilter({ filterQuery: [`questionTitle : *${keywordStore.searchKey}*`] });
    }
    const handleSubmitSearch = (e: React.SyntheticEvent) => {
        e.preventDefault();
        history.push(`${LINK.SEARCH}?q=${keywordStore.searchKey}`);
    }
    const renderTopics = () => {
        const newArr = topicStore?.topics?.filter((ele: any) => {
            if (ele.projectId === projectId) return ele;
        })
        return newArr;
    }
    return (
        <>
            <Container className="container-init">
                <Header vbdlisFaqStore={vbdlisFaqStore} />
                <Container className="mt-7rem">
                    <SearchContainer>
                        <SearchBar
                            value={keywordStore.searchKey}
                            handleSearchChange={debounce(handleChangeSearch, 200)}
                            handleSubmit={handleSubmitSearch}
                            style={{ width: '37%' }}
                            vbdlisFaqStore={vbdlisFaqStore}
                        />
                    </SearchContainer>

                    <Container style={{ width: '40%', margin: '0 auto' }}>
                        <BreadCrumb vbdlisFaqStore={vbdlisFaqStore} mode={false} />
                        <HD6>{Helper.getProjectByProjectId(projectStore.projects, projectId).projectName}</HD6>
                        <Collapse
                            projects={projectStore.projects}
                            data={renderTopics()}
                        />
                    </Container>
                </Container>
            </Container>
        </>
    );
};
export default inject('appStore')(observer(ProjectDetail));
