import { breakpoints } from 'themes/breakpoints';

export type Responsive<I> = {
  [K in keyof I]: Partial<Record<keyof typeof breakpoints, Required<I>[K]>>
};

export type ColorSystem =
  | 'transparent' | 'current' | 'black' | 'white'
  | 'slate50' | 'slate100' | 'slate200' | 'slate300' | 'slate400' | 'slate500' | 'slate600' | 'slate700' | 'slate800' | 'slate900'
  | 'gray50' | 'gray100' | 'gray200' | 'gray300' | 'gray400' | 'gray500' | 'gray600' | 'gray700' | 'gray800' | 'gray900'
  | 'zinc50' | 'zinc100' | 'zinc200' | 'zinc300' | 'zinc400' | 'zinc500' | 'zinc600' | 'zinc700' | 'zinc800' | 'zinc900'
  | 'neutral50' | 'neutral100' | 'neutral200' | 'neutral300' | 'neutral400' | 'neutral500' | 'neutral600' | 'neutral700' | 'neutral800' | 'neutral900'
  | 'stone50' | 'stone100' | 'stone200' | 'stone300' | 'stone400' | 'stone500' | 'stone600' | 'stone700' | 'stone800' | 'stone900'
  | 'brown50' | 'brown100' | 'brown200' | 'brown300' | 'brown400' | 'brown500' | 'brown600' | 'brown700' | 'brown800' | 'brown900'
  | 'red50' | 'red100' | 'red200' | 'red300' | 'red400' | 'red500' | 'red600' | 'red700' | 'red800' | 'red900' | 'redA100' | 'redA200' | 'redA400' | 'redA700'
  | 'salmon50' | 'salmon100' | 'salmon200' | 'salmon300' | 'salmon400' | 'salmon500' | 'salmon600' | 'salmon700' | 'salmon800' | 'salmon900'
  | 'salmonA100' | 'salmonA200' | 'salmonA400' | 'salmonA700'
  | 'orange50' | 'orange100' | 'orange200' | 'orange300' | 'orange400' | 'orange500' | 'orange600' | 'orange700' | 'orange800' | 'orange900'
  | 'orangeA100' | 'orangeA200' | 'orangeA400' | 'orangeA700'
  | 'amber50' | 'amber100' | 'amber200' | 'amber300' | 'amber400' | 'amber500' | 'amber600' | 'amber700' | 'amber800' | 'amber900'
  | 'amberA100' | 'amberA200' | 'amberA400' | 'amberA700'
  | 'yellow50' | 'yellow100' | 'yellow200' | 'yellow300' | 'yellow400' | 'yellow500' | 'yellow600' | 'yellow700' | 'yellow800' | 'yellow900'
  | 'yellowA100' | 'yellowA200' | 'yellowA400' | 'yellowA700'
  | 'pear50' | 'pear100' | 'pear200' | 'pear300' | 'pear400' | 'pear500' | 'pear600' | 'pear700' | 'pear800' | 'pear900'
  | 'pearA100' | 'pearA200' | 'pearA400' | 'pearA700'
  | 'lime50' | 'lime100' | 'lime200' | 'lime300' | 'lime400' | 'lime500' | 'lime600' | 'lime700' | 'lime800' | 'lime900'
  | 'limeA100' | 'limeA200' | 'limeA400' | 'limeA700'
  | 'green50' | 'green100' | 'green200' | 'green300' | 'green400' | 'green500' | 'green600' | 'green700' | 'green800' | 'green900'
  | 'greenA100' | 'greenA200' | 'greenA400' | 'greenA700'
  | 'emerald50' | 'emerald100' | 'emerald200' | 'emerald300' | 'emerald400' | 'emerald500' | 'emerald600' | 'emerald700' | 'emerald800' | 'emerald900'
  | 'teal50' | 'teal100' | 'teal200' | 'teal300' | 'teal400' | 'teal500' | 'teal600' | 'teal700' | 'teal800' | 'teal900'
  | 'tealA100' | 'tealA200' | 'tealA400' | 'tealA700'
  | 'cyan50' | 'cyan100' | 'cyan200' | 'cyan300' | 'cyan400' | 'cyan500' | 'cyan600' | 'cyan700' | 'cyan800' | 'cyan900'
  | 'cyanA100' | 'cyanA200' | 'cyanA400' | 'cyanA700'
  | 'sky50' | 'sky100' | 'sky200' | 'sky300' | 'sky400' | 'sky500' | 'sky600' | 'sky700' | 'sky800' | 'sky900' | 'skyA100' | 'skyA200' | 'skyA400' | 'skyA700'
  | 'blue50' | 'blue100' | 'blue200' | 'blue300' | 'blue400' | 'blue500' | 'blue600' | 'blue700' | 'blue800' | 'blue900'
  | 'blueA100' | 'blueA200' | 'blueA400' | 'blueA700'
  | 'indigo50' | 'indigo100' | 'indigo200' | 'indigo300' | 'indigo400' | 'indigo500' | 'indigo600' | 'indigo700' | 'indigo800' | 'indigo900'
  | 'indigoA100' | 'indigoA200' | 'indigoA400' | 'indigoA700'
  | 'violet50' | 'violet100' | 'violet200' | 'violet300' | 'violet400' | 'violet500' | 'violet600' | 'violet700' | 'violet800' | 'violet900'
  | 'violetA100' | 'violetA200' | 'violetA400' | 'violetA700'
  | 'purple50' | 'purple100' | 'purple200' | 'purple300' | 'purple400' | 'purple500' | 'purple600' | 'purple700' | 'purple800' | 'purple900'
  | 'purpleA100' | 'purpleA200' | 'purpleA400' | 'purpleA700'
  | 'fuchsia50' | 'fuchsia100' | 'fuchsia200' | 'fuchsia300' | 'fuchsia400' | 'fuchsia500' | 'fuchsia600' | 'fuchsia700' | 'fuchsia800' | 'fuchsia900'
  | 'pink50' | 'pink100' | 'pink200' | 'pink300' | 'pink400' | 'pink500' | 'pink600' | 'pink700' | 'pink800' | 'pink900'
  | 'pinkA100' | 'pinkA200' | 'pinkA400' | 'pinkA700'
  | 'rose50' | 'rose100' | 'rose200' | 'rose300' | 'rose400' | 'rose500' | 'rose600' | 'rose700' | 'rose800' | 'rose900'

export type SpacingRemStep =
  | 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 72 | 80 | 96;

// Separate negative type because there are another cases, that only use the positive type
export type SpacingNegativeRemStep =
  | -0.5 | -1 | -1.5 | -2 | -2.5 | -3 | -3.5 | -4 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12
  | -14 | -16 | -20 | -24 | -28 | -32 | -36 | -40 | -44 | -48 | -52 | -56 | -60 | -64 | -72 | -80 | -96;

export type OpacityStep =
  | 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 50
  | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 100;

export type OpacityUsualStep = 0 | 5 | 10 | 15 | 35 | 55 | 85 | 100;

export type Color = ColorSystem | Partial<Record<keyof typeof breakpoints, ColorSystem>>;
export type Opacity = OpacityStep | Partial<Record<keyof typeof breakpoints, OpacityStep>>;
export type OpacityUsual = OpacityUsualStep | Partial<Record<keyof typeof breakpoints, OpacityUsualStep>>;

// ==========================================================================
//                               Border
// ==========================================================================
export type BorderWidthSystem = 'px' | 0 | 2 | 4 | 8;
export type BorderRadiusSystem = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type BorderWidth = BorderWidthSystem | Partial<Record<keyof typeof breakpoints, BorderWidthSystem>>;
export type BorderRadius = BorderRadiusSystem | Partial<Record<keyof typeof breakpoints, BorderRadiusSystem>>;

export type BorderProperty = {
  borderColor?: Color;
  borderOpacity?: OpacityUsual;
  border?: BorderWidth;
  borderTop?: BorderWidth;
  borderRight?: BorderWidth;
  borderBottom?: BorderWidth;
  borderLeft?: BorderWidth;
  borderRadius?: BorderRadius;
  borderTopRadius?: BorderRadius;
  borderRightRadius?: BorderRadius;
  borderBottomRadius?: BorderRadius;
  borderLeftRadius?: BorderRadius;
  borderTopLeftRadius?: BorderRadius;
  borderTopRightRadius?: BorderRadius;
  borderBottomRightRadius?: BorderRadius;
  borderBottomLeftRadius?: BorderRadius;
};

// ==========================================================================
//                               Spacing
// ==========================================================================
export type SpacingKeysSystem = 'px' | '-px' | SpacingRemStep | SpacingNegativeRemStep;
export type SpaceBetweenReverseSystem = true;
export type SpacingKeys = SpacingKeysSystem | Partial<Record<keyof typeof breakpoints, SpacingKeysSystem>>;
export type SpaceBetweenReverse = SpaceBetweenReverseSystem | Partial<Record<keyof typeof breakpoints, SpaceBetweenReverseSystem>>;

export type SpacingProperty = {
  m?: SpacingKeys;
  mx?: SpacingKeys;
  my?: SpacingKeys;
  mt?: SpacingKeys;
  mr?: SpacingKeys;
  mb?: SpacingKeys;
  ml?: SpacingKeys;
  p?: SpacingKeys;
  px?: SpacingKeys;
  py?: SpacingKeys;
  pt?: SpacingKeys;
  pr?: SpacingKeys;
  pb?: SpacingKeys;
  pl?: SpacingKeys;
  spaceBetweenX?: SpacingKeys;
  spaceBetweenY?: SpacingKeys;
  spaceBetweenXReverse?: SpaceBetweenReverse;
  spaceBetweenYReverse?: SpaceBetweenReverse;
};

// ==========================================================================
//                               Sizing
// ==========================================================================
export type SizingPercentStep =
  | '1/2' | '1/3' | '2/3'
  | '1/4' | '2/4' | '3/4'
  | '1/5' | '2/5' | '3/5' | '4/5'
  | '1/6' | '2/6' | '3/6' | '4/6' | '5/6';

export type WidthSystem = SpacingRemStep | SizingPercentStep
  | '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12'
  | '7/12' | '8/12' | '9/12' | '10/12' | '11/12'
  | 'px' | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit';

export type HeightSystem = SpacingRemStep | SizingPercentStep
  | 'px' | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit';

export type MinWidth = 0 | 'full' | 'min' | 'max';
export type MaxWidth = 0 | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'min' | 'max' | 'prose';
export type MinHeight = 0 | 'full' | 'screen';
export type maxHeight = SpacingRemStep | 'px' | 'full' | 'screen';

export type SizingProperty = {
  width?: WidthSystem | Partial<Record<keyof typeof breakpoints, WidthSystem>>;
  minWidth?: MinWidth | Partial<Record<keyof typeof breakpoints, MinWidth>>;
  maxWidth?: MaxWidth | Partial<Record<keyof typeof breakpoints, MaxWidth>>;
  height?: HeightSystem | Partial<Record<keyof typeof breakpoints, HeightSystem>>;
  minHeight?: MinHeight | Partial<Record<keyof typeof breakpoints, MinHeight>>;
  maxHeight?: maxHeight | Partial<Record<keyof typeof breakpoints, maxHeight>>;
}

// ==========================================================================
//                               Position
// ==========================================================================
export type PositionVariant = 'static' | 'fixed' | 'absolute' | 'relative' | 'sticky';
export type PositionSystem = 'px' | '-px' | 'auto' | 'full' | '-full' | '1/2' | '-1/2' | SpacingRemStep | SpacingNegativeRemStep;
export type Position = PositionSystem | Partial<Record<keyof typeof breakpoints, PositionSystem>>;

export type PositionProperty = {
  position?: PositionVariant | Partial<Record<keyof typeof breakpoints, PositionVariant>>;
  inset?: Position;
  insetX?: Position;
  insetY?: Position;
  top?: Position;
  right?: Position;
  bottom?: Position;
  left?: Position;
};

// ==========================================================================
//                               Typography
// ==========================================================================
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
export type FontStyle = 'normal' | 'italic';
export type FontWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextDecoration = 'underline' | 'line-through' | 'none';
export type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none';
export type TextOverflow = 'ellipsis' | 'clip';
export type TextTruncate = true;
export type LineHeight = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
export type LetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
export type VerticalAlign = 'baseline' | 'top' | 'middle' | 'bottom' | 'text-top' | 'text-bottom';
export type WhiteSpace = 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap';
export type WordBreak = 'normal' | 'words' | 'all';
export type ListStyleType = 'none' | 'disc' | 'decimal';
export type ListStylePosition = 'inside' | 'outside';

export type TypographyProperty = {
  color?: Color;
  fontSize?: FontSize | Partial<Record<keyof typeof breakpoints, FontSize>>;
  fontStyle?: FontStyle | Partial<Record<keyof typeof breakpoints, FontStyle>>;
  fontWeight?: FontWeight | Partial<Record<keyof typeof breakpoints, FontWeight>>;
  textOpacity?: OpacityUsual;
  textAlign?: TextAlign | Partial<Record<keyof typeof breakpoints, TextAlign>>;
  textDecoration?: TextDecoration | Partial<Record<keyof typeof breakpoints, TextDecoration>>;
  textTransform?: TextTransform | Partial<Record<keyof typeof breakpoints, TextTransform>>;
  textOverflow?: TextOverflow | Partial<Record<keyof typeof breakpoints, TextOverflow>>;
  textTruncate?: TextTruncate | Partial<Record<keyof typeof breakpoints, TextTruncate>>;
  lineHeight?: LineHeight | Partial<Record<keyof typeof breakpoints, LineHeight>>;
  letterSpacing?: LetterSpacing | Partial<Record<keyof typeof breakpoints, LetterSpacing>>;
  verticalAlign?: VerticalAlign | Partial<Record<keyof typeof breakpoints, VerticalAlign>>;
  whiteSpace?: WhiteSpace | Partial<Record<keyof typeof breakpoints, WhiteSpace>>;
  workBreak?: WordBreak | Partial<Record<keyof typeof breakpoints, WordBreak>>;
  listStyleType?: ListStyleType | Partial<Record<keyof typeof breakpoints, ListStyleType>>;
  listStylePosition?: ListStylePosition | Partial<Record<keyof typeof breakpoints, ListStylePosition>>;
}

// ==========================================================================
//                               Another
// ==========================================================================
export type OpacityProperty = {
  opacity?: Opacity;
}

export type BackgroundProperty = {
  bgColor?: Color;
  bgOpacity?: Opacity;
}
