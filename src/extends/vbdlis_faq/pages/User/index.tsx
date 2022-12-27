import 'extends/ognl/pages/Home/OGNLHome.scss';

import { Container } from '@vbd/vui';
import withTracker from 'components/app/Tenant/withTracker';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { inject, Provider } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { lazy } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import './User.scss';
let Home = (props) => {
    const { appStore } = props;
    const vbdlisFaqStore = new VBDLISFAQStore(appStore);
    const { path } = useRouteMatch();
    return (
        <>
            <Provider vbdlisFaqStore={vbdlisFaqStore}>
                <Helmet>
                    <title>Câu hỏi thường gặp</title>
                </Helmet>
                <Container
                    className="flex full-height"
                    style={{ backgroundColor: 'var(--base-color)' }}
                >
                    <Switch>
                        <Route
                            key={'home'}
                            path={`${path}`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/User/Home/HomeContainer'
                                        ),
                                ),
                            )}
                            exact
                        />
                        <Route
                            key={'search'}
                            path={`${path}/search`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/User/Search'
                                        ),
                                ),
                            )}
                            exact
                        />
                        <Route
                            key={'projectDetail'}
                            path={`${path}/project/:projectId`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/User/Project'
                                        ),
                                ),
                            )}
                            exact
                        />
                        <Route
                            key={'topicDetail'}
                            path={`${path}/project/:projectId/topic/:topicId`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/User/Topic'
                                        ),
                                ),
                            )}
                            exact
                        />

                    </Switch>
                </Container>

            </Provider>
        </>
    );
};
Home = inject('appStore')(observer(Home));
export default Home;
