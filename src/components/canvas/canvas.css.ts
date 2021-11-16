import { style } from '@vanilla-extract/css';

export const canvasStyle = style({
  flexGrow: 1,
  display: 'block',
  overflow: 'hidden',
  position: 'relative',
  transform: 'translate3d(0,0,0)',
  willChange: 'transform',
  backgroundColor: 'aliceblue',
  userSelect: 'none',
  backgroundSize: '20px 20px',
  backgroundImage: 'radial-gradient(circle, rgb(214, 227, 240) 1px, rgba(0, 0, 0, 0) 1px)',
  backgroundPosition: '0px 0px',
});

export const canvasRootStyle = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate3d(0,0,0)',
  willChange: 'transform',
  pointerEvents: 'none',
});

export const canvasContainerStyle = style({
  transform: 'translate3d(-50%, -50%, 0)',
  willChange: 'transform',
});
