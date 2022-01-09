import { Exome, registerLoadable } from 'exome';
import { nanoid } from 'nanoid';

import {
  SaveProjectDocument,
  SaveTokensDocument,
} from '../graphql';
import { permalink } from '../utils/permalink';

import { Connection } from './edges/connection';
import { ElementTextEdge } from './edges/element/element-text.edge';
import { ElementEdge } from './edges/element/element.edge';
import { ElementTextStore } from './element-text.store';
import { ElementStore } from './element.store';
import { SpaceStore } from './space.store';
import {
  APISpace,
  APISpaceComponent,
  APISpaceEdge,
  APISpaceElementTypes,
  APIStyle,
  store,
} from './store';
import { ActiveStyleStore, StyleStore } from './style.store';
import { TokenStore } from './token.store';
import { undoable } from './undo.store';

export class ProjectStore extends Exome {
  public activeSpace: SpaceStore;

  public activeStyle = new ActiveStyleStore();

  public customBlockElements: ElementEdge[] = [];

  public customTextElements: ElementTextEdge[] = [];

  constructor(
    public id: string,
    public name: string,
    public path: string = permalink(name),
    public spaces: SpaceStore[] = [],
    public styles: StyleStore[] = [],
    public tokens: TokenStore[] = [
      new TokenStore(`${name} Tokens`),
    ],
  ) {
    super();

    const activeSpaceId = new URLSearchParams(window.location.search).get('space');
    const activeSpace = spaces.find((space) => space.id === activeSpaceId);

    if (activeSpaceId && activeSpace) {
      this.activeSpace = activeSpace;
    } else {
      [this.activeSpace] = this.spaces;
    }
  }

  @undoable({
    saveIntermediateActions: true,
    dependencies: ['activeSpace'],
  })
  public setActiveSpace(space: SpaceStore): SpaceStore {
    this.activeSpace = space;
    return space;
  }

  @undoable({
    saveIntermediateActions: true,
    dependencies: [
      'spaces',
      'activeSpace',
    ],
  })
  public addSpace(name = `Space ${this.spaces.length + 1}`) {
    if (!store.user.client) {
      return;
    }

    const space = new SpaceStore(nanoid(20), name);

    this.spaces.push(space);
    this.activeSpace = space;
  }

  @undoable({
    saveIntermediateActions: true,
    dependencies: [
      'spaces',
      'activeSpace',
    ],
  })
  public removeSpace(space: SpaceStore) {
    if (this.spaces.length <= 1) {
      return;
    }

    const index = this.spaces.indexOf(space);

    this.spaces.splice(index, 1);

    if (space === this.activeSpace) {
      this.activeSpace = this.spaces[Math.max(0, index - 1)];
    }
  }

  @undoable({
    saveIntermediateActions: true,
    dependencies: [
      'styles',
      'activeStyle',
    ],
  })
  public addStyle() {
    if (!store.user.client) {
      return;
    }

    const name = `Style ${this.styles.length + 1}`;

    const style = new StyleStore(name);

    this.styles.push(style);
    this.activeStyle.setActive(style);

    return style;
  }

  @undoable({
    dependencies: [
      'name',
      'path',
    ],
  })
  public rename(name: string, path: string = permalink(name)) {
    this.name = name;
    this.path = path;
  }

  public save = async () => {
    if (!store.user.user) {
      return;
    }

    const stylesData = this.styles
      .map(({
        id: itemId,
        name,
        type,
        css,
      }) => ({
        id: itemId,
        name,
        type,
        style: css,
      } as APIStyle));

    const spacesData = this.spaces
      .map(({
        id: itemId,
        name,
        edges,
        components,
      }) => ({
        id: itemId,
        name,
        edges: edges.map((edge) => {
          const output: APISpaceEdge = {
            id: edge.id,
            type: edge.type,
            input: {},
            position: {
              x: edge.position.x,
              y: edge.position.y,
              width: edge.position.width,
              height: edge.position.height,
            },
          };

          Object.entries(edge.input).forEach(([key, value]) => {
            const data = value.getValue();

            if (data instanceof Connection) {
              output.input[key] = {
                type: 'connection',
                from: data.from.id,
                path: data.path,
              };
              return;
            }

            if (data instanceof StyleStore) {
              output.input[key] = {
                type: 'style',
                id: data.id,
              };
              return;
            }

            output.input[key] = {
              type: 'value',
              value: data,
            };
          });

          return output;
        }),
        components: components.map((component) => {
          function buildChildrenList(
            child: ElementStore | ElementTextStore,
          ): APISpaceElementTypes {
            if (child instanceof ElementStore) {
              if (child.type instanceof ElementEdge) {
                return {
                  type: 'element',
                  ref: child.type.id,
                  props: child.props,
                  children: child.children.map(buildChildrenList),
                };
              }

              return {
                type: 'element',
                tag: child.type,
                props: child.props,
                children: child.children.map(buildChildrenList),
              };
            }

            if (child instanceof ElementTextStore) {
              if (child.text instanceof ElementTextEdge) {
                return {
                  type: 'text',
                  ref: child.text.id,
                };
              }

              return {
                type: 'text',
                text: child.text,
              };
            }

            return {
              type: 'text',
              text: '',
            };
          }

          const output: APISpaceComponent = {
            id: component.id,
            name: component.name,
            children: component.root.children.map(buildChildrenList),
            position: {
              x: component.position.x,
              y: component.position.y,
              width: component.position.width,
              height: component.position.height,
            },
          };

          return output;
        }),
      } as APISpace));

    const tokensPromises = this.tokens
      .map(({ id: itemId, name, tokens }) => (
        store.user.client
          .mutation(SaveTokensDocument, {
            id: itemId,
            name,
            tokens,
          })
          .toPromise()
      ));

    const projectPromise = store.user.client
      .mutation(SaveProjectDocument, {
        id: this.id,
        title: this.name,
        spaces: spacesData,
        styles: stylesData,
      })
      .toPromise();

    await Promise.all([
      ...tokensPromises,
      projectPromise,
    ]);
  };
}

export class ProjectDetailsStore extends Exome {
  constructor(
    public id: string,
    public title: string,
    public updatedAt: Date,
    public createdAt: Date,
  ) {
    super();
  }
}

registerLoadable({ ProjectStore, ProjectDetailsStore });
