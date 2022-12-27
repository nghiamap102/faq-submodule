import { Container, Drawer, Flex, HD6, Image, useModal } from "@vbd/vui";
import AppStore from "components/app/stores/AppStore";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthService } from "services/auth.service";
import { renderModify } from "../Table";
import './Toolbar.scss';

type ToolbarProps = {
    appStore: AppStore
};
const Toolbar: React.FC<ToolbarProps> = ({
    appStore,
}) => {
    const [user, setUser] = useState<any>(null);
    const auth = new AuthService()
    const { menu } = useModal();
    const [isOpenPopupAdd, setIsOpenPopupAdd] = useState(false);
    const [type, setType] = useState('');
    useEffect(() => {
        getUser();
    }, [])
    const getUser = async () => {
        await auth.getProfile().then((res) => {
            setUser(res);
        })
    }
    const handleLogout = () => {
        appStore.removeProfile();
        localStorage.clear();
        window.location.href = `/auth/logout?redirect_uri=${window.location.origin}/auth/vietbando`;
    }
    const handleOpenMenuUser = (event: any) => {
        menu({
            id: 'context-menu',
            position: {
                x: event.clientX,
                y: event.clientY,
            },
            actions: [
                {
                    label: 'Đăng xuất',
                    icon: 'sign-out',
                    onClick: () => handleLogout(),
                },
            ],
        });
    };

    const handleOpenMenuAdd = (event: any) => {
        menu({
            id: 'context-menu',
            position: {
                x: event.clientX,
                y: event.clientY,
            },
            actions: [
                {
                    label: 'Project',
                    icon: 'folder',
                    onClick: () => (setType('project'), setIsOpenPopupAdd(true)),
                },
                {
                    label: 'Topic',
                    icon: 'lightbulb',
                    onClick: () => (setType('topic'), setIsOpenPopupAdd(true)),
                },
                {
                    label: 'Question',
                    icon: 'question',
                    onClick: () => (setType('question'), setIsOpenPopupAdd(true)),
                },
                {
                    label: 'Feedback',
                    icon: 'comment-dots',
                    onClick: () => (setType('feedback'), setIsOpenPopupAdd(true)),
                },
            ],
        });
    }

    const handleClosePopupAdd = () => {
        setIsOpenPopupAdd(false);
    }
    return (
        <>
            {user && Object.keys(user)?.length > 0 &&
                <Flex
                    className="toolbar_admin"
                    justify="between"
                    direction="row"
                    items="center"
                >
                    <Flex direction="row">
                        <Link
                            to={`${LINK.ADMIN}`}
                            className="admin-route"
                        >
                            Go To Admin
                        </Link>
                        <Container
                            className="cursor-pointer"
                            onClick={handleOpenMenuAdd}
                        >
                            Thêm Dữ Liệu +
                        </Container>
                    </Flex>
                    <Container
                        className="cursor-pointer"
                        onClick={handleOpenMenuUser}
                    >
                        <HD6 className="username">Xin Chào {user.userName}</HD6>
                        {user.avatar && (
                            <Image
                                className="ava-wrapper"
                                src={`${user.avatar}`}
                            />
                        )}
                        {!user.avatar && (
                            <Image
                                className="ava-wrapper"
                                src={`https://i.ibb.co/8D24zSz/logo-VBDLIS-only.png`}
                            />
                        )}
                    </Container>
                    {isOpenPopupAdd &&
                        <Drawer
                            width={800}
                            position='right'
                            onClose={handleClosePopupAdd}
                        >
                            <HD6 style={{ textTransform: 'capitalize', paddingLeft: '1rem' }}>{type}</HD6>
                            {renderModify(type, appStore.vbdlisFaqStore)}
                        </Drawer>
                    }
                </Flex>
            }
        </>
    );
};


export default Toolbar;