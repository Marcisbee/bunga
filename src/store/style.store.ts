import { Exome } from 'exome';

export class ActiveStyleStore extends Exome {
  public active: StyleStore | null = null;

  public setActive(style: StyleStore | null) {
    this.active = style;
  }
}

export class StyleStore extends Exome {
  public css = 'color: white;\nbackground-color: purple;\nborder: 0;';

  public constructor(public name: string) {
    super();
  }

  public setName(name: string) {
    this.name = name;
  }

  public setCss(css: string) {
    this.css = css;
  }
}
