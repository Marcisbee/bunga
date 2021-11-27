import { Exome } from 'exome';

export class TokenStore extends Exome {
  public tokens = '--color-primary: red;';

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
