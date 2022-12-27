import { Drawer, FeatureItem, Flex, HD6, NavigationMenu, Positioned } from '@vbd/vui';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Drawer.scss';


interface DrawerCustomProps {
    title?: string;
    menu?: any[];
}


const DrawerCustom: React.FC<DrawerCustomProps> = ({
    title,
    menu,
}) => {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    return (
        <>
            <Positioned
                top={10}
                left={10}
            >
                <Flex justify='center' items='center'>
                    <FeatureItem
                        icon="bars"
                        onClick={() => setIsOpenDrawer(!isOpenDrawer)}
                        className="items"
                    />
                    <Link to="/"><HD6 style={{ fontSize: '20px', color: 'var(--bg-color-primary5)' }}>{title}</HD6></Link>
                </Flex>
            </Positioned>

            {isOpenDrawer && (
                <Drawer
                    animationIn="slideInLeft"
                    animationOut="slideOutLeft"
                    scroll
                    onClose={() => setIsOpenDrawer(false)}
                >
                    <NavigationMenu
                        menus={menu}
                    />
                </Drawer>)}
        </>
    );
};
export default DrawerCustom;