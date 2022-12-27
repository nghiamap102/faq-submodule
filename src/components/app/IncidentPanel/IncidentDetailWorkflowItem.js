import './IncidentDetailWorkflowItem.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import {
    Container,
    Button, EmptyButton,
    TB1, RichText,
    FormGroup, FormControlLabel,
    InputGroup, CheckBox, InputAppend, Input,
    FAIcon, Line,
    WebSocketService,
} from '@vbd/vui';

import { UserService } from 'services/user.service';
import { IncidentService } from 'services/incident.service';

import Enum from 'constant/app-enum';

const textColor = 'rgba(255, 255, 255, 0.6)';

export class IncidentDetailWorkflowItem extends Component
{
    state = {
        postShow: false,
        postContent: '',
        infoShow: false,
        params: {
            blockade: 0,
            euclid: 1,
            calling: '',
            advanceSearch: '',
            common: '',
        },
    };

    processingWF = {};

    incidentSvc = new IncidentService();
    wfTimer = undefined;

    componentDidMount()
    {
        if (this.props.params !== undefined)
        {
            this.setState({ params: { ...this.props.params } });
        }
        if (this.props.stop === true && this.props.timer !== '0')
        {
            clearInterval(this.props.timer);
        }
    }

    componentWillUnmount()
    {
        if (this.props.timer !== '0')
        {
            clearInterval(this.props.timer);
        }
    }

    handleShowInformationClick = (event) =>
    {
        // todo
        if (this.props.disabled !== true)
        {
            if (!this.state.infoShow)
            {
                this.setState({ infoShow: !this.state.infoShow, postShow: false });
            }
            else
            {
                this.setState({ infoShow: !this.state.infoShow });
            }

            if (this.props.wfCode !== undefined && this.props.wfProcessId !== undefined)
            {
                this.incidentSvc.findEventCommand(this.props.wfCode, this.props.wfProcessId, this.props.itemId)
                    .then((rs) =>
                    {
                        if (rs.result === Enum.APIStatus.Success)
                        {
                            if (rs.data !== null && rs.data.initFunc !== undefined && rs.data.initFunc.length > 0)
                            {
                                if (typeof this[rs.data.initFunc] === 'function')
                                {
                                    this[rs.data.initFunc]();
                                }
                                else
                                {
                                    // IncidentHelper.handleInitCommonFunc(rs.data.initFunc);
                                    this.handleInitCommonFunc(rs.data.initFunc);
                                }
                            }
                            else
                            {
                                // no need to init data if initFunc is not defined
                                this.handleInitCommonFunc('Không cần thiết lập thông tin');
                            }
                        }
                    });
            }
        }
    };

    handleShowPostClick = (event) =>
    {
        if (this.props.disabled !== true)
        {
            if (!this.state.postShow)
            {
                this.setState({ postShow: !this.state.postShow, infoShow: false });
            }
            else
            {
                this.setState({ postShow: !this.state.postShow });
            }

            if (typeof this.props.onShowPostClicked === 'function')
            {
                this.props.onShowPostClicked(event);
            }
        }
    };

    handlePostClicked = async (event) =>
    {
        if (typeof this.props.onPost === 'function' && this.props.disabled !== true)
        {
            const isNotClear = await this.props.onPost({
                id: this.props.itemId,
                incidentId: this.props.incidentId,
                content: this.state.postContent,
                event: event,
            });

            if (!isNotClear)
            {
                this.setState({ postContent: '' });
            }
        }
    };

    handlePostContent = (event) =>
    {
        this.setState({ postContent: event });
    };

    handleDoneChecked = (event) =>
    {
        if (this.props.disabled !== true && !this.processingWF[this.props.itemId])
        {
            // if (this.props.wfCode.length > 0 && this.props.wfProcessId.length > 0
            //     && this.props.commandProcessing === 0
            //     && (this.props.implementation.length > 0 || this.props.preExecutionImplementation.length > 0)
            // )
            // {
            //     this.wfTimer = setInterval (this.handleEventProcess, 5000 );
            // }

            this.processingWF[this.props.itemId] = true;

            if (typeof this.props.onDoneChecked === 'function')
            {
                this.props.onDoneChecked({
                    id: this.props.itemId,
                    incidentId: this.props.incidentId,
                    event: event,
                }, () =>
                {
                    this.processingWF[this.props.itemId] = false;
                });
            }

            if (this.props.timer !== '0')
            {
                clearInterval(this.props.timer);
            }
        }
    };

    handleStartEvent = (event) =>
    {
        if (this.props.disabled !== true)
        {
            if (typeof this.props.onStartEvent === 'function')
            {
                let timer = '0';
                if (this.props.wfCode !== undefined && this.props.wfCode.length > 0 && this.props.wfProcessId.length > 0 &&
                    this.props.commandProcessing === 0 &&
                    (this.props.implementation.length > 0 || this.props.preExecutionImplementation.length > 0)
                )
                {
                    timer = setInterval(this.handleEventProcess, 5000);
                }

                this.props.onStartEvent({
                    id: this.props.itemId,
                    incidentId: this.props.incidentId,
                    isProcessing: this.props.isProcessing,
                    isDone: this.props.isDone,
                    timer: timer,
                    event: event,
                });
            }
        }
    };

    handleEventProcess = () =>
    {
        if (WebSocketService.hasChannel('wfIncident') === true)
        {
            // WebSocketService.requestAPI('wfIncident', {
            //     path: '/api/incidentEvents/process-triggers',
            //     method: 'post',
            //     data: ['', {
            //         "wfCode": this.props.wfCode,
            //         "wfProcessId": this.props.wfProcessId,
            //         "incidentEventId": this.props.itemId
            //     }]
            // });
            this.incidentSvc.processTriggers(this.props.wfCode, this.props.wfProcessId, this.props.itemId);
        }
        else
        {
            clearInterval(this.props.timer);
        }
    };

    handleInitCommonFunc = (funcName) =>
    {
        const params = { ...this.state.params };
        if (params.common === '')
        {
            params.common = `Đã click trên chức năng thiết lập thông tin của command: ${funcName}`;
        }
        this.setState({ params: params });
    };

    initBlockade = () =>
    {
        const params = { ...this.state.params };
        if (params.blockade === 0)
        {
            params.blockade = 50;
        }
        this.setState({ params: params });
    };

    onRadiusChange = (radius) =>
    {
        const params = { ...this.state.params };
        params.blockade = radius;
        this.setState({ params: params });
    };

    onCkbWayChange = () =>
    {
        const params = { ...this.state.params };
        params.euclid = 0;
        this.setState({ params: params });
    };

    onCkbSkyWayChange = () =>
    {
        const params = { ...this.state.params };
        params.euclid = 1;
        this.setState({ params: params });
    };

    handleSettingParam = (event) =>
    {
        const params = { ...this.state.params };
        this.incidentSvc.settingEvent(this.props.itemId, params).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                // close info setting
                this.setState({ infoShow: false });
            }
        });
    };

    initCall114 = () =>
    {
        const params = { ...this.state.params };
        params.calling = 'Thiết lập thông tin để gọi 114';
        this.setState({ params: params });
    };

    initFindNearestFirer = () =>
    {
        const params = { ...this.state.params };
        params.advanceSearch = 'thiết lập thông tin để tìm lực lượng cứu hỏa gần nhất';
        this.setState({ params: params });
    };

    initFirePost = () =>
    {
        const params = { ...this.state.params };
        params.advanceSearch = 'Thiết lập thông tin để tìm trụ chữa cháy phù hợp';
        this.setState({ params: params });
    };

    // initFireFight = () =>
    // {
    //     let params = { ...this.state.params };
    //     params.advanceSearch = 'search fire fight';
    //     this.setState({params: params });
    // };

    render()
    {
        let iStart = 'hourglass';
        let iStartInfo = 'Chưa xử lý';
        if (this.props.isProcessing)
        {
            iStart = 'hourglass-half';
            iStartInfo = 'Đang xử lý';
        }
        else if (this.props.isDone)
        {
            iStart = 'hourglass-end';
            iStartInfo = 'Xử lý xong';
        }

        let className = '';
        if (this.props.disabled)
        {
            className = 'disabled';
        }

        return (
            <Container className={`id-item ${className}`}>
                <Container className="id-item-main">
                    <Container className="id-item-left">
                        {
                            this.props.isDone
                                ? (
                                        <FAIcon
                                            icon="check-circle"
                                            color="var(--success-color)"
                                            size="20px"
                                        />
                                    )
                                : (
                                        <FAIcon
                                            icon="circle"
                                            color={textColor}
                                            size="20px"
                                            onClick={this.handleDoneChecked}
                                        />
                                    )
                        }
                    </Container>

                    <Container className="id-item-right">
                        <Container className="id-item-content-left">
                            {this.props.isRequired && <Container className="id-item-content-required" />}
                            <TB1>{this.props.itemNumber}.</TB1>
                        </Container>

                        <Container className="id-item-content-right">
                            {this.props.description}
                        </Container>
                    </Container>
                </Container>

                <Container className="id-item-tools">
                    {this.props.children}
                    <FAIcon
                        icon="info-circle"
                        color={textColor}
                        size="20px"
                        onClick={this.handleShowInformationClick}
                    />
                    <FAIcon
                        tooltip={iStartInfo}
                        icon={iStart}
                        color={textColor}
                        size="18px"
                        onClick={this.handleStartEvent}
                    />
                    <FAIcon
                        icon="comment-alt-lines"
                        color={textColor}
                        size="20px"
                        onClick={this.handleShowPostClick}
                    />
                </Container>

                {
                    this.state.postShow &&
                    (
                        <Container className="id-item-post">
                            <Container className="id-item-post-arrow" />
                            <Container className="id-item-post-content">
                                <Container className="id-item-post-content-left">
                                    <RichText
                                        rows={3}
                                        color={textColor}
                                        value={this.state.postContent}
                                        onChange={this.handlePostContent}
                                    />
                                </Container>

                                <Container className="id-item-post-content-right">
                                    <EmptyButton
                                        text="Gửi"
                                        color={'primary'}
                                        onClick={this.handlePostClicked}
                                    />
                                </Container>
                            </Container>

                            <Line
                                className="id-item-post-breakline"
                                color="#454545"
                                height={'2px'}
                            />

                            <Container className="id-item-post-history">
                                {
                                    this.props.posts.map((postHis, index) => (
                                        <IncidentDetailWorkflowItemHistory
                                            key={index}
                                            data={postHis}
                                        />
                                    ),
                                    )
                                }
                            </Container>
                        </Container>
                    )
                }
                {
                    this.state.infoShow && this.state.params.blockade > 0 &&
                    (
                        <Container className="id-item-info">
                            <Container className="id-item-info-arrow" />
                            <Container className="id-item-info-content">
                                <Container className="blockade-detail-panel">
                                    <FormGroup>
                                        <FormControlLabel
                                            label={'Bán kính'}
                                            control={(
                                                <InputGroup>
                                                    <Input
                                                        type="number"
                                                        step={10}
                                                        placeholder={'Nhập bán kính'}
                                                        value={this.state.params.blockade}
                                                        onChange={this.onRadiusChange}
                                                    />
                                                    <InputAppend>m</InputAppend>
                                                </InputGroup>
                                            )}
                                        />

                                        <InputGroup>
                                            <CheckBox
                                                label="Đường chim bay"
                                                checked={this.state.params.euclid === 1}
                                                onChange={this.onCkbSkyWayChange}
                                            />
                                            <CheckBox
                                                label="Đường đi"
                                                checked={this.state.params.euclid === 0}
                                                onChange={this.onCkbWayChange}
                                            />
                                        </InputGroup>
                                        <Button
                                            className="setting"
                                            text="Lưu"
                                            color="rgba(255, 255, 255, 0.6)"
                                            backgroundColor="#494949"
                                            noBorder
                                            onClick={this.handleSettingParam}
                                        />
                                    </FormGroup>
                                </Container>
                            </Container>
                        </Container>
                    )
                }
                {
                    this.state.infoShow && this.state.params.advanceSearch.length > 0 &&
                    (
                        <Container className="id-item-info">
                            <Container className="id-item-info-arrow" />
                            <Container className="id-item-info-content">
                                {this.state.params.advanceSearch}
                            </Container>
                        </Container>
                    )
                }
                {
                    this.state.infoShow && this.state.params.calling.length > 0 &&
                    (
                        <Container className="id-item-info">
                            <Container className="id-item-info-arrow" />
                            <Container className="id-item-info-content">
                                {this.state.params.calling}
                            </Container>
                        </Container>
                    )
                }
                {
                    this.state.infoShow && this.state.params.common.length > 0 &&
                    (
                        <Container className="id-item-info">
                            <Container className="id-item-info-arrow" />
                            <Container className="id-item-info-content">
                                {this.state.params.common}
                            </Container>
                        </Container>
                    )
                }
            </Container>
        );
    }
}

IncidentDetailWorkflowItem.propTypes = {
    itemId: PropTypes.string,
    incidentId: PropTypes.string,
    className: PropTypes.string,
    isCompleted: PropTypes.bool,
    isRequired: PropTypes.bool,
    itemNumber: PropTypes.number,
    content: PropTypes.string,
    posts: PropTypes.array,
    onChecked: PropTypes.func,
    onShowPostClicked: PropTypes.func,
    onPost: PropTypes.func,
    onDoneChecked: PropTypes.func,
    onStartEvent: PropTypes.func,
};

IncidentDetailWorkflowItem.defaultProps = {
    itemId: '',
    className: '',
    isCompleted: false,
    isRequired: true,
    itemNumber: 0,
    content: '',
    posts: [],
    onChecked: () =>
    {

    },
    onShowPostClicked: () =>
    {

    },
    onPost: (event) =>
    {
    },
    onStartEvent: (event) =>
    {
    },
};

class IncidentDetailWorkflowItemHistory extends Component
{
    UserService = new UserService();
    state = { creator: null };

    componentDidMount()
    {
        const { data } = this.props;
        if (data?.createdBy)
        {
            this.UserService.get(data.createdBy).then((creator) =>
            {
                if (creator)
                {
                    this.setState({ creator });
                }
            });
        }
    }

    render()
    {
        const { creator } = this.state;
        return (
            <Container className="id-item-post-history-item">
                {/* <Container className='id-item-post-history-date'> */}
                {/*    <Moment format={'L'}>{this.props.data.createdDate}</Moment> */}
                {/* </Container> */}

                <Container className="id-item-post-history-content">
                    <Container className="id-item-content-left-line">
                        <FAIcon
                            icon="comment-alt-lines"
                            size="20px"
                            color="#454545"
                            backgroundColor="#202020"
                        />
                    </Container>

                    <TB1>{creator?.displayName}</TB1>
                    <TB1>{this.props.data.content}</TB1>

                    <Container className="id-item-post-history-date">
                        <Moment format={'L LTS'}>{this.props.data.createdDate}</Moment>
                    </Container>
                </Container>

            </Container>
        );
    }
}
