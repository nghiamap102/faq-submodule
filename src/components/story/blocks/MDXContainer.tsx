import { DocsContainer } from '@storybook/addon-docs/blocks';
import { StoryContext } from '@storybook/addons';
import { themeList as themes } from 'components/bases/Theme/ThemeContext';

type DocsContainerProps = {
    children: React.ReactElement
    context: StoryContext
}

/**
 * Component MDXContainer wrap docs container, use it when writing MDX doc pages
 * ThemeContext (available as story's 'decorators') not working in MDX page, this is the way to overwriting docs container
 * {@link https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#overwriting-docs-container Overwriting docs container}.
 */
 
export const MDXContainer = ({ children, context }: DocsContainerProps): JSX.Element =>
{
    const theme = themes.find(({ id, name }) => (id === context.globals.theme) || (name === context.globals.theme)) || themes[0];
    return (
        <DocsContainer context={context}>
            <div className={`theme-base theme-${theme.base} ${theme.className}`}>{children}</div>
        </DocsContainer>
    );
};
