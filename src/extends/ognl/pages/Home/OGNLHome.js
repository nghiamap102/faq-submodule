import 'extends/ognl/pages/Home/OGNLHome.scss';

import { Container } from '@vbd/vui';
import withTracker from 'components/app/Tenant/withTracker';
import OGNLStore from 'extends/ognl/OGNLStore';
import * as Routers from 'extends/ognl/ONGLRoute';
import { inject, Provider } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { lazy, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router';
import { useRouteMatch } from 'react-router-dom';

let OGNLHome = (props) =>
{
    const { path } = useRouteMatch();
    const { appStore } = props;
    const ognlStore = new OGNLStore(appStore);
    const { configurationStore } = ognlStore;

    useLayoutEffect(() =>
    {
        const initConfig = async () =>
        {
            const config = await configurationStore.loadConfig();
            configurationStore.setConfig(config);
        };
        initConfig();
    }, []);

    return (
        <>
            <Provider ognlStore={ognlStore}>
                <Helmet>
                    <title>Cổng thông tin quốc gia</title>
                </Helmet>
                <Container className="front-container">
                    <Switch>
                        <Route
                            key="home"
                            path={path}
                            component={withTracker(lazy(() => import('extends/ognl/pages/Home/layouts/HomepageLayout')))}
                            exact
                        />

                        <Route
                            key="post"
                            path={`${Routers.POST_DETAIL}/:id`}
                            component={withTracker(lazy(() => import('extends/ognl/pages/Home/layouts/PostLayout')))}
                        />

                        <Route
                            key="posts"
                            path={Routers.POSTS_DETAIL}
                            component={withTracker(lazy(() => import('extends/ognl/pages/Home/layouts/PostsLayout')))}
                        />

                        <Route
                            key="video-gallery"
                            path={`${Routers.PAGE_DETAIL}/video-gallery`}
                            component={withTracker(lazy(() => import('extends/ognl/pages/Home/layouts/PageLayout/VideoGallery')))}
                        />

                        <Route
                            key="image-gallery"
                            path={`${Routers.PAGE_DETAIL}/image-gallery`}
                            component={withTracker(lazy(() => import('extends/ognl/pages/Home/layouts/PageLayout/ImageGallery')))}
                        />

                    </Switch>
                </Container>
            </Provider>
        </>
    );
};
OGNLHome = inject('appStore')(observer(OGNLHome));
export default OGNLHome;
