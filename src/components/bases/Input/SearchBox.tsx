import React, { forwardRef } from 'react';
import { FAIcon } from '@vbd/vicon';

import { EmptyButton } from 'components/bases/Button/Button';
import { FormControl } from 'components/bases/Form/FormControl';
import { Container } from 'components/bases/Container/Container';

import { Input } from './Input';
import { SearchBoxProps } from './model/inputType';

import './SearchBox.scss';

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>((props, ref) =>
{
    const { value, onChange, className, flex, style, ...rest } = props;

    const handleClearText = () =>
    {
        onChange && onChange('');
    };

    const handleChangeValue = (value: string) =>
    {
        onChange && onChange(value);
    };

    return (
        <Container
            className={className}
            flex={flex}
        >
            <FormControl className={'search-box-container'}>
                <Input
                    {...rest}
                    ref={ref}
                    className={'search-box-control'}
                    type={'text'}
                    autoComplete="off"
                    spellCheck="false"
                    value={value}
                    style={{ ...style, flex }}
                    onChange={handleChangeValue}
                />

                <div className="search-box-icon-cover">
                    {value
                        ? (
                                <EmptyButton
                                    className="search-box-close-icon"
                                    icon={'times'}
                                    size="xs"
                                    iconSize='md'
                                    onlyIcon
                                    onClick={handleClearText}
                                />
                            )
                        : (
                                <FAIcon
                                    className="search-box-icon"
                                    icon={'search'}
                                />
                            )
                    }
                </div>
            </FormControl>
        </Container>
    );
});

SearchBox.displayName = 'SearchBox';
