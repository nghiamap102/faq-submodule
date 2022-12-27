import { Container } from '@vbd/vui';
import withTracker from 'components/app/Tenant/withTracker';
import { Lisence } from 'extends/vbdlis_faq/components/app/Lisence';
import Toolbar from 'extends/vbdlis_faq/components/app/Toolbar';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { inject, Provider } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { lazy } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { AuthService } from 'services/auth.service';
import './User.scss';
let Home = (props: any) => {
    const { appStore } = props;
    const auth = new AuthService()
    const vbdlisFaqStore = new VBDLISFAQStore(appStore);
    const { path } = useRouteMatch();
    return (
        <>
            <Provider vbdlisFaqStore={vbdlisFaqStore}>
                <Helmet>
                    <title>Câu hỏi thường gặp</title>
                </Helmet>
                <Container
                    className="full-height hid_scroll"
                    style={{ overflow: 'auto' }}
                >
                    <Toolbar appStore={appStore} />
                    <Container>
                        <Switch>
                            <Route
                                key={'home'}
                                path={`${path}`}
                                component={withTracker(
                                    lazy(
                                        () =>
                                            import(
                                                'extends/vbdlis_faq/pages/Userv2/Home'
                                            ),
                                    ),
                                )}
                                exact
                            />
                            <Route
                                key={'project'}
                                path={`${path}/project/:projectId`}
                                component={withTracker(
                                    lazy(
                                        () =>
                                            import(
                                                'extends/vbdlis_faq/pages/Userv2/Project'
                                            ),
                                    ),
                                )}
                                exact
                            />
                            <Route
                                key={'topic'}
                                path={`${path}/topic/:topicId`}
                                component={withTracker(
                                    lazy(
                                        () =>
                                            import(
                                                'extends/vbdlis_faq/pages/Userv2/Topic'
                                            ),
                                    ),
                                )}
                                exact
                            />
                            <Route
                                key={'topicDetail'}
                                path={`${path}/topic-detail/:topicChildId`}
                                component={withTracker(
                                    lazy(
                                        () =>
                                            import(
                                                'extends/vbdlis_faq/pages/Userv2/TopicDetail'
                                            ),
                                    ),
                                )}
                                exact
                            />
                            <Route
                                key={'question'}
                                path={`${path}/question/:questionId`}
                                component={withTracker(
                                    lazy(
                                        () =>
                                            import(
                                                'extends/vbdlis_faq/pages/Userv2/Question'
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
                                                'extends/vbdlis_faq/pages/Userv2/Search'
                                            ),
                                    ),
                                )}
                                exact
                            />
                        </Switch>
                    </Container>
                    <Lisence />
                </Container>
            </Provider>
        </>
    );
};
Home = inject('appStore')(observer(Home));
export default Home;
