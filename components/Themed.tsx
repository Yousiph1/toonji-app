/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import { Text, View} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { ThemeContext } from '../navigation/context'
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & Text['props'];
export type ViewProps = ThemeProps & View['props'];

export function ThemedText(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const {color} = React.useContext(ThemeContext)
//  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textColor = Colors[`${color}` as const].text
  return <Text style={[{ color: textColor }, style]} {...otherProps} />;
}

export function ThemedView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const {color} = React.useContext(ThemeContext)
//  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const bColor = Colors[`${color}` as const].background
  return <View style={[{ backgroundColor: bColor }, style]} {...otherProps} />;
}
