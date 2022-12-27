import './DirectionRouteGuide.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';

import { ListItem, Container, T, ScrollView } from '@vbd/vui';

import { AddressText } from './AddressText';

class DirectionRouteGuide extends Component
{
    isExpand = observable.box(false);

    isExistMultiRoutes = () =>
    {
        return (
            this.props.appStore.directionStore.direction.routes &&
            this.props.appStore.directionStore.direction.routes.route_2 &&
            this.props.appStore.directionStore.direction.routes.route_2.Geometry &&
            (this.props.appStore.directionStore.direction.routes.route_2.Geometry.length > 1)
        );
    };

    overview = observable({
        isShow: this.isExistMultiRoutes(),
        isMultiRoutes: this.isExistMultiRoutes(),
    });

    UNSAFE_componentWillReceiveProps = action(() =>
    {
        this.overview.isMultiRoutes = this.isExistMultiRoutes();
        this.overview.isShow = this.overview.isMultiRoutes;
    });

    handleChangeStep = (i) =>
    {
        this.props.appStore.directionStore.setPreviewStep(i);
        this.props.appStore.directionStore.showDirectionPreviewArrow();
    };

    renderStep = (s, i) =>
    {
        if (!s || !s.dis)
        {
            return null;
        }

        return (
            <ListItem
                key={i}
                label={(
                    <>
                        <span>{this.props.appStore.directionStore.translateDirectionV3(s.turn)}</span>
                        &nbsp;<AddressText code={s.name} />
                    </>
                )}
                sub={this.props.appStore.directionStore.getFormatDistance(s.dis)}
                icon={<Container className={`dir-step-icon ${this.props.appStore.directionStore.getDirectionIconV3(s.turn)}`} />}
                active={this.props.appStore.directionStore.direction.isShowDirectionPreviewArrow && (i === this.props.appStore.directionStore.direction.previewStep)}
                splitter
                onClick={() =>
                {
                    this.handleChangeStep(i);
                }}
            />
        );
    };

    renderSteps = () =>
    {
        const steps = this.props.appStore.directionStore.direction.routes.route_1 ? this.props.appStore.directionStore.direction.routes.route_1.Steps : null;
        const viaIndices = this.props.appStore.directionStore.direction.routes.route_1 ? this.props.appStore.directionStore.direction.routes.route_1.Via_Indices : null;
        const activeLocations = this.props.appStore.directionStore.direction.activeLocations;

        if (activeLocations && activeLocations.length >= 2)
        {
            if (steps && steps.Names && steps.Turns && steps.Distances) // found guide route
            {
                const middleLocations = activeLocations.slice(1, -1).map((o) => o && o.selectedResult);

                const viewGuideSteps = [];

                let renderCurrentMiddleLocation = null;

                for (let i = 0; i < steps.Indices.length; i++)
                {
                    const step = {
                        name: steps.Names[i],
                        turn: steps.Turns[i],
                        dis: steps.Distances[i],
                    };

                    const viewGuideStep = this.renderStep(step, i);

                    if (i && (i !== steps.Indices.length - 1) && viaIndices.includes(steps.Indices[i]))
                    {
                        renderCurrentMiddleLocation = this.renderSectionLocation(middleLocations[0]);
                        middleLocations.shift();
                    }
                    else
                    {
                        renderCurrentMiddleLocation = null;
                    }

                    viewGuideSteps.push(
                        <Container key={`leg-${i}`}>
                            {viewGuideStep}
                            {renderCurrentMiddleLocation}
                        </Container>,
                    );
                }

                return viewGuideSteps;
            }
            else // not found direction path
            {
                return (
                    <Container className="dir-no-step">
                        <T>Chúng tôi không thể tìm thấy chỉ dẫn giữa hai địa điểm</T>
                    </Container>
                );
            }
        }

        return null;
    };

    getDirectionStartLoc = () =>
    {
        const dir = this.props.appStore.directionStore.direction;
        if (dir && dir.locations && dir.locations[0])
        {
            return dir.locations[0].selectedResult;
        }

        return {
            name: '',
            shortAddress: '',
        };
    };

    getDirectionEndLoc = () =>
    {
        const dir = this.props.appStore.directionStore.direction;
        if (dir && dir.locations && dir.locations.length && dir.locations[dir.locations.length - 1])
        {
            return dir.locations[dir.locations.length - 1].selectedResult;
        }

        return {
            name: '',
            shortAddress: '',
        };
    };

    renderPathLength = () =>
    {
        const viaDistances = this.props.appStore.directionStore.direction.routes.route_1 ? this.props.appStore.directionStore.direction.routes.route_1.Via_Distances : null;

        if (viaDistances)
        {
            const pathLength = this.props.appStore.directionStore.getFormatDistance(viaDistances[viaDistances.length - 1]);
            if (pathLength)
            {
                return `(${pathLength})`;
            }
        }

        return null;
    };

    renderPathDuration = () =>
    {
        const viaDurations = this.props.appStore.directionStore.direction.routes.route_1 ? this.props.appStore.directionStore.direction.routes.route_1.Via_Durations : null;

        if (viaDurations)
        {
            const duration = this.props.appStore.directionStore.getFormatDuration(viaDurations[viaDurations.length - 1], false);
            if (duration)
            {
                return duration;
            }
        }

        return null;
    };

    renderSectionLocation = (loc) =>
    {
        return (
            <Container className="dir-stop">
                <Container className="dir-stop-title">
                    {
                        loc && loc.name &&
                        <AddressText code={loc.name} />
                    }
                </Container>
                <Container className="dir-stop-sub">
                    {
                        loc && loc.address &&
                        <AddressText code={loc.address} />
                    }
                </Container>
            </Container>
        );
    };

    renderDirectionDetail = () =>
    {
        const startLoc = this.getDirectionStartLoc();
        const endLoc = this.getDirectionEndLoc();

        return (
            <ScrollView className={'dir-guide'}>
                {this.renderSectionLocation(startLoc)}

                <Container className="dir-steps">
                    {this.renderSteps()}
                </Container>

                {this.renderSectionLocation(endLoc)}
            </ScrollView>
        );
    };

    render()
    {
        return (
            <>
                <Container className="dir-header">
                    {this.renderPathDuration()}&nbsp;{this.renderPathLength()}
                </Container>

                {this.renderDirectionDetail()}
            </>
        );
    }
}

DirectionRouteGuide = inject('appStore')(observer(DirectionRouteGuide));
export { DirectionRouteGuide };
