import './DialPad.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';
import { CallTimer } from 'components/bases/DialPad/CallTimer';

export class DialPad extends Component
{
    state = {
        phoneNumber: '',
    };

    handleAddDigit = (digit) =>
    {
        this.setState({ phoneNumber: this.state.phoneNumber + digit });
    };

    handleRemoveDigit = () =>
    {
        this.setState({ phoneNumber: this.state.phoneNumber.substring(0, this.state.phoneNumber.length - 1) });
    };

    handleChange = (event) =>
    {
        this.setState({ phoneNumber: event.target.value });
    };

    handleCallClick = () =>
    {
        if (this.props.active || this.props.starting)
        {
            this.props.onStopClick();
        }
        else
        {
            this.props.onCallClick(this.state.phoneNumber);
        }
    };

    render()
    {
        return (
            <div className="pad">
                <div className="dial-pad">

                    <div className="contact">
                        <div className="avatar" />
                        <div className="contact-info">
                            <div className="contact-name">Matt Sich</div>
                            <div className="contact-position">CodePenner</div>
                            <div className="contact-number">
                                (123) 456 - 7890
                            </div>
                        </div>
                        <div className="contact-buttons">
                            <button className="icon-message" />
                            <button className="icon-video" />
                        </div>
                    </div>

                    <div className="phoneString">
                        <input
                            ref={input => input && input.focus()}
                            type="text"
                            value={this.state.phoneNumber}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className="digits">
                        <div className="dig pound" onClick={this.handleAddDigit.bind(this, 1)}>1</div>
                        <div className="dig" onClick={this.handleAddDigit.bind(this, 2)}>2
                            <div className="sub-dig">ABC</div>
                        </div>
                        <div className="dig" onClick={this.handleAddDigit.bind(this, 3)}>3
                            <div className="sub-dig">DEF</div>
                        </div>
                        <div className="dig" onClick={this.handleAddDigit.bind(this, 4)}>4
                            <div className="sub-dig">GHI</div>
                        </div>
                        <div className="dig" onClick={this.handleAddDigit.bind(this, 5)}>5
                            <div className="sub-dig">JKL</div>
                        </div>
                        <div className="dig" onClick={this.handleAddDigit.bind(this, 6)}>6
                            <div className="sub-dig">MNO</div>
                        </div>
                        <div className="dig" onClick={this.handleAddDigit.bind(this, 7)}>7
                            <div className="sub-dig">PQRS</div>
                        </div>
                        <div className="dig" onClick={this.handleAddDigit.bind(this, 8)}>8
                            <div className="sub-dig">TUV</div>
                        </div>
                        <div className="dig" onClick={this.handleAddDigit.bind(this, 9)}>9
                            <div className="sub-dig">WXYZ</div>
                        </div>
                        <div className="dig astrisk" onClick={this.handleAddDigit.bind(this, '*')}>*</div>
                        <div className="dig pound" onClick={this.handleAddDigit.bind(this, 0)}>0</div>
                        <div className="dig pound" onClick={this.handleAddDigit.bind(this, '#')}>#</div>
                    </div>

                    <div className="digits">
                        <div className="dig addPerson">
                            <FAIcon
                                icon={'user-plus'}
                                size={'24px'}
                                type={'regular'}
                                color={'white'}
                            />
                        </div>
                        <div className="dig-spacer" />
                        <div className="dig goBack" onClick={this.handleRemoveDigit}>
                            <FAIcon
                                icon={'backspace'}
                                size={'24px'}
                                type={'regular'}
                                color={'white'}
                            />
                        </div>
                    </div>

                </div>

                <div className={`call-pad ${(this.props.active || this.props.starting) ? 'in-call' : ''}`}>
                    <div className='pulsate'>
                        <div />
                        <div />
                        <div />
                    </div>
                    <div className="ca-avatar">
                        <FAIcon icon={'user-circle'} size={'100px'} color={'white'} />
                    </div>

                    {/* <div className="ca-name">Jelda Lam</div> */}
                    <div className="ca-number">{this.props.counterpart}</div>
                    <div className="ca-status">
                        <CallTimer {...this.props} />
                    </div>

                    <div className={'ca-buttons'}>
                        <div className="ca-b-single" data-label="Add Contact">
                            <FAIcon icon={'user-plus'} size={'24px'} color={'white'} />
                        </div>
                        <div className="ca-b-single" data-label="Mute">
                            <FAIcon icon={'microphone-slash'} size={'24px'} color={'white'} />
                        </div>
                        <div className="ca-b-single" data-label="Speaker">
                            <FAIcon icon={'volume'} size={'24px'} color={'white'} />
                        </div>
                        <div className="ca-b-single" data-label="Face to Face">
                            <FAIcon icon={'video'} size={'24px'} color={'white'} />
                        </div>
                        <div className="ca-b-single" data-label="Chat">
                            <FAIcon icon={'comment-lines'} size={'24px'} color={'white'} />
                        </div>
                        <div className="ca-b-single" data-label="Keypad">
                            <FAIcon icon={'keyboard'} size={'24px'} color={'white'} />
                        </div>
                    </div>
                </div>

                {!this.props.incoming && (
                    <div
                        className={`call action-dig ${(this.props.active || this.props.starting) ? 'in-call' : ''}`}
                        onClick={this.handleCallClick}
                    >
                        <div className="call-change"><span /></div>
                        <FAIcon
                            className={'call-icon'} icon={'phone'} size={'24px'}
                            type={'regular'} color={'white'}
                        />
                    </div>
                )}

                {this.props.incoming && (
                    <div>
                        <div className={'reject action-dig'} onClick={this.props.onStopClick}>
                            <FAIcon
                                icon={'phone'} size={'24px'} type={'regular'}
                                color={'white'}
                            />
                        </div>

                        <div className={'answer action-dig'} onClick={this.props.onAnswerClick}>
                            <FAIcon
                                icon={'phone'} size={'24px'} type={'regular'}
                                color={'white'}
                            />
                        </div>
                    </div>
                )}

            </div>
        );
    }
}

DialPad.propTypes = {
    className: PropTypes.string,
    onStopClick: PropTypes.func,
    onCallClick: PropTypes.func,
    onAnswerClick: PropTypes.func,
    active: PropTypes.bool,
    starting: PropTypes.bool,
    incoming: PropTypes.bool,
    counterpart: PropTypes.string,
};

DialPad.defaultProps = {
    className: '',
};
