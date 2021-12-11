import { Exome } from 'exome';

import { undoable } from './undo.store';

export const defaultTokens = '--primary-color: red;';

export class TokenStore extends Exome {
  public tokens = defaultTokens;

  public constructor(public name: string) {
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
