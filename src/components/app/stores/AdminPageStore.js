import { decorate, observable } from 'mobx';
import { action } from '@storybook/addon-actions';

const MENU_DATA = [
    {
        code: 'system',
        name: 'Quản trị',
        icon: 'fal fa-cogs',
        children: [
            {
                code: 'user',
                name: 'Người dùng',
                icon: '',
            },
        ],
    },
    {
        code: 'system',
        name: 'Giám sát',
        icon: 'fal fa-cogs',
        children: [
            {
                code: 'camera-monitoring',
                name: 'Giám sát Camera',
                icon: '',
            },
            {
                code: 'device-signal-monitoring',
                name: 'Giám sát thiết bị',
                icon: '',
            },
        ],
    },
    {
        code: 'system',
        name: 'Hệ thống',
        icon: 'fal fa-cogs',
        children: [
            {
                code: 'environment',
                name: 'Môi trường',
                icon: '',
            },
            {
                code: 'system-logs',
                name: 'Logs hệ thống',
                icon: '',
            },
            {
                code: 'activity-logs',
                name: 'Nhật ký hoạt động',
                icon: '',
            },
        ],
    },
];

export class AdminPageStore
{
    appStore = null;
    menus = MENU_DATA;
    currentCode = '';
    currentMenuName = '';
    menuSearchKey = '';

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    setPage(code)
    {
        if (Array.isArray(this.menus) && this.menus.length > 0)
        {
            let isSelected = false;

            for (let i = 0; i < this.menus.length; i++)
            {
                const menu = this.menus[i];
                if (Array.isArray(menu.children) && menu.children.length > 0)
                {
                    for (let j = 0; j < menu.children.length; j++)
                    {
                        const children = menu.children[j];
                        if (children.code === code)
                        {
                            this.currentCode = children.code;
                            this.currentMenuName = children.name;
                            isSelected = true;
                            break;
                        }
                    }

                    if (isSelected)
                    {
                        menu.selected = true;
                    }
                }

                if (isSelected)
                {
                    break;
                }
            }

            if (!isSelected)
            {
                this.setDefaultMenu();
            }
        }

        window.history.replaceState(null, `Admin - ${this.currentMenuName}`, `/admin/${this.currentCode}`);
    }

    setDefaultMenu()
    {
        // Choose 1st menu item
        if (Array.isArray(this.menus) && this.menus.length > 0)
        {
            if (Array.isArray(this.menus[0].children) && this.menus[0].children.length > 0)
            {
                this.currentCode = this.menus[0].children[0].code;
                this.currentMenuName = this.menus[0].children[0].name;
            }
        }
    }

    setMenuSearchKey(key)
    {
        this.menuSearchKey = key.toLowerCase();

        for (let i = 0; i < this.menus.length; i++)
        {
            const menu = this.menus[i];
            if (menu.name.toLowerCase().includes(key))
            {
                menu.isNotShow = false;
                if (Array.isArray(menu.children))
                {
                    menu.children = menu.children.map((c) =>
                    {
                        c.isNotShow = false;
                        return c;
                    });
                }
            }
            else
            {
                let isChildrenShow = false;
                for (let j = 0; j < menu.children.length; j++)
                {
                    const children = menu.children[j];
                    if (children.name.toLowerCase().includes(key))
                    {
                        isChildrenShow = true;
                        children.isNotShow = false;
                    }
                    else
                    {
                        children.isNotShow = true;
                    }
                }

                menu.isNotShow = !isChildrenShow;
            }
        }
    }
}

decorate(AdminPageStore, {
    appStore: observable,
    menuSearchKey: observable,
    currentCode: observable,
    menus: observable,
    setPage: action,
    setMenuSearchKey: action,
});
