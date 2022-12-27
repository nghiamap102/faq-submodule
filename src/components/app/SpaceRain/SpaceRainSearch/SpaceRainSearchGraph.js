import 'components/app/LPR/PlateAlert.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-vis-network-graph';

import {
    BorderPanel,
    ThemeContext,
    Column,
    FAIcon,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';

const options = {
    // layout: {
    //     hierarchical: {
    //         direction: 'UD',
    //         sortMethod: 'directed'
    //     }
    // },
    interaction: {
        hover: true,
        tooltipDelay: 300,
    },
    physics: {
        solver: 'repulsion',
        repulsion: {
            centralGravity: 0,
            springLength: 200,
            springConstant: 0.08,
            nodeDistance: 250,
            damping: 0.5,
        },
    },
    edges: {
        color: 'white',
        smooth: {
            type: 'cubicBezier',
            forceDirection: 'none',
            roundness: 0.5,
        },
        shadow: true,
        // arrows: {
        //     to: {
        //         enabled: false
        //     }
        // }
    },
    nodes: {
        shape: 'box',
        shadow: true,
        margin: {
            top: 16,
            right: 16,
            bottom: 16,
            left: 16,
        },
    },
};

const style = { width: '100%', height: '100%' };

const colors = {
    plate: '#228B22',
    mac: '#FF7F50',
    wap: 'red',
};

class SpaceRainSearchGraph extends Component
{
    convertToGraphNode = (type, data) =>
    {
        let label = data.label;
        const isRoot = label === this.props.rootValue;

        if (!this.props.expandedObjects || !this.props.expandedObjects[data.id])
        {
            label = `${label}\n------\n+`;
        }

        const color = isRoot ? getComputedStyle(document.body).getPropertyValue('--primary') : colors[type];

        return {
            ...data,
            label,
            color: {
                border: color,
                background: 'white',
                highlight: {
                    border: color,
                    background: 'white',
                },
            },
            borderWidth: isRoot ? 4 : 2,
            // title: root.mac
        };
    };

    events = {
        select: (event) =>
        {
            const { nodes } = event;

            if (nodes.length > 0 && typeof this.props.onSearchNode === 'function')
            {
                this.props.onSearchNode({
                    id: nodes[0],
                    mode: nodes[0].split('.')[0],
                    value: nodes[0].split('.')[1],
                });
            }
        },
    };

    render()
    {
        const graph = {
            nodes: [],
            edges: [],
        };

        const data = this.props.data;

        const macs = {};
        const waps = {};

        for (const d of data)
        {
            if (d.plate)
            {
                if (graph.nodes.find((n) => n.id === `plate.${d.plate}`) === undefined)
                {
                    const plateNode = CommonHelper.clone(d);
                    plateNode.id = `plate.${plateNode.plate}`;
                    plateNode.label = plateNode.plate;

                    graph.nodes.push(this.convertToGraphNode('plate', plateNode));
                }
            }

            if (!macs[`mac.${d.mac}`])
            {
                const macNode = CommonHelper.clone(d);
                macNode.id = `mac.${macNode.mac}`;
                macNode.label = macNode.mac;

                macNode.plateInfos = [{
                    plate: d.plate,
                    matches: d.matches,
                }];
                macs[macNode.id] = macNode;

                graph.nodes.push(this.convertToGraphNode('mac', macNode));
            }
            else
            {
                macs[`mac.${d.mac}`].plateInfos.push({
                    plate: d.plate,
                    matches: d.matches,
                });
            }

            if (d.wap)
            {
                if (!waps[`wap.${d.wap}`])
                {
                    const wapNode = CommonHelper.clone(d);
                    wapNode.id = `wap.${wapNode.wap}`;
                    wapNode.label = `${wapNode.ssid}\n(${wapNode.wap})`;

                    wapNode.macInfos = [{
                        mac: d.mac,
                    }];
                    waps[wapNode.id] = wapNode;

                    graph.nodes.push(this.convertToGraphNode('wap', wapNode));
                }
                else
                {
                    waps[`wap.${d.wap}`].macInfos.push({
                        mac: d.mac,
                    });
                }
            }
        }

        const edgeColor = getComputedStyle(document.body).getPropertyValue('--primary-light');

        Object.keys(macs).forEach((k) =>
        {
            const m = macs[k];

            m.plateInfos.forEach((i) =>
            {
                graph.edges.push({
                    from: `plate.${i.plate}`,
                    to: m.id,
                    label: `${i.matches}`,
                    font: { align: 'top' },
                    title: `matches: ${i.matches}`,
                    color: edgeColor,
                    width: i.matches * 2,
                });
            });
        });

        Object.keys(waps).forEach((k) =>
        {
            const w = waps[k];

            w.macInfos.forEach((i) =>
            {
                graph.edges.push({
                    from: `mac.${i.mac}`,
                    to: w.id,
                    // label: i.matches,
                    // title: `matches: ${i.matches}`,
                    color: edgeColor,
                    // width: i.matches * 2
                });
            });
        });

        return (
            <BorderPanel
                className={`spacerain-graph ${this.props.className}`}
                flex={1}
            >
                {
                    !this.props.isLoading && (
                        <Graph
                            graph={graph}
                            options={options}
                            events={this.events}
                            style={style}
                            vis={vis => (this.vis = vis)}
                        />
                    )}
                {
                    this.props.isLoading && (
                        <Column
                            mainAxisAlignment={'center'}
                            crossAxisAlignment={'center'}
                        >
                            <FAIcon
                                icon={'spinner-third'}
                                type={'duotone'}
                                size={'3rem'}
                                spin
                            />
                        </Column>
                    )}
            </BorderPanel>
        );
    }
}

SpaceRainSearchGraph.propTypes = {
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    onSearchNode: PropTypes.func,
    expandedObjects: PropTypes.any,
};

SpaceRainSearchGraph.contextType = ThemeContext;
export { SpaceRainSearchGraph };
