import './DirectionContainer.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { Container, PanelHeader } from '@vbd/vui';

import { DirectionSearchBoxContainer } from './DirectionSearchBoxContainer';
import { DirectionTravelMode } from './DirectionTravelMode';
import { DirectionRouteGuide } from './DirectionRouteGuide';

class DirectionContainer extends Component
{
    featureBarStore = this.props.appStore.featureBarStore;
    directionStore = this.props.appStore.directionStore;

    handleClose = () =>
    {
        this.directionStore.clearDirect();

        const path = this.props.match.path.split('/');
        path.pop();
        this.props.history.push(path.join('/'));
    };

    render()
    {
        return (
            <>
                <Container className="ml-directions-searchbox-parent">
                    <Container className="ml-searchbox-visibility-container visible">
                        <Container className="ml-directions-searchbox">
                            <PanelHeader
                                actions={[
                                    { icon: 'trash-alt', onClick: this.directionStore.clearDirect },
                                    { icon: 'times', onClick: this.handleClose },
                                ]}
                            >
                                Kế hoạch lộ trình
                            </PanelHeader>

                            <DirectionTravelMode />
                            <DirectionSearchBoxContainer isProvider={this.props.isProvider} />

                        </Container>
                    </Container>
                </Container>

                {
                    this.props.appStore.directionStore.isShowDirectionRouteGuide &&
                    <DirectionRouteGuide />
                }
            </>
        );
    }
}

DirectionContainer = inject('appStore')(observer(DirectionContainer));
DirectionContainer = withRouter(DirectionContainer);
export { DirectionContainer };
