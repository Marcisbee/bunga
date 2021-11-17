import { globalStyle, style } from '@vanilla-extract/css';

export const nameStyle = style({
  display: 'block',
  whiteSpace: 'nowrap',
  fontSize: 12,
  color: '#b2c0cd',
  paddingBottom: 5,
  fontWeight: 'normal',
  letterSpacing: 0.55,
});

export const containerStyle = style({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 1,
  // boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
  borderRadius: 5,
  // pointerEvents: 'none',
  backgroundColor: '#fff',
  position: 'relative',
});

export const activeStyle = style({});

globalStyle(`${containerStyle}::after`, {
  display: 'block',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  content: '',
  boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
  borderRadius: 'inherit',
  pointerEvents: 'none',
});

globalStyle(`:not(${activeStyle}):hover > ${containerStyle}::after`, {
  boxShadow: '0 2px 4px rgba(0,0,0,0.12), 0 0 0 1px #c5e3f5',
});

// globalStyle(`:not(${activeStyle}):hover > ${containerStyle}`, {
//   boxShadow: '0 2px 4px rgba(0,0,0,0.12), 0 0 0 1px #c5e3f5',
// });

globalStyle(`${activeStyle} > ${nameStyle}`, {
  color: '#2196f3',
  fontWeight: 500,
  letterSpacing: 0.4,
});

globalStyle(`${activeStyle} > ${containerStyle}::after`, {
  boxShadow: '0 2px 4px rgba(0,0,0,0.12), 0 0 0 2px #2196f3',
});

export const objectStyle = style({
  display: 'flex',
  position: 'absolute',
  pointerEvents: 'all',
  overflow: 'visible',
  flexDirection: 'column',
  alignItems: 'stretch',
});
