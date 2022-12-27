/**
 * From ReactGA Community Wiki Page https://github.com/react-ga/react-ga/wiki/React-Router-v4-withTracker
 */

import ReactGA from 'react-ga';
import React, { Component } from 'react';

// TODO: enhance later
export default function withTracker(WrappedComponent, options = {})
{
    const trackPage = (page) =>
    {
        ReactGA.set({
            page,
            ...options,
        });
        ReactGA.pageview(page);
    };

    const HOC = class extends Component
    {
        componentDidMount()
        {
            const { location: { pathname: page } } = this.props;

            trackPage(page);
        }

        UNSAFE_componentWillReceiveProps(nextProps)
        {
            const { location: { pathname: currentPage } } = this.props;

            const nextPage = nextProps.location.pathname;

            if (currentPage !== nextPage)
            {
                trackPage(nextPage);
            }
        }

        render()
        {
            return <WrappedComponent {...this.props} />;
        }
    };

    return HOC;
}
