import 'extends/ffms/theme/mode-theme.scss';
import 'extends/ffms/theme/theme.scss';

import { Container } from '@vbd/vui';
import PrivateRoute from 'components/app/Authentication/PrivateRoute';
import AppStore from 'components/app/stores/AppStore';
import withTracker from 'components/app/Tenant/withTracker';
import Sidebar from 'extends/vbdlis_faq/components/app/Sidebar';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { inject, Provider } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { lazy } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, useRouteMatch } from 'react-router-dom';
import './Admin.scss';
import logo from 'extends/vbdlis_faq/assets/image/logo.png';
interface AdminProps {
    appStore: AppStore;
}
const menu = [
    {
        name: 'home',
        link: 'stats',
        icon: 'chart-area',
    },
    {
        icon: 'folder',
        name: 'project',
    },
    {
        name: 'topic',
        icon: 'lightbulb',
    },
    {
        name: 'question',
        method: ["list", "create"],
        icon: 'question',
    },
    {
        name: 'feedback',
        icon: 'comment-dots',
    },
];
let Admin = (props: AdminProps): JSX.Element => {
    const vbdlisStore = new VBDLISFAQStore(props.appStore);
    const { path } = useRouteMatch();
    return (
        <Provider vbdlisFaqStore={vbdlisStore}>
            <Helmet>
                <title>Quản trị hệ thống - Câu hỏi thường gặp</title>
            </Helmet>
            <Container
                className="flex full-height hid_scroll"
                style={{ backgroundColor: 'white', overflow: 'auto' }}
            >
                <Sidebar
                    menu={menu}
                    logo={logo}
                />
                <Container style={{ width: '100%' }}>
                    <Switch>
                        <PrivateRoute
                            key={'admin'}
                            path={`${path}`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/Admin/Statistic'
                                        ),
                                ),
                            )}
                            exact
                        />
                        <PrivateRoute
                            key={'admin'}
                            path={`${path}/stats`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/Admin/Statistic'
                                        ),
                                ),
                            )}
                            exact
                        />
                        <PrivateRoute
                            key={'project'}
                            path={`${path}/project`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/Admin/Project'
                                        ),
                                ),
                            )}
                        />
                        <PrivateRoute
                            key={'topic'}
                            path={`${path}/topic`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/Admin/Topic'
                                        ),
                                ),
                            )}
                        />
                        <PrivateRoute
                            key={'questionCreate'}
                            path={`${path}/question/list`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/Admin/Question'
                                        ),
                                ),
                            )}
                        />
                        <PrivateRoute
                            key={'questionCreate'}
                            path={`${path}/question/create`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/Admin/Question/CreateQuestion'
                                        ),
                                ),
                            )}
                        />
                        <PrivateRoute
                            key={'question'}
                            path={`${path}/feedback`}
                            component={withTracker(
                                lazy(
                                    () =>
                                        import(
                                            'extends/vbdlis_faq/pages/Admin/Feedback'
                                        ),
                                ),
                            )}
                        />
                    </Switch>
                </Container>
            </Container>
        </Provider>
    );
};
Admin = inject('appStore')(observer(Admin));
export default Admin;
