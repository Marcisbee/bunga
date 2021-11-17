import { useStore } from 'exome/react';
import { useParams } from 'react-router-dom';

import { store } from '../../store/store';
import { CanvasComponent } from '../../components/canvas/canvas.component';

import { appStyle, middleStyle, topStyle } from './space.css';
import { LayersComponent } from '../../components/layers/layers.component';
import { StylesComponent } from '../../components/styles/styles.component';

export function SpacePage() {
  const params = useParams();
  const { setActiveSpace } = useStore(store);
  const space = setActiveSpace(params.id!);

  return (
    <div className={appStyle}>
      <div style={{ width: 240 }}>
        Space: {params.id}
        <hr />
        <LayersComponent />
      </div>

      <div className={middleStyle}>
        <div className={topStyle}>
          <span style={{ float: 'right' }}>current people</span>
          <button onClick={space.addAction}>add action</button>
        </div>

        <CanvasComponent
          space={space}
        />
      </div>

      <div style={{ width: 240 }}>
        <StylesComponent />
      </div>
    </div>
  );
}
