import TinyGesture from 'tinygesture';
import { useLayoutEffect, useState, useRef } from 'react';

import logo from './logo.svg';

import './App.css';
import { positionStore } from './store';

function Counter() {
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setCount(Math.random());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <p>Count: {count}</p>
  );
}

function App() {
  const canvas = useRef(null);
  const canvasRoot = useRef(null);
  // const position = useRef({ x: 0, y: 0 });
  
  useLayoutEffect(() => {
    const gesture = new TinyGesture(canvas.current, {
      mouseSupport: false,
    });

    const handler = (e) => {
      e.preventDefault()

      // console.log(e);

      positionStore.x -= e.deltaX
      positionStore.y -= e.deltaY

      const x = `${positionStore.x}px`;
      const y = `${positionStore.y}px`;

      canvas.current.style.backgroundPosition = `${x} ${y}`;
      canvasRoot.current.style.transform = `translateX(${positionStore.x}px) translateY(${positionStore.y}px)`;
    }

    const handlerMove = () => {
      const x = `${positionStore.x + gesture.touchMoveX}px`;
      const y = `${positionStore.y + gesture.touchMoveY}px`;

      canvas.current.style.backgroundPosition = `${x} ${y}`;
      canvasRoot.current.style.transform = `translateX(${x}) translateY(${y})`;
    }

    const handlerMoveEnd = () => {
      positionStore.x += gesture.touchMoveX;
      positionStore.y += gesture.touchMoveY;
    }

    canvas.current.addEventListener('wheel', handler);

    gesture.on('panmove', handlerMove);
    gesture.on('panend', handlerMoveEnd);

    return () => {
      canvas.current.removeEventListener('wheel', handler);
      gesture.destroy();
    };
  }, []);

  return (
    <div id="app">
      <div style={{ width: 200 }}>
        Layers
      </div>

      <div id="middle">
        <div id="top">
          <button>add component</button>
          <button>add action</button>

          <span style={{ float: 'right' }}>current people</span>
        </div>

        <div ref={canvas} id="canvas" style={{ backgroundPosition: `${positionStore.x}px ${positionStore.y}px`}}>
          <div ref={canvasRoot} id="canvasRoot" style={{ transform: `translate3d(${positionStore.x}px, ${positionStore.y}px)` }}>
            <div id="canvasContainer">
              <div
                className="canvasObject"
                style={{
                  width: 100,
                  height: 100,
                  transform: 'translate3d(-100px, -50px, 0)',
                }}
              >
                <img src={logo} width={100} />
              </div>
              <div
                className="canvasObject"
                style={{
                  width: 100,
                  height: 140,
                  transform: 'translate3d(-50px, 50px, 0)',
                }}
              >
                <h3>React</h3>
                <Counter />
                <div style={{ backgroundColor: 'red', boxShadow: '2px 10px 10px pink'}}>asd</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div style={{ width: 100 }}>
        options
      </div> */}
    </div>
  );
}

export default App;
