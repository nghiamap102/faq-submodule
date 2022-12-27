import { Container, FAIcon, Flex, HD6, T } from "@vbd/vui";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import React, { useState } from "react";
import { Link, matchPath, useHistory, useLocation } from "react-router-dom";
import { Menu } from "../Sidebar";
import './MenuItem.scss';
type MenuItemProps = {
    item: Menu;
    activeMethod?: boolean;
    defaultItem?: boolean;
};
export const MenuItem: React.FC<MenuItemProps> = ({
    item,
    activeMethod,
    defaultItem
}) => {
    const history = useHistory();
    const location = useLocation()
    const itemMenuActive = localStorage.getItem(`item-menu-active-${item.name}`)
    const [activeChild, setActiveChild] = useState(itemMenuActive ? true : false);
    const handleClickMenuRoot = () => {
        if (item.method) setActiveChild(!activeChild);
        !activeChild ? localStorage.setItem(`item-menu-active-${item.name}`, JSON.stringify(item)) : localStorage.removeItem(`item-menu-active-${item.name}`);
        if (!item.method && item.link) history.push(`${LINK.ADMIN}/${item.link}`);
        if (!item.method && !item.link) history.push(`${LINK.ADMIN}/${item.name}`);
    }
    return (
        <>
            <Container >
                <Flex
                    items="center"
                    justify="between"
                    className={`menu-item group ${matchPath(location.pathname, `${LINK.ADMIN}/${item.link ? item.link : item.name}`) || defaultItem && location.pathname === LINK.ADMIN ? "active-bg" : ""}`}
                    onClick={handleClickMenuRoot}
                >
                    <Flex>
                        <Container className='icon'>
                            <FAIcon
                                size="20px"
                                icon={item.icon}
                            />
                        </Container>
                        <HD6><T>{item.name}</T></HD6>
                    </Flex>
                    {!activeChild && item.method && (
                        <FAIcon
                            icon="angle-right"
                        />
                    )}
                    {activeChild && item.method && (
                        <FAIcon
                            icon="angle-down"
                        />
                    )}
                </Flex>
                <Container
                    className={`method_container ${activeChild && activeMethod && item.method ? 'expand' : 'non-expand'}`}
                >
                    {item.method?.map((ele) => (
                        <Link
                            key={ele}
                            to={`${LINK.ADMIN}/${item.name}/${ele}`}
                            className="link"
                        >
                            <Container
                                className={`link group method_item ${matchPath(location.pathname, `${LINK.ADMIN}/${item.name}/${ele}`) ? 'method_item_active' : ''}`}
                            >
                                <HD6><T>{ele}</T></HD6>
                            </Container>
                        </Link>
                    ))}
                </Container>
            </Container>
        </>
    );
};