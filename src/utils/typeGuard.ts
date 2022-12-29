import React from 'react';

export const isCallBackRef = <E extends HTMLElement = HTMLElement>(ref: Exclude<React.ForwardedRef<E>, null>): ref is (instance: E | null) => void => !('current' in ref);
