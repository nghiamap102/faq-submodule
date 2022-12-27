import './css-images/css2';
import './css-images/bootstrap.css';
import './css-images/swiper.css';
import './css-images/magnific-popup.css';
import './css-images/styles.css';
import logo from './css-images/logo.svg';
import header from './css-images/header.svg';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import * as Routers from 'extends/ffms/routes';

import {
    Container, Row, AdvanceSelect, Image,
    T, withI18n, withTenant, withModal,
} from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

import { TENANT_STATUS } from 'extends/ffms/constant/ffms-enum';
import { Constants } from 'extends/ffms/constant/Constants';
import TenantService from 'extends/ffms/services/TenantService';
import SampleConfig from './SampleConfig';

class ConfigPage extends Component
{
    tenantSvc = new TenantService();
    handleUserConfigClick = async () =>
    {
        const status = await this.tenantSvc.getTenantStatus();
        if (status === TENANT_STATUS.readyToConfig || status === TENANT_STATUS.sampleDataLoading)
        {
            await this.tenantSvc.setTenantStatus(TENANT_STATUS.userConfig);
        }
        window.location.href = Routers.MANAGER_LAYER_DATA;
    };

    handleUserInfo = (event) =>
    {
        const profile = this.props.appStore.profile || {};

        // check user is admin or not
        let adminAction = [];
        const iconStyle = { width: '2.5rem' };

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
                    onClick: this.handleGotoAdminPage,
                },
            ];
        }

        const target = event.currentTarget.getBoundingClientRect();

        this.props.menu({
            id: 'user-context-menu',
            isTopLeft: true,
            position: { x: target.x + 50, y: target.y + 40 },
            actions: [
                {
                    label: profile.displayName,
                    sub: profile.email,
                    iconClassName: 'action-avatar',
                    iconStyle: { ...(profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : {}), ...iconStyle },
                },
                {
                    label: '-',
                },
                {
                    label: 'Đăng xuất',
                    icon: 'sign-out',
                    iconStyle,
                    iconSize: '1rem',
                    onClick: () =>
                    {
                        this.props.appStore.logOut();
                    },
                },
            ],
        });
    };


    render()
    {
        const currentLanguageId = `${this.props.language.substr(0, 2)}, ${this.props.language}`;
        const currentLanguageOpt = Constants.languages.find((x) => x.id === currentLanguageId);

        return (
            <div className="config-page" data-spy="scroll" data-target="" ><a href="" className="back-to-top page-scroll">Back to Top</a>
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <div className="container">
                        <a className="navbar-brand logo-image" href=""><img src={logo} alt="alternative" /></a>
                        <button className="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
                            <ul className="navbar-nav ml-auto">
                                {/* <li className="nav-item">
                                    <a className="nav-link page-scroll active" href="">Home
                                        <span className="sr-only">(current)</span></a>
                                </li>
                                <li className="nav-item">
                                    <SampleConfig className={'nav-link page-scroll'} />
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link page-scroll" href="">Customize configuration</a>
                                </li> */}
                                <Row itemMargin={'md'} crossAxisAlignment={'center'}>
                                    <Container
                                        className={'language-select'}
                                    >
                                        <AdvanceSelect
                                            width={'12rem'}
                                            placeholder={'Ngôn ngữ'}
                                            value={currentLanguageOpt.label}
                                            options={Constants.languages}
                                            onChange={(value) =>
                                            {
                                                const locale = value.split(', ').pop();
                                                this.props.setLanguage(locale);
                                            }}
                                        />
                                    </Container>
                                    <div onClick={this.handleUserInfo}>
                                        <Row
                                            className={'user-profile'}
                                            crossAxisAlignment={'center'}
                                            itemMargin={'md'}
                                            // onClick={this.handleUserInfo}
                                        >
                                            <Image
                                                className={'avatar-image'}
                                                src={this.props.appStore.profile.avatar}
                                                width={'2rem'}
                                                height={'2rem'}
                                            />
                                            <FAIcon
                                                icon={'caret-down'}
                                                type={'solid'}
                                                size={'1rem'}
                                                color={'--text-color'}
                                            />
                                        </Row>
                                    </div>
                                </Row>
                            </ul>
                        </div>
                    </div>
                </nav>
                <header id="header" className="header">
                    <div className="container" style={{ marginBottom: '1rem' }}>
                        <div className="row">
                            <svg
                                className="header-decoration" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none" viewBox="0 0 1920 305.139"
                            >
                                <defs>
                                    <style dangerouslySetInnerHTML={{ __html: '\n                    .cls-1 {\n                        fill: var(--contrast-lighter);\n                    }\n                ' }} />
                                </defs>
                                <title>header-decoration</title>
                                <path className="cls-1" d="M1486.486,36.773C1434.531,13.658,1401.068-5.1,1329.052,1.251c-92.939,8.2-152.759,70.189-180.71,89.478-23.154,15.979-134.286,104.091-171.753,128.16-50.559,32.48-98.365,59.228-166.492,67.5-67.648,8.21-124.574-6.25-152.992-18-42.218-17.454-42.218-17.454-90-39-35.411-15.967-81.61-34.073-141.58-34.054-116.6.037-262.78,77.981-354.895,80.062C53.1,275.793,22.75,273.566,0,260.566v44.573H1920V61.316c-36.724,23.238-76.008,61.68-177,65C1655.415,129.2,1556.216,67.8,1486.486,36.773Z" transform="translate(0 0)" />
                            </svg>
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="text-container">
                                    <h1 className="h1-large">System initialization</h1>
                                    <p className="p-large" >
                                    In this step, we will initialize your system by applying one of these methods:
                                        <ul className="list-unstyled li-space-lg" style={{ marginTop: '0.5rem' }}>
                                            <li className="media">
                                                <div className="media-body" style={{ marginLeft: '0.5rem' }} >- Using sample configuration</div>
                                            </li>
                                            <li className="media">
                                                <div className="media-body" style={{ marginLeft: '0.5rem' }}>- Customize configuration</div>
                                            </li>
                                        </ul>
                                        The system can be used after finish all necessary config</p>
                                    <SampleConfig className={'btn-outline-lg'} />
                                    <button
                                        className={'btn-outline-lg'}
                                        onClick={this.handleUserConfigClick}
                                    >
                                        <T>Thiết lập dữ liệu</T>
                                    </button>

                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="image-container">
                                    <img className="img-fluid" src={header} alt="alternative" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

ConfigPage = inject('appStore')(observer(ConfigPage));
ConfigPage = withModal(withI18n(withTenant(ConfigPage)));
export default ConfigPage;
