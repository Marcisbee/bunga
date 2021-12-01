import { Exome } from 'exome';

export const defaultTokens = '--primary-color: red;';

export class TokenStore extends Exome {
  public tokens = defaultTokens;

  public constructor(public name: string) {
    super();
  }

  public setName(name: string) {
    this.name = name;
  }

  public setTokens(tokens: string) {
    this.tokens = tokens;
  }
}
