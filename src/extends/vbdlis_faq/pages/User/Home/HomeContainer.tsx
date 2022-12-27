import { Container, Link, T } from '@vbd/vui';
import AppStore from 'components/app/stores/AppStore';
import Header from 'extends/vbdlis_faq/components/app/Header';
import ProjectGridContainer from 'extends/vbdlis_faq/components/app/Project/ProjectGridContainer';
import SearchBar from 'extends/vbdlis_faq/components/app/SearchBar';
import SearchContainer from 'extends/vbdlis_faq/components/app/SearchContainer';
import { debounce } from 'lodash';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
interface HomeContainerProps
{
    appStore?: AppStore;
}
const HomeContainer = (props: HomeContainerProps) =>
{
    const { vbdlisFaqStore } = props?.appStore;
    const { projectStore, topicStore, keywordStore, questionStore } = vbdlisFaqStore;
    const history = useHistory();
    const { path } = useRouteMatch();
    useEffect(() =>
    {
        let isInit = false;
        if (!isInit)
        {
            projectStore.getProjects({ start: 0, count: 25 });
            topicStore.getTopics();
        }
        return () =>
        {
            isInit = true;
        };
    }, []);

    const handleChangeSearch = (value: string) =>
    {
        keywordStore.setSearchKey(value);
        questionStore.getQuestionsFilter({ filterQuery: [`questionTitle : *${keywordStore.searchKey}*`] });
    }
    const handleSubmitSearch = (e: React.SyntheticEvent) =>
    {
        e.preventDefault();
        history.push(`${path}/search?q=${keywordStore.searchKey}`);
    }

    return (
        <>
            <Container className='container-init'>
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

                    <Container className='portal-in4'>
                        <Link
                            className='btn-link'
                            href='http://maps.vietbando.com/maps'
                            target="_blank"
                        >
                            <T>Xem Thêm Về VBD</T>
                        </Link>
                    </Container>

                    <ProjectGridContainer
                        store={projectStore}
                    />
                </Container>

            </Container>
        </>
    );
};

export default inject('appStore')(observer(HomeContainer));
