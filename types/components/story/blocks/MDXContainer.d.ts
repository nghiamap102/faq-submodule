/// <reference types="react" />
import { StoryContext } from '@storybook/addons';
declare type DocsContainerProps = {
    children: React.ReactElement;
    context: StoryContext;
};
/**
 * Component MDXContainer wrap docs container, use it when writing MDX doc pages
 * ThemeContext (available as story's 'decorators') not working in MDX page, this is the way to overwriting docs container
 * {@link https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#overwriting-docs-container Overwriting docs container}.
 */
export declare const MDXContainer: ({ children, context }: DocsContainerProps) => JSX.Element;
export {};
//# sourceMappingURL=MDXContainer.d.ts.map