import { useStore } from 'exome/react';
import { useParams } from 'react-router-dom';

import { store } from '../../store/store';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { LayersComponent } from '../../components/layers/layers.component';
import { StylesComponent } from '../../components/styles/styles.component';
import { VariableEdge } from '../../store/edges/variable.edge';
import { MathAddEdge } from '../../store/edges/math-add.edge';

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
          <button onClick={space.addAction}>add action</button>
          <button onClick={() => space.addEdge(VariableEdge)}>add variable edge</button>
          <button onClick={() => space.addEdge(MathAddEdge)}>add Math(+) edge</button>
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
