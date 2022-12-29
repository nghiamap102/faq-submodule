import React from 'react';

export type UlProps = JSX.IntrinsicElements['ul']
export const Ul: React.FC<JSX.IntrinsicElements['ul']> = ({ children, ...restProps }) => <ul {...restProps}>{children}</ul>;
