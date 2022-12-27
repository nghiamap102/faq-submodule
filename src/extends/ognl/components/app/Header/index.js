import './Header.scss';

import { Container } from "@vbd/vui";
import { inject, observer } from "mobx-react";
import { useEffect, useLayoutEffect, useState } from "react";
import Banner from "./Banner";
import Menu from "./Menu";
import moment from 'moment';
import configData from "extends/ognl/data/sample.config.json";

let Header = (props) => {
    const { ognlStore } = props;
    const { configurationStore } = ognlStore;
    // const { config: { header } } = ognlStore;
    const [currentTime, setCurrentTime] = useState('');
    const [header, setHeader] = useState(configData.header);

    useLayoutEffect(() => {
        const { config: { header } } = configurationStore;
        if (header) setHeader(header);
    }, [configurationStore.config]);

    useEffect(() => {
        setInterval(() => { setCurrentTime(moment().format("DD/MM/YYYY hh:mm:ss A")) }, 1000);
    }, []);

    return (
        <Container className={`header-container ${header.config.width}`}>
            <Container className='header fixedwidth'>
                {header.banner && <Banner src={header?.banner?.src || ""} />}
                {header.menu && <Menu items={header.menu} />}
                <Container className="thong-bao">
                    <Container>{currentTime}</Container>
                </Container>
            </Container>
        </Container>
    );
}
Header = inject('ognlStore')(observer(Header));
export default Header;