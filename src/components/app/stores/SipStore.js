import * as JsSIP from "jssip";

import {createContext} from "react";
import {extendObservable} from "mobx";

export const SIP_STATUS = {
    DISCONNECTED: "sipStatus/DISCONNECTED",
    CONNECTING: "sipStatus/CONNECTING",
    CONNECTED: "sipStatus/CONNECTED",
    REGISTERED: "sipStatus/REGISTERED",
    ERROR: "sipStatus/ERROR"
};

export const SIP_ERROR = {
    CONFIGURATION: "sipErrorType/CONFIGURATION",
    CONNECTION: "sipErrorType/CONNECTION",
    REGISTRATION: "sipErrorType/REGISTRATION"
};

export const CALL_STATUS = {
    IDLE: "callStatus/IDLE",
    STARTING: "callStatus/STARTING",
    ACTIVE: "callStatus/ACTIVE",
    STOPPING: "callStatus/STOPPING"
};

export const CALL_DIRECTION = {
    INCOMING: "callDirection/INCOMING",
    OUTGOING: "callDirection/OUTGOING"
};

class SipStore
{
    constructor ()
    {
        extendObservable(this, {
            sipStatus: SIP_STATUS.DISCONNECTED,
            sipErrorType: null,
            sipErrorMessage: null,

            rtcSession: null,

            callStatus: CALL_STATUS.IDLE,
            callDirection: null,
            callCounterpart: null,
            visible: false
        });

        this.ua = null;
    }

    initAudioElement ()
    {
        if (window.document.getElementById("sip-call-audio"))
        {
            throw new Error(
                `Creating two SipProvider in one application is forbidden. If that's not the case ` +
                `then check if you're using "sip-provider-audio" as id attribute for any existing ` +
                `element`,
            );
        }

        this.remoteAudio = window.document.createElement("audio");
        this.remoteAudio.id = "sip-call-audio";
        window.document.body.appendChild(this.remoteAudio);
    }

    destroy ()
    {
        if (this.remoteAudio)
        {
            this.remoteAudio.parentNode.removeChild(this.remoteAudio);
            delete this.remoteAudio;
            if (this.ua)
            {
                this.ua.stop();
                this.ua = null;
            }
        }
    }

    registerSip = () =>
    {
        if (this.config.autoRegister)
        {
            throw new Error("Calling registerSip is not allowed when autoRegister === true");
        }

        if (this.sipStatus !== SIP_STATUS.CONNECTED)
        {
            throw new Error(`Calling registerSip is not allowed when sip status is ${this.sipStatus} (expected ${SIP_STATUS.CONNECTED})`);
        }

        return this.ua.register();
    };

    unregisterSip = () =>
    {
        if (this.config.autoRegister)
        {
            throw new Error("Calling registerSip is not allowed when autoRegister === true");
        }

        if (this.sipStatus !== SIP_STATUS.REGISTERED)
        {
            throw new Error(`Calling unregisterSip is not allowed when sip status is ${this.sipStatus} (expected ${SIP_STATUS.CONNECTED})`);
        }

        return this.ua.unregister();
    };

    answerCall = () =>
    {
        if (this.callStatus !== CALL_STATUS.STARTING || this.callDirection !== CALL_DIRECTION.INCOMING)
        {
            throw new Error(`Calling answerCall() is not allowed when call status is ${this.callStatus} and call direction is ${this.callDirection} (expected ${CALL_STATUS.STARTING} and ${CALL_DIRECTION.INCOMING})`);
        }

        this.rtcSession.answer({
            mediaConstraints: {
                audio: true,
                video: false,
            },
            pcConfig: {
                iceServers: this.config.iceServers,
            },
        });
    };

    startCall = (destination) =>
    {
        if (!destination)
        {
            throw new Error(`Destination must be defined (${destination} given)`);
        }

        if (this.sipStatus !== SIP_STATUS.CONNECTED && this.sipStatus !== SIP_STATUS.REGISTERED)
        {
            throw new Error(`Calling startCall() is not allowed when sip status is ${this.sipStatus} (expected ${SIP_STATUS.CONNECTED} or ${SIP_STATUS.REGISTERED})`);
        }

        if (this.callStatus !== CALL_STATUS.IDLE)
        {
            throw new Error(`Calling startCall() is not allowed when call status is ${this.callStatus} (expected ${CALL_STATUS.IDLE})`);
        }

        const {iceServers, sessionTimersExpires} = this.config;
        const extraHeaders = this.config.extraHeaders.invite;

        const options = {
            extraHeaders,
            mediaConstraints: {audio: true, video: false},
            rtcOfferConstraints: {iceRestart: this.config.iceRestart},
            pcConfig: {iceServers},
            sessionTimersExpires,
        };

        this.ua.call(destination, options);
        this.callStatus = CALL_STATUS.STARTING;
    };

    stopCall = () =>
    {
        this.callStatus = CALL_STATUS.STOPPING;
        this.ua.terminateSessions();
    };

    reconfigureDebug (debug)
    {
        if (debug)
        {
            JsSIP.debug.enable("JsSIP:*");
        }
        else
        {
            JsSIP.debug.disable("JsSIP:*");
        }
    }

    reinitializeJsSIP (config)
    {
        if (this.ua)
        {
            this.ua.stop();
            this.ua = null;
        }

        this.config = config;
        const {host, port, pathname, user, password, domain, autoRegister} = config;

        if (!host || !port || !user)
        {
            this.sipStatus = SIP_STATUS.DISCONNECTED;
            this.sipErrorType = null;
            this.sipErrorMessage = null;

            return;
        }

        try
        {
            const socket = new JsSIP.WebSocketInterface(`wss://${host}:${port}${pathname}`);
            this.ua = new JsSIP.UA({
                sockets: [socket],
                uri: `sip:${user}@${domain}`,
                password,
                register: autoRegister
            });
        }
        catch (error)
        {
            this.sipStatus = SIP_STATUS.ERROR;
            this.sipErrorType = SIP_ERROR.CONFIGURATION;
            this.sipErrorMessage = error.message;

            return;
        }

        const {ua} = this;

        ua.on("connecting", () =>
        {
            if (this.ua !== ua)
            {
                return;
            }

            this.sipStatus = SIP_STATUS.CONNECTING;
            this.sipErrorType = null;
            this.sipErrorMessage = null;
        });

        ua.on("connected", () =>
        {
            if (this.ua !== ua)
            {
                return;
            }

            this.sipStatus = SIP_STATUS.CONNECTED;
            this.sipErrorType = null;
            this.sipErrorMessage = null;
        });

        ua.on("disconnected", () =>
        {
            if (this.ua !== ua)
            {
                return;
            }

            this.sipStatus = SIP_STATUS.ERROR;
            this.sipErrorType = SIP_ERROR.CONNECTION;
            this.sipErrorMessage = "disconnected";
        });

        ua.on("registered", () =>
        {
            if (this.ua !== ua)
            {
                return;
            }

            this.sipStatus = SIP_STATUS.REGISTERED;
            this.callStatus = CALL_STATUS.IDLE;
        });

        ua.on("unregistered", () =>
        {
            if (this.ua !== ua)
            {
                return;
            }

            if (ua.isConnected())
            {
                this.sipStatus = SIP_STATUS.CONNECTED;
                this.callStatus = CALL_STATUS.IDLE;
                this.callDirection = null;
            }
            else
            {
                this.sipStatus = SIP_STATUS.DISCONNECTED;
                this.callStatus = CALL_STATUS.IDLE;
                this.callDirection = null;
            }
        });

        ua.on("registrationFailed", (res) =>
        {
            if (this.ua !== ua)
            {
                return;
            }

            this.sipStatus = SIP_STATUS.ERROR;
            this.sipErrorType = SIP_ERROR.REGISTRATION;
            this.sipErrorMessage = res.cause;
        });

        ua.on("newRTCSession", ({originator, session: rtcSession, request: rtcRequest}) =>
        {
            if (!this || this.ua !== ua)
            {
                return;
            }

            this.visible = true;

            // identify call direction
            if (originator === "local")
            {
                const foundUri = rtcRequest.to.toString();

                this.callDirection = CALL_DIRECTION.OUTGOING;
                this.callStatus = CALL_STATUS.STARTING;
                this.callCounterpart = foundUri.replace('<sip:', '').replace('>', '').replace('@' + this.config.domain, '');
            }
            else if (originator === "remote")
            {
                const foundUri = rtcRequest.from.toString();

                this.callDirection = CALL_DIRECTION.INCOMING;
                this.callStatus = CALL_STATUS.STARTING;
                this.callCounterpart = foundUri.match(/"(.*)"/)[1];
            }

            const rtcSessionInState = this.rtcSession;

            // Avoid if busy or other incoming
            if (rtcSessionInState)
            {
                rtcSession.terminate({
                    status_code: 486,
                    reason_phrase: "Busy Here",
                });

                return;
            }

            this.rtcSession = rtcSession;

            rtcSession.on("failed", () =>
            {
                if (this.ua !== ua)
                {
                    return;
                }

                this.rtcSession = null;
                this.callStatus = CALL_STATUS.IDLE;
                this.callDirection = null;
                this.callCounterpart = null;
            });

            rtcSession.on("ended", () =>
            {
                if (this.ua !== ua)
                {
                    return;
                }

                this.rtcSession = null;
                this.callStatus = CALL_STATUS.IDLE;
                this.callDirection = null;
                this.callCounterpart = null;
            });

            rtcSession.on("accepted", () =>
            {
                if (this.ua !== ua)
                {
                    return;
                }

                [this.remoteAudio.srcObject] = rtcSession.connection.getRemoteStreams();

                const played = this.remoteAudio.play();
                if (typeof played !== "undefined")
                {
                    played.catch(() =>
                    {
                        /**/
                    }).then(() =>
                    {
                        setTimeout(() =>
                        {
                            this.remoteAudio.play();
                        }, 2000);
                    });

                    this.callStatus = CALL_STATUS.ACTIVE;
                    this.callDirection = null;

                    return;
                }

                this.callStatus = CALL_STATUS.ACTIVE;
                this.callDirection = null;

                setTimeout(() =>
                {
                    this.remoteAudio.play();
                }, 2000);
            });

            if (this.callDirection === CALL_DIRECTION.INCOMING && config.autoAnswer)
            {
                this.answerCall();
            }
            else if (this.callDirection === CALL_DIRECTION.INCOMING && !config.autoAnswer)
            {
            }
            else if (this.callDirection === CALL_DIRECTION.OUTGOING)
            {
            }
        });

        const extraHeadersRegister = config.extraHeaders.register || [];
        if (extraHeadersRegister.length)
        {
            ua.registrator().setExtraHeaders(extraHeadersRegister);
        }

        ua.start();
    }
}

export const SipStoreContext = createContext(new SipStore());
