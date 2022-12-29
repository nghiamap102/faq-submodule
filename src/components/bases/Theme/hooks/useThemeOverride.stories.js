import { Button } from 'components/bases/Button';
import { Col2, Row2 } from 'components/bases/Layout';
import { Typography } from 'components/bases/Text/Text';

import { useThemeOverride } from './useThemeOverride';

export default {
    title: 'hook/useThemeOverride',
};

const Template = (args) =>
{
    const overrideData = {
        fontBase: {
            mobile: '12px',
            tablet: '16px',
            desktopSm: '20px',
            desktop: '24px',
            1280: '30px',
        },
        varConfigs: [
            {
                id: 'theme-ogis',
                info: [
                    {
                        id: 'ogis-dark',
                        name: {
                            vi: 'Giao diện màu tối',
                            en: 'Dark theme',
                        },
                        base: 'dark',
                    },
                    {
                        id: 'ogis-light',
                        name: {
                            vi: 'Giao diện màu sáng',
                            en: 'Light theme',
                        },
                        base: 'light',
                    },
                ],
                cssVar: {
                    primary: '255, 96, 0',
                    primaryHighlightAlpha: 'var(--alpha-30)',
                },
                cssVarDark: {
                    warning: '255, 96, 0',
                },
                cssVarLight: {
                    secondary: '255, 96, 0',
                    // --tag-yellow-bg-light,
                    tagYellowBgLigh: '#fcf3c3',
                },
                selectors: [
                    {
                        selector: '#button-to-override',
                        cssVar: {
                            defaultColor: 'green',
                        },
                    },
                ],
            },
        ],
    };
    useThemeOverride(overrideData);

    return (
        <Col2 gap={2}>
            <Typography>Css warning color variables is override in theme: Ogis dark</Typography>
            <Typography color='warning'>Default waring color is yellow, but its color is override to orange</Typography>
            <Typography>Resize window to see font-size change</Typography>
            <Typography>Switch to theme: Ogis light. VUI throw warning on invalid css variables in override data.</Typography>
            <Typography className="testOverride">This paragraph text color is override by selector: &quot;.testOverride&quot; </Typography>
            <Row2
                gap={2}
                items="center"
            >
                <Button id="button-to-override">Override by selector</Button>
                <Typography>This button background color is override to &quot;green&quot; by selector: &quot;#button-to-override&quot;</Typography>
            </Row2>
            <Typography>Inspect element and find your config in style tag with [data-vui-override=&quot;cssVar&quot;] & [data-vui-override=&quot;fontBase&quot;]</Typography>
        </Col2>
    );
};

export const Default = Template.bind({});
