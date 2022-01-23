import { getExomeId } from 'exome';
import { useStore } from 'exome/react';

import { Connection } from '../../store/edges/connection';
import { Edge } from '../../store/edges/edge';
import { EdgePosition } from '../../store/edges/position';
import { cc } from '../../utils/class-names';

import styles from './connection.module.scss';

interface ConnectionComponentProps {
  edge: Edge;
}

export function ConnectionComponent({ edge }: ConnectionComponentProps) {
  const { output } = useStore(edge);

  return (
    <>
      {Object.keys(output).map((key) => (
        <StartConnectionComponent
          key={`con-${getExomeId(edge)}-${key}`}
          edge={edge}
          connection={output[key]}
        />
      ))}
    </>
  );
}

interface StartConnectionComponentProps {
  edge: Edge;
  connection: Connection;
}

function StartConnectionComponent({ edge, connection }: StartConnectionComponentProps) {
  const { from, to } = useStore(connection);
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
        styles.connection,
        // edge instanceof ActionStyleStore && styles.styleConnection,
      ])}
    >
      {to.map(([input, end]) => (
        <EndConnectionComponent
          key={`con-end-${input}-${getExomeId(end)}`}
          index={Object.keys(end.input).indexOf(input) + 1}
          startX={startX}
          startY={startY}
          position={end.position}
        />
      ))}
    </g>
  );
}

interface EndConnectionComponentProps {
  position: EdgePosition;
  index: number;
  startX: number;
  startY: number;
}

function EndConnectionComponent({
  startX, startY, index, position,
}: EndConnectionComponentProps) {
  const {
    x,
    y,
    width,
    height,
    type,
  } = useStore(position);

  useStore(position.silent);

  if (!width && !height) {
    return (
      <path
        d={`M${startX},${startY} C${startX},${startY + (Math.abs(startY - y) / 2)} ${x},${y - Math.abs(startY - y) / 2} ${x},${y}`}
        className={styles.path}
        markerEnd="none"
      />
    );
  }

  if (type === 'element') {
    const endX = x;
    const endY = y + (height / 2);

    return (
      <path
        d={`M${startX},${startY} C${startX},${startY + (Math.abs(startY - endY) / 2)} ${endX - Math.abs(startX - endX) / 2},${endY} ${endX},${endY}`}
        className={styles.path}
        markerEnd="none"
      />
    );
  }

  const endX = x - 15;
  const endY = y + 26 + (index * 18);

  return (
    <path
      d={`M${startX},${startY} C${startX},${startY + (Math.abs(startY - endY) / 2)} ${endX - Math.abs(startX - endX) / 2},${endY} ${endX},${endY}`}
      className={styles.path}
      markerEnd="none"
    />
  );
}
