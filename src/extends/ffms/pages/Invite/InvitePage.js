import './InvitePage.scss';
import React, { useState, useEffect } from 'react';
import { inject, observer, Provider } from 'mobx-react';
import { useLocation } from 'react-router';

import { Container, HD5, Loading } from '@vbd/vui';
import NewUserManager from 'extends/ffms/views/RegisterUser/NewUserManager';

import FieldForceStore from 'extends/ffms/FieldForceStore';
import UserService from 'extends/ffms/services/UserService';

import GInvite from './GInvite';

const InvitePage = (props) =>
{
    const userSvc = new UserService(props.appStore?.contexts);
    const [store, setStore] = useState(new FieldForceStore(props.appStore));

    const [isValid, setIsValid] = useState();
    const [code, setCode] = useState();
    const [codeData, setCodeData] = useState();

    const location = useLocation();

    useEffect(() =>
    {
        const searchParams = new URLSearchParams(
            location.search,
        );
        const code = searchParams.get('code');
        setCode(code);

        userSvc.checkInviteCode(code).then((isValid) =>
        {
            userSvc.getInviteCode(code).then((data) =>
            {
                setCodeData(data);
                setIsValid(isValid);
            });
        });
    }, []);

    const renderContent = () =>
    {
        switch (isValid)
        {
            case true:
                if (codeData && codeData.type === 'login-code' && codeData.grantType === 'token')
                {
                    return <GInvite code={code}/>;
                }
                else
                {
                    return (
                        <NewUserManager
                            data={codeData}
                        />
                    );
                }
            case false:
                return <HD5 className="hd hd5 code-status">Mã đăng ký không hợp lệ</HD5>;
            default:
                return isValid ? <HD5 className="hd hd5 code-status">{isValid}</HD5> : <Loading fullscreen/>;
        }
    };
    return (
        <Provider fieldForceStore={store}>
            <Container className={'invite-page'}>
                {
                    renderContent()
                }
            </Container>
        </Provider>
    );
};


export default inject('appStore')(observer(InvitePage));
