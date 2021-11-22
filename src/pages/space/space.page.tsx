import { useStore } from 'exome/react';
import { useParams } from 'react-router-dom';

import { store } from '../../store/store';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { LayersComponent } from '../../components/layers/layers.component';
import { StylesComponent } from '../../components/styles/styles.component';
import { allEdges } from '../../store/edges/all-edges';

import style from './space.module.scss';

export function SpacePage() {
  const params = useParams();
  const { setActiveSpace } = useStore(store);
  const space = setActiveSpace(params.id!);

  return (
    <div className={style.app}>
      <div style={{ width: 240 }}>
        Space: {params.id}
        <hr />
        <LayersComponent />
      </div>

      <div className={style.middle}>
        <div className={style.top}>
          <span style={{ float: 'right' }}>current people</span>
          {allEdges.map((edge) => (
            <button key={edge.name} onClick={() => space.addEdge(edge)}>add {edge.name}</button>
          ))}
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
