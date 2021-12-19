import { Exome } from 'exome';

import { undoable } from './undo.store';

export class ActiveStyleStore extends Exome {
  public active: StyleStore | null = null;

  @undoable({
    saveIntermediateActions: true,
    dependencies: [
      'active',
    ],
  })
  public setActive(style: StyleStore | null) {
    this.active = style;
  }
}

export const defaultStyleCss = 'color: white;\nbackground-color: purple;\npadding: 10px;\nborder: 0;';

export class StyleStore extends Exome {
  public constructor(
    public name: string,
    public css = defaultStyleCss,
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
    dependencies: ['css'],
  })
  public setCss(css: string) {
    this.css = css;
  }
}
