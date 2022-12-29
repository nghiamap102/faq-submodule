import './SuggestItem.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { T } from 'components/bases/Translate/Translate';

export class SuggestItem extends Component
{
    handleClick = () =>
    {
        this.props.onClick(this.props.data);
    };

    handleClickSetting = (e) =>
    {
        e.stopPropagation();
        this.props.onClickSetting(this.props.data);
    };

    renderContent = () =>
    {
        const setting = this.props.onClickSetting
            ? (
                    <button onClick={e => this.handleClickSetting(e)}>
                        <T>Thiết lập</T>
                    </button>
                )
            : null;

        if (this.props.data.hint)
        {
            // two line
            return (
                <div className={'suggest-text two-line'}>
                    {setting}
                    <div className={'suggest-query'}>
                        <T>{this.props.data.query}</T>
                    </div>
                    <div className={'suggest-hint'}>
                        <T>{this.props.data.hint}</T>
                    </div>
                    {this.props.data.provider && (
                        <div className={'suggest-type'}>
                            <T>{this.props.data.provider}</T>
                        </div>
                    )}
                </div>
            );
        }
        else
        {
            // one line
            return (
                <div className={'suggest-text'}>
                    <T>{this.props.data.query}</T>
                    {this.props.data.provider && (
                        <div className={'suggest-type'}>
                            <T>{this.props.data.provider}</T>
                        </div>
                    )}
                    {setting}
                </div>
            );
        }
    };

    render()
    {
        const highlightClass = this.props.highlight ? 'sbox-highlight' : '';
        let iconClass = this.props.data.iconClass;
        iconClass = iconClass || (this.props.data.history ? 'ml-icon-history' : 'ml-icon-place');

        return (
            <li
                className={highlightClass}
                onClick={this.handleClick}
            >
                <div className={!this.props.data.provider ? 'suggest' : 'suggest suggest-provider'}>
                    <div className="suggest-text-area ml-borderbox">
                        <div className="suggest-icon-container">
                            <svg className={'ml-icon ' + iconClass} />
                        </div>
                        {this.renderContent()}
                    </div>
                </div>
            </li>
        );
    }
}

SuggestItem.propTypes = {
    data: PropTypes.any,
    onClickSetting: PropTypes.func,
    highlight: PropTypes.bool,
};
