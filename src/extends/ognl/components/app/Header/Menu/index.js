import { Container, MenuItem } from "@vbd/vui";
import { OGNL_HOME } from "extends/ognl/ONGLRoute";
import { inject, observer } from "mobx-react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

let Menu = (props) => {
    const { items } = props;
    const [selectMenu, setSelectMenu] = useState('trang-chu');
    const history = useHistory();


    const handleMenuChange = (e) => {
        setSelectMenu(e.key);
        history.push(`${OGNL_HOME}/${e.href}`);

    }

    const buildMenuItems = (menus, type) => {
        let lstMenuItems = [];
        if (menus) {
            menus.forEach((m) => {
                if (m.type === 'menu-item') {

                    lstMenuItems.push(
                        <MenuItem
                            type={type}
                            key={m.key}
                            id={m.key}
                            active={selectMenu === m.key}
                            onClick={() => { handleMenuChange(m) }}>
                            {m.title}
                        </MenuItem>
                    )
                }
            });
        }
        return lstMenuItems;
    }

    return (
        <Container className="menu">
            <div className={'nav-container'}>
                <ul className={'nav-menu horizontal'}>
                    {
                        items && buildMenuItems(items, 'item')
                    }
                </ul>
            </div>
        </Container>
    );
}
Menu = inject('ognlStore')(observer(Menu));
export default Menu;
