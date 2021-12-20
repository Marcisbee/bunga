import { Exome } from 'exome';
import { nanoid } from 'nanoid';

import { undoable } from './undo.store';

export const defaultTokens = '--primary-color: red;';

export class TokenStore extends Exome {
  public constructor(
    public name: string,
    public tokens = defaultTokens,
    public id: string = nanoid(20),
  ) {
    super();
  }

  @undoable({
    dependencies: ['name'],
  })
  public setName(name: string) {
    this.name = name;
  }

  @undoable({
    dependencies: ['tokens'],
  })
  public setTokens(tokens: string) {
    this.tokens = tokens;
  }
}
