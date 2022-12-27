import { Container, Flex } from '@vbd/vui';
import AppStore from 'components/app/stores/AppStore';
import { Banner } from 'extends/vbdlis_faq/components/app/Banner';
import { Footer } from 'extends/vbdlis_faq/components/app/Footer';
import { Headerv2 } from 'extends/vbdlis_faq/components/app/Headerv2';
import { ProjectContainerv2 } from 'extends/vbdlis_faq/components/app/Project/ProjectContainerv2';
import SearchBarv2 from 'extends/vbdlis_faq/components/app/SearchBarv2';
import { LINK } from 'extends/vbdlis_faq/constant/LayerMetadata';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

interface HomePageProps {
    appStore: AppStore;
}
const HomePage: React.FC<HomePageProps> = ({ appStore }) => {
    const { projectStore, topicStore, keywordStore, questionStore } = appStore.vbdlisFaqStore;
    const history = useHistory();
    useEffect(() => {
        projectStore.getProjects({ start: 0, count: 25 });
        topicStore.getTopics({});
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
            <Flex
                className='table-init'
                justify='between'
                direction='col'
            >
                <Banner>
                    <Headerv2 />
                    <SearchBarv2
                        style={{ width: '40%' }}
                        vbdlisFaqStore={appStore.vbdlisFaqStore}
                        value={keywordStore.searchKey}
                        handleSearchChange={debounce(handleChangeSearch, 200)}
                        handleSubmit={handleSubmitSearch}
                    />
                </Banner>
                <ProjectContainerv2
                    projects={projectStore.projects}
                    topics={topicStore.topics}
                    vbdlisFaqStore={appStore.vbdlisFaqStore}
                />
                <Footer vbdlisFaqStore={appStore.vbdlisFaqStore} />
            </Flex>
        </>
    );
};

export default inject('appStore')(observer(HomePage));
