import dlv from 'dlv';
import { Exome, addMiddleware, registerLoadable } from 'exome';
import { exomeDevtools } from 'exome/devtools';
import { nanoid } from 'nanoid';
import { BehaviorSubject } from 'rxjs';

import {
  GetProjectByIdDocument,
  GetProjectsByUserDocument,
  InsertProjectDocument,
} from '../graphql';

import { ComponentPositionStore, ComponentStore } from './component.store';
import { edgeGroups } from './edges/all-edges';
import { Edge } from './edges/edge';
import { EdgePosition } from './edges/position';
import { ElementTextStore } from './element-text.store';
import { ElementStore } from './element.store';
import { ProjectDetailsStore, ProjectStore } from './project.store';
import { ShapeStore } from './shape.store';
import { SpaceStore } from './space.store';
import { StyleStore } from './style.store';
import { TokenStore } from './token.store';
import { UserStore } from './user.store';

// Enable devtools in dev mode
if (process.env.NODE_ENV !== 'production') {
  addMiddleware(
    exomeDevtools({
      name: 'Bunga app',
      maxAge: 30,
    }),
  );
}

export interface APISpace {
  id: string;
  name: string;
  edges: APISpaceEdge[];
  components: APISpaceComponent[];
}

export interface APIStyle {
  id: string;
  name: string;
  type: string;
  style: string;
}

export type APISpaceElementTypes = {
  type: 'element';
  ref?: string;
  tag?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  children: APISpaceElementTypes[];
} | {
  type: 'text';
  ref?: string;
  text?: string;
};

interface APISpaceComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type APISpaceComponent = {
  id: string;
  type: 'component';
  name: string;
  position: APISpaceComponentPosition;
  children: APISpaceElementTypes[];
} | {
  id: string;
  type: 'shape';
  style: string;
  name: string;
  position: APISpaceComponentPosition;
  children: APISpaceElementTypes[];
}

type APISpaceEdgeInputTypes = {
  type: 'value';
  value: string | number | boolean | null;
} | {
  type: 'connection';
  from: string;
  path: string;
} | null;

interface APISpaceEdgePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface APISpaceEdge {
  id: string;
  type: string;
  input: Record<string, APISpaceEdgeInputTypes>;
  position: APISpaceEdgePosition;
}

export class Store extends Exome {
  public user = new UserStore();

  public projectsDetails: Record<string, ProjectDetailsStore> = {};

  public projects: Record<string, ProjectStore> = {};

  public activeProject?: ProjectStore;

  public async getProjectById(id: string) {
    if (!this.user.user) {
      return;
    }

    // @TODO: Update the project.
    if (this.projects[id]) {
      return this.activeProject = this.projects[id];
    }

    const output = await this.user.client
      .query(GetProjectByIdDocument, { id })
      .toPromise();

    const project = output.data?.projects_by_pk;

    if (!project) {
      throw new Error('Project was not found');
    }

    const styleStores = (project.styles as APIStyle[])
      .map(({
        id: itemId,
        name,
        type,
        style,
      }) => new StyleStore(name, type, style || '', itemId));
    const tokenStores = project.tokens.map(({ id: itemId, name, tokens }) => new TokenStore(name, tokens || '', itemId));
    if (tokenStores.length === 0) {
      tokenStores.push(new TokenStore('Tokens 1'));
    }

    const spaceStores = (project.spaces as APISpace[]).map((space) => {
      const edges = (space.edges as APISpaceEdge[])?.map((edgeData) => {
        const EdgeConstructor = dlv(edgeGroups, edgeData.type);

        if (!EdgeConstructor) {
          throw new Error(`Edge "${edgeData.type}" not found`);
        }

        const edge: Edge = new EdgeConstructor(
          new EdgePosition(
            'edge',
            edgeData.position.x,
            edgeData.position.y,
            edgeData.position.width,
            edgeData.position.height,
          ),
          edgeData.id,
        );

        return edge;
      });

      (space.edges as APISpaceEdge[])?.forEach((edgeData, index) => {
        const edge = edges[index];

        Object.entries(edgeData.input).forEach(([key, value]) => {
          if (!value) {
            return;
          }

          if (value.type === 'value') {
            const target = edge.input[key];

            if (!(target instanceof BehaviorSubject)) {
              throw new Error(`Edge value "${edgeData.type}.${key}" could not be set`);
            }

            target.next(value.value);

            return;
          }

          if (value.type === 'connection') {
            const target = edge.input[key];

            if (!(target instanceof BehaviorSubject)) {
              throw new Error(`Edge connection "${edgeData.type}.${key}" could not be set`);
            }

            const from = edges.find((e) => e.id === value.from);
            const outputPath = value.path;
            const connection = from?.output[outputPath];

            if (!edge.canConnect(key, from) || !connection) {
              return;
            }

            edge.input[key].next(connection);
            connection.to.push([key, edge]);

            return;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          throw new Error(`Unknown edge type "${(value as any)?.type}"`);
        });
      });

      function buildRecursiveChildren(
        child: APISpaceElementTypes,
      ): ElementStore | ElementTextStore {
        if (child.type === 'element') {
          const ref = components.find((e) => {
            if (e instanceof ComponentStore) {
              return false;
            }

            return e.root.type === child.ref;
          });

          if (ref instanceof ShapeStore) {
            return new ElementStore(
              ref,
              child.props,
              child.children.map(buildRecursiveChildren),
            );
          }

          return new ElementStore(
            child.tag || 'div',
            child.props,
            child.children.map(buildRecursiveChildren),
          );
        }

        if (child.type === 'text') {
          // const ref = edges.find((e) => e.id === child.ref);

          return new ElementTextStore(
            child.text || '',
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        throw new Error(`Unknown child type "${(child as any)?.type}"`);
      }

      const components = (space.components as APISpaceComponent[])?.map((component) => {
        if (component.type === 'component') {
          return new ComponentStore(
            component.id,
            new ComponentPositionStore(
              component.position.x,
              component.position.y,
              component.position.width,
              component.position.height,
            ),
            component.name,
            undefined,
            new ElementStore(
              'root',
              {},
              component.children.map(buildRecursiveChildren),
            ),
          );
        }

        if (component.type === 'shape') {
          return new ShapeStore(
            component.id,
            new ComponentPositionStore(
              component.position.x,
              component.position.y,
              component.position.width,
              component.position.height,
            ),
            component.name,
            styleStores.find((styleStore) => styleStore.id === component.style)!,
            undefined,
            new ElementStore(
              'root',
              {},
              component.children.map(buildRecursiveChildren),
            ),
          );
        }

        throw new Error(`Unknown component type "${(component as any).type}"`);
      });

      return new SpaceStore(
        space.id,
        space.name,
        undefined,
        components,
        edges,
      );
    });

    if (!this.projects[id]) {
      this.projects[id] = new ProjectStore(
        id,
        project.title,
        undefined,
        spaceStores,
        styleStores,
        tokenStores,
      );
    }

    return this.activeProject = this.projects[id];
  }

  public async getProjects() {
    if (!this.user.user) {
      return;
    }

    const output = await this.user.client
      .query(GetProjectsByUserDocument, {
        id: this.user.user.id,
      })
      .toPromise();

    if (!output.data?.projects?.length) {
      return;
    }

    output.data.projects.forEach((project) => {
      this.projectsDetails[project.id] = new ProjectDetailsStore(
        project.id,
        // project.image,
        project.title,
        new Date(project.updated_at),
        new Date(project.created_at),
      );
    });
  }

  public async createProject(title = 'Untitled') {
    if (!this.user.user) {
      return;
    }

    const output = await this.user.client
      .mutation(InsertProjectDocument, {
        title,
        spaceId: nanoid(20),
      })
      .toPromise();

    const project = output.data?.insert_projects_one;

    if (!project) {
      throw new Error('Project creation failed');
    }

    this.projectsDetails[project.id] = new ProjectDetailsStore(
      project.id,
      // project.image,
      project.title,
      new Date(project.updated_at),
      new Date(project.created_at),
    );

    setTimeout(() => {
      this.getProjects();
    }, 200);

    return project.id;
  }
}

registerLoadable({ Store });

export const store = new Store();
