import { useStore } from 'exome/react';

import { Connection } from '../../store/edges/connection';
import { pendingEdge } from '../../store/edges/pending';
import { cc } from '../../utils/class-names';
import connectionStyle from '../connection/connection.module.scss';

import style from './connection-preview.module.scss';

export function ConnectionPreviewComponent() {
  const { from } = useStore(pendingEdge);

  if (from === null) {
    return null;
  }

  const output = from[1].output[from[0]];

  if (!(output instanceof Connection)) {
    return null;
  }

  return (
    <StartConnectionComponent
      connection={output}
    />
  );
}

interface StartConnectionComponentProps {
  connection: Connection;
}

function StartConnectionComponent({ connection }: StartConnectionComponentProps) {
  const { from } = useStore(connection);
  const {
    x,
    y,
    width,
    height,
  } = useStore(from.position);

  useStore(from.position.silent);

  const startX = x + width / 2;
  const startY = y + height + 15;

  return (
    <g
      className={cc([
        connectionStyle.connection,
        style.connection,
      ])}
    >
      <EndConnectionComponent
        startX={startX}
        startY={startY}
      />
    </g>
  );
}

interface EndConnectionComponentProps {
  startX: number;
  startY: number;
}

function EndConnectionComponent({
  startX,
  startY,
}: EndConnectionComponentProps) {
  const { x, y } = useStore(pendingEdge.position);

  const endX = x + startX;
  const endY = y + startY;

  return (
    <path
      d={`M${startX},${startY} C${startX},${startY + (Math.abs(startY - endY) / 2)} ${endX - Math.abs(startX - endX) / 2},${endY} ${endX},${endY}`}
      className={connectionStyle.path}
      markerEnd="none"
    />
  );
}
