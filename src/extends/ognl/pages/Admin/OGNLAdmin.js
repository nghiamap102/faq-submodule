import 'extends/ffms/theme/theme.scss';
import 'extends/ffms/theme/mode-theme.scss';

import { Container } from "@vbd/vui";
import { Provider } from "mobx-react";
import { observer } from "mobx-react-lite";
import SideFeature from './SideFeature';
import { Helmet } from 'react-helmet';
import OGNLStore from 'extends/ognl/OGNLStore';

let OGNLAdmin = (props) => {
    return (
        <Provider ognlStore={new OGNLStore()}>
            <Helmet>
                <title>Quản trị hệ thống - Cổng thông tin quốc gia</title>
            </Helmet>
            <Container className="flex full-height">
                <SideFeature />
            </Container>
        </Provider>
    );
}
OGNLAdmin = observer(OGNLAdmin);
export default OGNLAdmin;