import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { SuggestItem } from './SuggestItem';

class SuggestList extends Component
{
    handleClick = (data, index) =>
    {
        if (this.props.onSelect)
        {
            this.props.onSelect(data);
        }
    };

    handleClickSetting = (data) =>
    {
        if (this.props.onClickSetting)
        {
            this.props.onClickSetting(data);
        }
    };

    render()
    {
        if (this.props.data && this.props.data.length)
        {
            const suggestItem = [];
            for (let i = 0; i < this.props.data.length; i++)
            {
                const s = this.props.data[i];
                const highlight = this.props.highlightId ? this.props.highlightId === s.id : this.props.highlightIndex === i;

                if (s.favLocation)
                {
                    const setting = (!s.isMyLocation)
                        ? () =>
                            {
                                this.handleClickSetting(s);
                            }
                        : null;

                    suggestItem.push(
                        <SuggestItem
                            key={i}
                            data={s}
                            highlight={highlight}
                            isProvider={this.props.isProvider}
                            onClick={() => this.handleClick(s)}
                            onClickSetting={setting}
                        />,
                    );
                }
                else
                {
                    if (i > 0 && this.props.data[i - 1].favLocation)
                    {
                        suggestItem.push(
                            <li
                                key={'divider'}
                                className={'suggestion-divider'}
                            />,
                        );
                    }

                    suggestItem.push(
                        <SuggestItem
                            key={i}
                            data={s}
                            highlight={highlight}
                            onClick={() => this.handleClick(s)}
                        />,
                    );
                }
            }

            return (
                <ul className="suggestions sbsb_b">
                    {suggestItem}
                </ul>
            );
        }
        else
        {
            return null;
        }
    }
}

SuggestList.propTypes = {
    data: PropTypes.array,
    onClickSetting: PropTypes.func,
    onSelect: PropTypes.func,
    highlightIndex: PropTypes.number,
    highlightId: PropTypes.any,
};

// SuggestList must be observer - otherwise appState pass as data can't detect change
SuggestList = observer(SuggestList);
export { SuggestList };
