import './SipProvider.scss';

import React, { Component } from 'react';
import { observer } from 'mobx-react';

import PropTypes from 'prop-types';

import { CALL_DIRECTION, CALL_STATUS, SIP_ERROR, SIP_STATUS, SipStoreContext } from 'components/app/stores/SipStore';

import {
    Container,
    Status,
    WindowPopup,
    DialPad,
} from '@vbd/vui';

class SipProvider extends Component
{
    componentDidMount()
    {
        this.context.initAudioElement();
        this.context.reconfigureDebug(this.props.debug);
        this.context.reinitializeJsSIP(this.props);
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (this.props.debug !== prevProps.debug)
        {
            this.context.reconfigureDebug();
        }

        if (
            this.props.host !== prevProps.host ||
            this.props.port !== prevProps.port ||
            this.props.pathname !== prevProps.pathname ||
            this.props.user !== prevProps.user ||
            this.props.password !== prevProps.password ||
            this.props.autoRegister !== prevProps.autoRegister
        )
        {
            this.context.reinitializeJsSIP();
        }
    }

    componentWillUnmount()
    {
        this.context.destroy();
    }

    handleCall = (des) =>
    {
        this.context.startCall(des);
    };

    handleStop = () =>
    {
        this.context.stopCall();
    };

    handleAnswer = () =>
    {
        this.context.answerCall();
    };

    handleClose = () =>
    {
        this.context.visible = false;
    };

    getSipStatusIcon()
    {
        let text = '';

        switch (this.context.sipStatus)
        {
            default:
            case SIP_STATUS.DISCONNECTED:
                return (
                    <Status
                        color={'#5E5E5E'}
                        text={'DISCONNECTED'}
                    />
                );
            case SIP_STATUS.CONNECTING:
                return (
                    <Status
                        color={'yellow'}
                        text={'CONNECTING'}
                    />
                );
            case SIP_STATUS.CONNECTED:
                return (
                    <Status
                        color={'#0F93EF'}
                        text={'CONNECTED'}
                    />
                );
            case SIP_STATUS.REGISTERED:
                switch (this.context.callStatus)
                {
                    case CALL_STATUS.ACTIVE:
                        text = 'ON-CALL';
                        break;
                    case CALL_STATUS.STARTING:
                        switch (this.context.callDirection)
                        {
                            case CALL_DIRECTION.INCOMING:
                                text = 'INCOMING CALL';
                                break;
                            case CALL_DIRECTION.OUTGOING:
                                text = 'CALLING';
                                break;
                            default:
                                text = 'CALLING';
                        }
                        break;
                    case CALL_STATUS.STOPPING:
                        text = 'STOPPING';
                        break;
                    case CALL_STATUS.IDLE:
                        text = 'READY TO CALL';
                        break;
                    default:
                        text = 'REGISTERED';
                }
                return (
                    <Status
                        color={'#79e479'}
                        text={text}
                    />
                );
            case SIP_STATUS.ERROR:
                switch (this.context.sipErrorType)
                {
                    case SIP_ERROR.CONNECTION:
                        text = 'CONNECTION ERROR';
                        break;
                    case SIP_ERROR.CONFIGURATION:
                        text = 'CONNECTION ERROR';
                        break;
                    case SIP_ERROR.REGISTRATION:
                        text = 'REGISTRATION ERROR';
                        break;
                    default:
                        text = 'ERROR';
                }
                return (
                    <Status
                        color={'#E83030'}
                        text={text}
                    />
                );
        }
    }

    render()
    {
        return (
            <WindowPopup
                id={'sip-provider'}
                title={this.getSipStatusIcon()}
                visible={this.context.visible}
                // visible={true}
                width={400}
                height={700}
                left={window.innerWidth / 2 - 200}
                top={window.innerHeight / 2 - 350}
                resizable={false}
                onClose={this.handleClose}
            >
                <Container className={'sip-provider'}>
                    <DialPad
                        counterpart={this.context.callCounterpart}
                        active={this.context.callStatus === CALL_STATUS.ACTIVE}
                        starting={this.context.callStatus === CALL_STATUS.STARTING}
                        incoming={this.context.callDirection === CALL_DIRECTION.INCOMING}
                        onCallClick={this.handleCall}
                        onAnswerClick={this.handleAnswer}
                        onStopClick={this.handleStop}
                    />
                </Container>
            </WindowPopup>
        );
    }
}

SipProvider.contextType = SipStoreContext;

SipProvider.propTypes = {
    host: PropTypes.string,
    port: PropTypes.number,
    pathname: PropTypes.string,
    user: PropTypes.string,
    password: PropTypes.string,
    domain: PropTypes.string,
    autoRegister: PropTypes.bool,
    autoAnswer: PropTypes.bool,
    iceRestart: PropTypes.bool,
    sessionTimersExpires: PropTypes.number,
    extraHeaders: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    iceServers: PropTypes.arrayOf(PropTypes.object),
    debug: PropTypes.bool,
};

SipProvider.defaultProps = {
    host: null,
    port: null,
    pathname: '',
    user: null,
    password: null,
    domain: '',
    autoRegister: true,
    autoAnswer: false,
    iceRestart: false,
    sessionTimersExpires: 120,
    extraHeaders: { register: [], invite: [] },
    iceServers: [],
    debug: false,
};

SipProvider = observer(SipProvider);
export default SipProvider;
