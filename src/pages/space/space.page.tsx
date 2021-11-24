import { useStore } from 'exome/react';
import { useParams } from 'react-router-dom';

import { store } from '../../store/store';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { LayersComponent } from '../../components/layers/layers.component';
import { StylesComponent } from '../../components/styles/styles.component';
import { allEdges } from '../../store/edges/all-edges';

import style from './space.module.scss';
import { moveStore } from '../../store/move.store';

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
            <button key={edge.title} onClick={() => space.addEdge(edge)}>add {edge.title}</button>
          ))}
          <button
            key={allEdges[0].name}
            onClick={() => {
              const edgesToSelect: any[] = [];

              new Array(10).fill(0).forEach((_, i) => {
                edgesToSelect.push(space.addEdge(allEdges[0]))
              });

              new Array(10).fill(0).forEach((_, i) => {
                const edge = space.addEdge(allEdges[0]);
                if (i === 0) {
                  edge.position.moveTo(-85, 60);
                }
                edgesToSelect.push(edge)
              });

              new Array(10).fill(0).forEach((_, i) => {
                const edge = space.addEdge(allEdges[0]);
                if (i === 0) {
                  edge.position.moveTo(-85, 60 + 100 * 1);
                }
                edgesToSelect.push(edge)
              });

              new Array(10).fill(0).forEach((_, i) => {
                const edge = space.addEdge(allEdges[0]);
                if (i === 0) {
                  edge.position.moveTo(-85, 60 + 100 * 2);
                }
                edgesToSelect.push(edge)
              });

              new Array(10).fill(0).forEach((_, i) => {
                const edge = space.addEdge(allEdges[0]);
                if (i === 0) {
                  edge.position.moveTo(-85, 60 + 100 * 3);
                }
                edgesToSelect.push(edge)
              });

              setTimeout(() => {
                edgesToSelect.forEach((edge, i) => {
                  moveStore.selectEdge(edge, true);
                });
              }, 0);
            }}
          >
            add 50x {allEdges[0].name}
          </button>
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
