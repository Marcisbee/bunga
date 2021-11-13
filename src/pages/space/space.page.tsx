import { useStore } from 'exome/react';
import { useParams } from 'react-router-dom';

import { store } from '../../store/store';
import { CanvasComponent } from '../../components/canvas/canvas.component';

import { appStyle, middleStyle, topStyle } from './space.css';

export function SpacePage() {
  const params = useParams();
  const { setActiveSpace } = useStore(store);
  const space = setActiveSpace(params.id!);
  const { name, components, addComponent } = useStore(space);

  return (
    <div className={appStyle}>
      <div style={{ width: 200 }}>
        Layers {params.id} : {name}

        <div>
          <strong>Components</strong>
          <ul>
            {components.map(({ id, name }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
          <button onClick={addComponent}>add component</button>
        </div>
      </div>

      <div className={middleStyle}>
        <div className={topStyle}>
          <button>add component</button>
          <button>add action</button>

          <span style={{ float: 'right' }}>current people</span>
        </div>

        <CanvasComponent
          space={space}
        />
      </div>

      {/* <div style={{ width: 100 }}>
        options
      </div> */}
    </div>
  );
}
