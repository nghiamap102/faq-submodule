const base = [
    '--size-xs',
    '--size-sm',
    '--size-md',
    '--size-lg',
    '--size-xl',
    '--size-xxl',
] as const;

const featureItem = ['--feature-item-width', '--feature-item-height'] as const;

const baseRgb = [
    '--default',
    '--success',
    '--info',
    '--warning',
    '--danger',
    '--primary',
    '--secondary',
] as const;

const baseColor = [
    '--default-color',
    '--primary-color',
    '--primary-highlight',
    '--secondary-color',
    '--secondary-light',
    '--tertiary-color',
    '--success-color',
    '--info-color',
    '--warning-color',
    '--danger-color',
    '--base-rgb',
    '--contrast',
    '--base-color',
    '--base-light',
    '--base-lighter',
    '--base-highlight',
    '--contrast-color',
    '--contrast-light',
    '--contrast-lighter',
    '--contrast-highlight',
] as const;

const alpha = [
    '--primary-highlight-alpha',
    '--secondary-highlight-alpha',
    '--base-light-alpha',
    '--base-lighter-alpha',
    '--base-highlight-alpha',
    '--text-alpha',
    '--text-light-alpha',
    '--text-dark-alpha',
    '--sub-text-alpha',
    '--border-alpha',
    '--border-light-alpha',
    '--border-lighter-alpha',
    '--btn-alpha',
    '--bg-alpha',
    '--divide-alpha',
    '--form-control-bg-alpha',
] as const;

const text = [
    '--text-rgb',
    '--text-color',
    '--text-contrast-color',
    '--text-light',
    '--text-dark',
    '--sub-text-color',
    '--default-text-color',
] as const;

const border = [
    '--border',
    '--border-color',
    '--border-light',
    '--border-lighter',
    '--marker-popup-border-radius',
    '--popup-border-radius',
    '--popup-border',
] as const;

const button = [
    '--button-color',
] as const;

const tag = [
    '--tag-green-bg-light',
    '--tag-green-fg-light',
    '--tag-lime-bg-light',
    '--tag-lime-fg-light',
    '--tag-yellow-bg-light',
    '--tag-yellow-fg-light',
    '--tag-orange-bg-light',
    '--tag-orange-fg-light',
    '--tag-red-bg-light',
    '--tag-red-fg-light',
    '--tag-green-bg-dark',
    '--tag-green-fg-dark',
    '--tag-lime-bg-dark',
    '--tag-lime-fg-dark',
    '--tag-yellow-bg-dark',
    '--tag-yellow-fg-dark',
    '--tag-orange-bg-dark',
    '--tag-orange-fg-dark',
    '--tag-red-bg-dark',
    '--tag-red-fg-dark',
    '--tag-green-bg',
    '--tag-green-fg',
    '--tag-lime-bg',
    '--tag-lime-fg',
    '--tag-yellow-bg',
    '--tag-yellow-fg',
    '--tag-orange-bg',
    '--tag-orange-fg',
    '--tag-red-bg',
    '--tag-red-fg',
] as const;

const background = [
    '--bg',
    '--form-control-bg',
    '--popup-bg',
    '--bg-color',
    '--bg-dark',
    '--bg-light',
    '--map-tool-bg',
    '--sidebar-bg',
    '--tab-bg',
    'overlay-bg',
] as const;

const panel = [
    '--panel-bg',
    '--panel-header-bg',
    '--panel-footer-bg',
    '--panel-split-shine',
    '--panel-split-shadow',
] as const;

export const cssVars = [
    ...base,
    ...featureItem,
    ...baseRgb,
    ...baseColor,
    ...alpha,
    ...text,
    ...border,
    ...button,
    ...tag,
    ...background,
    ...panel,
] as const;

