import { style } from '@vanilla-extract/css';

export const appStyle = style({
  display: 'flex',
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
});

export const middleStyle = style({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
});

export const topStyle = style({
  display: 'block',
  height: 50,
  textAlign: 'center',
  backgroundColor: 'rgb(206, 221, 235)',
});
