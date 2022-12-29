import * as React from 'react'

/**
 * Utility type for getting props type of React component.
 * It takes `defaultProps` into an account - making props with defaults optional.
 */
export type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>

/**
 * Get special DOM type of C.
 *
 * @example
 * // return HTMLDivElement
 * type Example = HTMLElementOf<'div'>
 */
export type HTMLElementOf<C extends keyof JSX.IntrinsicElements> = {
    [K in keyof JSX.IntrinsicElements]: JSX.IntrinsicElements[K]['ref'] extends React.LegacyRef<infer T> | undefined ? T : never
}[C];
