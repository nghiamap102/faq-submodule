import './AdminPage.scss';

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import {
    Container,
    Ul, Li,
    FAIcon,
    T,
    Input,
    FormControlLabel, FormGroup,
} from '@vbd/vui';

class AdminPageMenu extends Component
{
    adminPageStore = this.props.appStore.adminPageStore;

    handleMenuClick = (menu) =>
    {
        menu.isCollapse = !menu.isCollapse;
    };

    handleMenuSearch = (key) =>
    {
        this.adminPageStore.setMenuSearchKey(key);
        this.forceUpdate();
    };

    render()
    {
        const { menus, menuSearchKey } = this.adminPageStore;

        return (
            <Container className={'menu'}>
                <FormGroup>
                    <FormControlLabel
                        control={(
                            <Input
                                placeholder={'Tìm kiếm'}
                                value={menuSearchKey}
                                onChange={(event) =>
                                {
                                    this.handleMenuSearch(event);
                                }}
                            />
                        )}
                    />
                </FormGroup>

                <Ul className={'nav-menu menu-item menu-parent'}>
                    {menus.filter((m) => !m.isNotShow).map((m, index) => (
                        <React.Fragment key={index}>
                            <Li
                                key={m.code}
                                className={'menu-item menu-item-parent'}
                                id={m.code}
                                onClick={() => this.handleMenuClick(m)}
                            >
                                <FAIcon
                                    size={'1.25rem'}
                                    className={m.icon}
                                /> <T>{m.name}</T>
                            </Li>

                            {!m.isCollapse && Array.isArray(m.children) && m.children.filter((c) => !c.isNotShow).map((c) => (
                                <Li
                                    key={c.code}
                                    id={c.code}
                                >
                                    <NavLink
                                        to={`/admin/${c.code}`}
                                        activeClassName="menu-activate"
                                        className="menu-item menu-item-children"
                                    >
                                        <FAIcon
                                            size={'20px'}
                                            className={c.icon}
                                        />
                                        <T>{c.name}</T>
                                    </NavLink>
                                </Li>
                            ))}
                        </React.Fragment>
                    ))}
                </Ul>
            </Container>
        );
    }
}

AdminPageMenu = inject('appStore')(observer(AdminPageMenu));
export default AdminPageMenu;
