import './AppConfig.scss';
import React , { useState, useContext } from 'react';
import { inject, observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { useModal, HD6, FeatureBarBottom, Popup, ListItem, useI18n, ThemeContext, FAIcon, useTenant, themeList, ThemeIcon, Container } from '@vbd/vui';
import * as Routers from 'extends/ffms/routes';

import ChangePassword from 'extends/ffms/pages/Home/Contents/ChangePassword';
import IconText from 'extends/ffms/bases/IconText/IconText';
import { QRCodeViewer } from 'extends/ffms/components/QRCodeViewer/QRCodeViewer';

const ACBottomFeature = props =>
{
    const { profile } = props.appStore;
    
    const [visiblePopover, setVisiblePopover] = useState(false);
    const { confirm, menu } = useModal();
    const { language, setLanguage } = useI18n();
    const config = useTenant();
    const history = useHistory();

    const context = useContext(ThemeContext);
    const themes = config['themeList'] || themeList;
    
    const [qrOpen, setQROpen] = useState(false);


    const closeMe = () =>
    {
        setVisiblePopover(false);
    };

    const handleBeforeClose = () =>
    {
        confirm({
            title: 'Thoát khỏi tính năng này?',
            message: <HD6>Bạn có thay đổi chưa lưu</HD6>,
            cancelText: 'Bỏ thay đổi',
            onCancel: closeMe,
            okText: 'Tiếp tục chỉnh sửa',
        });
    };

    const handleOnClose = (value) =>
    {
        setVisiblePopover(value);
    };


    const handleLanguage = (event) =>
    {
        menu({
            id: 'language-menu',
            isTopLeft: true,
            position: { x: event.clientX, y: event.clientY },
            actions: [
                {
                    label: 'Tiếng Việt',
                    icon: language === 'vi' ? 'check' : '',
                    onClick: () => setLanguage('vi'),
                },
                {
                    label: '-',
                },
                {
                    label: 'English (IN)',
                    icon: language === 'en-in' ? 'check' : '',
                    onClick: () => setLanguage('en-in'),
                },
                {
                    label: '-',
                },
                {
                    label: 'English (US)',
                    icon: language === 'en' ? 'check' : '',
                    onClick: () => setLanguage('en'),
                },
            ],
        });
    };
    

    const handleTheme = (event) =>
    {
        menu({
            id: 'theme-menu',
            isTopLeft: true,
            position: { x: event.clientX, y: event.clientY },
            actions: themes.map((theme) => ({
                label: theme.name,
                icon: (
                    <ThemeIcon
                        type="solid"
                        icon="circle"
                        size="1.5rem"
                        color={'var(--primary)'}
                        className={`theme-${theme.base} ${theme.className}`}
                    />
                ),
                onClick: () => context.setTheme(theme),
            })),
        });
    };

    const handleQRCodePopup = () =>
    {
        setQROpen(!qrOpen);
    };

    const handleUserInfo = (event) =>
    {
        const handleGotoAdminPage = () =>
        {
            history.push('/admin');
        };
    

        const avaStyle = () =>
        {
            return profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : {};
        };

        const handleLogout = () =>
        {
            props.appStore.logOut();
        };
        
        // check user is admin or not
        let adminAction = [];
        const iconStyle = { width: '2.25rem' };

        if (profile.roles?.Administrator)
        {
            adminAction = [
                {
                    label: '-',
                },
                {
                    label: 'Thiết lập hệ thống',
                    icon: 'cog',
                    iconStyle,
                    onClick: handleGotoAdminPage,
                },
            ];
        }

        menu({
            id: 'map-context-menu',
            isTopLeft: true,
            position: { x: event.clientX, y: event.clientY },
            actions: [
                {
                    label: profile.displayName,
                    sub: profile.email,
                    iconClassName: 'action-avatar',
                    iconStyle: { ...avaStyle(), ...iconStyle },
                },
                {
                    label: 'Truy cập bằng mã QR',
                    icon: 'qrcode',
                    iconStyle,
                    onClick: handleQRCodePopup,
                },
                {
                    label: 'Đổi mật khẩu',
                    icon: 'key-skeleton',
                    iconStyle,
                    onClick: () => setVisiblePopover(true),
                },
                ...adminAction,
                {
                    label: '-',
                },
                {
                    label: 'Đăng xuất',
                    icon: 'sign-out',
                    iconStyle,
                    onClick: handleLogout,
                },
            ],
        });
    };
    
    const handleLogin = (social) =>
    {
        history.push('/auth/' + social);
    };

   
    return (
        <>
            <FeatureBarBottom>
                <Container className="feature-content" >
                    <ListItem
                        icon ={(
                            <IconText
                                id="language"
                                border='circle'
                                onClick={()=>
                                {}}
                                icon={language}
                            />
                        )}
                        label='Chuyển đổi ngôn ngữ'
                        onClick={handleLanguage}
                    />

                    <ListItem
                        icon ={(
                            <ThemeIcon
                                type="solid"
                                icon="circle"
                                size="1.5rem"
                                color={'var(--primary)'}
                                className={`theme-${context.theme.base} ${context.theme.className}`}
                            />
                        )}
                        label='Thay đổi giao diện'
                        onClick={handleTheme}
                    />

                    {
                        props.appStore.ensureLogin() ?
                            (
                                <ListItem
                                    className ={'account-icon'}
                                    iconUrl={profile.avatar}
                                    label='Thông tin tài khoản'
                                    onClick={handleUserInfo}
                                />
                            ) :
                            (
                                <ListItem
                                    icon={
                                        <FAIcon
                                            icon={'user-circle'}
                                            size={'1.5rem'}
                                        />
                                    }
                                    label='Đăng nhập'
                                    onClick={() => handleLogin('vietbando')}
                                />
                            )
                
                    }
                </Container>
            </FeatureBarBottom>

            {
                visiblePopover && (
                    <Popup
                        title={'Đổi mật khẩu'}
                        width={'32rem'}
                        padding={'0'}
                        className={'change-password-popup'}
                        onClose={closeMe}
                        onBeforeClose={handleBeforeClose}
                    >
                        <ChangePassword onClose={handleOnClose} />
                    </Popup>
                )
            }
            {
                qrOpen &&
                <QRCodeViewer text={window.location.origin} handleQRCodePopup={handleQRCodePopup} />
            }
    
        </>
    );
};

ACBottomFeature.propTypes = {

};


export default inject('appStore', 'fieldForceStore')(observer(ACBottomFeature));
