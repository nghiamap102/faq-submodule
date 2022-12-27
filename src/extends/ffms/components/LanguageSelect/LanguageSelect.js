import React from 'react';
import { Row ,Image, TB1, AdvanceSelect, T } from '@vbd/vui';
import { CommonHelper } from 'helper/common.helper';
import PropTypes from 'prop-types';

const languageDefaultOption = [
    { id: 'en, en-au', label: 'English (Australia)' },
    { id: 'en, en-ca', label: 'English (Canada)' },
    { id: 'en, en-in', label: 'English (India)' },
    { id: 'en, en-ie', label: 'English (Ireland)' },
    { id: 'en, en-il', label: 'English (Israel)' },
    { id: 'en, en-nz', label: 'English (New Zealand)' },
    { id: 'en, en-sg', label: 'English (Singapore)' },
    { id: 'en, en-gb', label: 'English (United Kingdom)' },
    { id: 'en, en', label: 'English (United States)' },
    { id: 'vi, vi', label: 'Tiếng Việt' },
];

const flagImages = CommonHelper.importAll(require.context('images/lang_flag', false, /\.png$/));


const LanguageSelect = (props) =>
{

    const getLanguageOptions = () =>
    {
        const labelOption = (option) =>
        {
            const [language] = option['id'].split(', ');
            const imgFlagLang = flagImages[language + '.png'];

            if (props.hasFlag)
            {
                return (
                    <Row
                        crossAxisAlignment={'center'}
                        itemMargin={'sm'}
                    >
                        <Image
                            key={option['id']}
                            src={imgFlagLang.default}
                            height={'1.25rem'}
                            width={'1.25rem'}
                            background={'transparent'}
                        />
                        <T>{option['label']}</T>
                    </Row>
                );
            }
            else
            {
                return <T>{option['label']}</T>;
            }
        };

        const languageOptions = props?.languageOptions ?? languageDefaultOption;

        return languageOptions.map(op =>
        {
            return ({
                ...op,
                label: labelOption(op),
            });
        });
    };

    const getLanguageValue = () =>
    {
        const { language, locale } = props;
        if (!locale || !language)
        {
            return;
        }
        else
        {
            return `${language}, ${locale}`;
        }
    };

    const handleLanguageChange = (value) =>
    {
        let language,locale;
        if (value)
        {
            language = value.split(', ')[0];
            locale = value.split(', ')[1];
        }
        else
        {
            language = ('');
            locale = ('');
        }

        props.onChange && props.onChange({ language,locale });
    };

    return (
        <AdvanceSelect
            {...props}
            clearable
            placeholder="Chọn ngôn ngữ"
            options={getLanguageOptions()}
            onChange={handleLanguageChange}
            value={getLanguageValue()}
        />
    );
};

LanguageSelect.propTypes = {
    language: PropTypes.string,
    local: PropTypes.string,
    languageOptions: PropTypes.array,
    hasFlag: PropTypes.bool,
};

LanguageSelect.propTypes = {
    hasFlag: false,
};

export default LanguageSelect;
