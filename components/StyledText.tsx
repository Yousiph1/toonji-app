import * as React from 'react';

import { ThemedText, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <ThemedText {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}
