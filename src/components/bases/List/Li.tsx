import React from 'react';

export type LiProps = JSX.IntrinsicElements['li']
export const Li: React.FC<LiProps> = ({ children, ...restProps }) => <li {...restProps}>{children}</li>;
