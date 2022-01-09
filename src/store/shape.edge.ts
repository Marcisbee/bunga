import { Exome } from 'exome';
import { nanoid } from 'nanoid';

import { StyleStore } from './style.store';

export class ShapeStore extends Exome {
  public constructor(
    public style: StyleStore,
    public id: string = nanoid(20),
  ) {
    super();
  }
}
