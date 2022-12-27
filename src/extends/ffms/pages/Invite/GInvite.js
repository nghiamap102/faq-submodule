import './GInvite.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import ggPlay from 'assets/image/GGplay.png';
import appStore from 'assets/image/Appstore.png';

import {
    Container,
    HD3,
    withI18n,
    withModal,
    withTenant,
} from '@vbd/vui';

import { QRCode } from 'extends/ffms/components/QRCodeViewer/QRCode';
import { DOWNLOAD_PAGE } from 'extends/ffms/routes';

export class GInvite extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            code: props.code,
            platform: '',
        };
    }

    async componentDidMount()
    {
        const userAgent =
            navigator.userAgent || navigator.vendor || window.opera;
        let os = '';
        if (
            userAgent.match(/iPad/i) ||
            userAgent.match(/iPhone/i) ||
            userAgent.match(/iPod/i)
        )
        {
            os = 'ios';
        }
        else if (navigator.userAgent.match(/Windows/i))
        {
            os = 'window';
        }
        else if (userAgent.match(/Android/i))
        {
            os = 'android';
        }
        else
        {
            os = '';
        }

        this.setState({ code: this.props.code, platform: os, keyword: 'testapp' });

    }

    handleOpenDeepLink = () =>
    {
        const { platform } = this.state;
        console.log(platform);
    }

    render()
    {
        const { code,platform,keyword } = this.state;
        if (!code)
        {
            return (
                <Container className={'register-page'}>
                    <HD3 style={{ textAlign: 'center',width: '100%' }}>Code Không hợp lệ</HD3>
                </Container>
            );
        }
        return (
            <Container className={'g-invite-page'}>
                <div className='containter'>
                    <div className='header'>
                        <p>Hướng dẫn tải app</p>
                    </div>
                    <div className='title-1'><p><strong>Bước 1: </strong>&nbsp;<span>Tải xuống ứng dụng</span></p></div>

                    <div className='step1'>
                        <div className='str'>
                            {
                                (platform === 'android' || platform === 'window') && (
                                    <div className='applink'>
                                        <a href=''>
                                            <img src={ggPlay} alt='' width='120px' />
                                        </a>
                                    </div>
                                )
                            }
                            {
                                (platform === 'ios' || platform === 'window') && (
                                    <div className='applink'>
                                        <a href=''>
                                            <img src={appStore} alt='' width='120px' />
                                        </a>
                                    </div>
                                )
                            }


                            <p className='applink'>Từ khóa &nbsp;&quot;<strong>{keyword}</strong>&quot;
                            </p>
                        </div>
                        {
                            platform === 'window' && (
                                <div className='stl'>
                                    <a><QRCode text={'https://' + window.location.host + DOWNLOAD_PAGE} downloadable={false} /></a>

                                </div>
                            )
                        }

                    </div>
                    <div className='step2'>
                        <p><strong>Bước 2: </strong>&nbsp;{ platform !== 'window' ? (<span>Bấm nút dưới đây để đăng nhập vào ứng dụng.</span>) : <span>Nhập mã bên dưới vào ứng dụng</span>}</p>
                        {
                            platform !== 'window' && (
                                <div><a onClick={this.handleOpenDeepLink} className='btn-download'>Mở</a></div>
                            )
                        }
                    </div>
                    <br/>


                    <div className="step3">
                        {platform !== 'window' && (
                            <>
                                <center>Hoặc</center>
                                <p style={{ textAlign: 'center' }}>Nhập mã bên dưới vào ứng dụng</p>
                            </>
                        )}
                        <p className="code">{code}</p>
                    </div>


                </div>

            </Container>
        );
    }
}
GInvite = inject('appStore', 'fieldForceStore')(observer(GInvite));
GInvite = withTenant(withModal(withI18n(withRouter(GInvite))));
export default GInvite;
