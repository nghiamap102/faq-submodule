import './Footer.scss';

import { Column, Container, PanelBody, PanelHeader, Row } from "@vbd/vui";
import { inject, observer } from "mobx-react";
import { useState, useLayoutEffect } from 'react';
import configData from "extends/ognl/data/sample.config.json";

let Footer = (props) => {
    const { ognlStore } = props;
    const { configurationStore } = ognlStore;
    // const { config: { footer } } = ognlStore;
    // const { config, components } = footer;
    const [footer, setFooter] = useState(configData.footer);

    useLayoutEffect(() => {
        const { config: { footer } } = configurationStore;
        if (footer) setFooter(footer);
    }, [configurationStore.config]);

    const buildFooter = () => {
        const width = 100 / footer.components.length;
        return footer.components.map((item) => (
            <Column key={footer.components.indexOf(item)}>
                <Container width={`${width}%`}>
                    {item.title && <PanelHeader>{item.title}</PanelHeader>}
                    {item.content && <PanelBody><div dangerouslySetInnerHTML={{ __html: item.content }} /></PanelBody>}
                </Container>
            </Column>
        ));
    }

    return (
        <Container className={`footer-container ${footer.config.width}`} >
            <Row className='footer fixedwidth'>
                {buildFooter()}
            </Row>
        </Container >
    );
}
Footer = inject('ognlStore')(observer(Footer));
export default Footer;