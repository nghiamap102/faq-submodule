import { Container, FAIcon, Flex, Image } from '@vbd/vui';
import { LINK } from 'extends/vbdlis_faq/constant/LayerMetadata';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '../MenuItem';
import './SideBar.scss';
import logo from 'extends/vbdlis_faq/assets/image/logo.png';

type SideBarProps = {
    logo?: any;
    menu?: Menu[];
};
export interface Menu {
    name: string;
    icon: string;
    link?: string;
    method?: any[];
}
const SideBar: React.FC<SideBarProps> = ({
    logo,
    menu,
}) => {
    const [active, setActive] = useState(false);
    const sidebarCollapsed = localStorage.getItem('sidebar-collapsed');
    const [mode, setMode] = useState(sidebarCollapsed === 'true' ? true : false);
    const activeModeCollapse = () => {
        localStorage.setItem('sidebar-collapsed', (!mode).toString());
        setMode(!mode)
    }
    return (
        <>
            <Flex
                className={`sidebar ${mode && sidebarCollapsed === 'true' ? 'mode' : ''} ${active ? 'active' : ''}`}
                direction='col'
                onMouseEnter={() => mode && sidebarCollapsed === 'true' ? '' : setActive(true)}
                onMouseLeave={() => mode && sidebarCollapsed === 'true' ? '' : setActive(false)}
            >
                <Container className='sidebar-top'>
                    <Flex
                        className={`logo`}
                        justify="between"
                    >
                        <Container className='logo-wrapper'>
                            <Container className='logo-inner'>
                                {logo && (
                                    <Link to={`${LINK.ADMIN}`}>
                                        <Image
                                            src={logo}
                                            alt="Logo"
                                        />
                                    </Link>
                                )}
                            </Container>
                        </Container>
                        <Flex
                            className='mode-icon'
                            justify='center'
                            items='center'
                            onClick={activeModeCollapse}
                        >
                            {!mode &&
                                <FAIcon
                                    icon='angle-double-right'
                                    size="20px"
                                />
                            }
                            {mode &&
                                <FAIcon
                                    icon='angle-double-left'
                                    size="20px"
                                />
                            }
                        </Flex>
                    </Flex>
                    <Container
                        className='sidebar-group'
                    >
                        {menu?.map((ele: Menu) => (
                            <MenuItem
                                key={ele.name}
                                item={ele}
                                activeMethod={active || sidebarCollapsed === 'true'}
                                defaultItem={ele.name === 'home'}
                            />
                        ))}
                    </Container>
                </Container>
            </Flex>
        </>
    );
};


export default observer(SideBar)