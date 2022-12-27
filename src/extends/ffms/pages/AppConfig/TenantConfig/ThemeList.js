import React from 'react';

import './ThemeList.scss';
import PropTypes from 'prop-types';

import { Column, Container, Row, T } from '@vbd/vui';


const ThemeList = (props) =>
{
    // Two case check. 1 with current theme, 1 with inside themes

    const checkActive = (theme) =>
    {
        if (!props.currentTheme)
        {
            return `${theme?.enable ? 'active' : ''}`;
        }
        else
        {
            return '';
        }
    };

    const checkDefault = (theme) =>
    {
        if (!props.currentTheme)
        {
            return `${theme?.default ? 'default' : ''}`;
        }
        else
        {
            return `${props.currentTheme === theme.name ? 'default' : ''}`;
        }
    };

    const renderThemeItem = (theme) =>
    {
        return (
            <Column
                key={theme?.name}
                className={'theme-content'}
                crossAxisAlignment={'center'}
            >
                <div
                    className={`theme-list theme-${theme?.base} ${theme?.className} ${checkActive(theme)} ${checkDefault(theme)}`}
                    onClick={() =>
                    {
                        props.onChange && props.onChange(theme);
                    }}
                />
                <Container
                    className={'theme-name'}
                >
                    <T>{theme?.name}</T>
                </Container>
            </Column>
        );
    };

    return (
        <Row
            mainAxisAlignment={'space-between'}
            crossAxisSize={'max'}
            className='form-control'
        >
            <Row mainAxisAlignment={'start'} className={'theme-customize'}>
                {props.themes.map(renderThemeItem)}
            </Row>
        </Row>
    );
};

ThemeList.defaultProps = {
    currentTheme: '',
};

ThemeList.propTypes = {
    themes: PropTypes.array,
    currentTheme: PropTypes.string,
    onChange: PropTypes.func,
};

export default ThemeList;
