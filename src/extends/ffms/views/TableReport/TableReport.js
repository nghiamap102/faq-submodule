import './TableReport.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { T, ScrollView } from '@vbd/vui';

export class TableReport extends Component
{
    render()
    {
        return (
            <ScrollView className={`${this.props.className}`}>
                <table className={`grid-panel ${this.props.isFixedHeader ? 'fixed-header' : ''}`}>
                    <thead>
                        <tr>
                            {
                                Array.isArray(this.props.headers) && this.props.headers.map((h, index) =>
                                    h.isUseChild ?
                                        <th
                                            key={index}
                                            style={{ width: h.width }}
                                            colSpan={h.col}
                                        >{h.child}</th> :
                                        <th
                                            key={index}
                                            style={{ width: h.width }}
                                            colSpan={h.col}
                                        ><T>{h.label}</T></th>,
                                )
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {this.props.children}
                    </tbody>
                </table>
            </ScrollView>
        );
    }
}

TableReport.propTypes = {
    className: PropTypes.string,
    headers: PropTypes.array,
    isFixedHeader: PropTypes.bool,
    width: PropTypes.string,
};

TableReport.defaultProps = {
    className: '',
    headers: [],
    isFixedHeader: false,
};

export class TableReportRow extends Component
{
    render()
    {
        return (
            <tr
                className={this.props.className}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </tr>
        );
    }
}

TableReportRow.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

TableReportRow.defaultProps = {
    className: '',
    onClick: () =>
    {
    },
};

export class TableReportRowCell extends Component
{
    render()
    {
        return (
            <td>
                {this.props.children}
            </td>
        );
    }
}

TableReportRowCell.propTypes = {
    className: PropTypes.string,
};

TableReportRowCell.defaultProps = {
    className: '',
};
