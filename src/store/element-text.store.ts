import { Exome, registerLoadable } from 'exome';

export class ElementTextStore extends Exome {
  constructor(
    // public text: string | StyleProperty,
    public text: string,
  ) {
    super();
  }

  public setText(text: string) {
    this.text = text;
  }
}

registerLoadable({ ElementTextStore });
