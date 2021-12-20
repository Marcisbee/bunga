import dlv from 'dlv';
import { Exome, addMiddleware, registerLoadable } from 'exome';
import { exomeDevtools } from 'exome/devtools';
import { BehaviorSubject } from 'rxjs';

import { GetProjectByIdDocument, GetProjectsByUserDocument, InsertProjectDocument } from '../graphql';

import { ComponentPositionStore, ComponentStore } from './component.store';
import { edgeGroups } from './edges/all-edges';
import { Edge } from './edges/edge';
import { ElementTextEdge } from './edges/element/element-text.edge';
import { ElementEdge } from './edges/element/element.edge';
import { EdgePosition } from './edges/position';
import { ElementTextStore } from './element-text.store';
import { ElementStore } from './element.store';
import { ProjectDetailsStore, ProjectStore } from './project.store';
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

type APISpaceElementTypes = {
  type: 'element';
  ref?: string;
  tag?: string;
  props: Record<string, never>;
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

interface APISpaceComponent {
  id: string;
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
} | {
  type: 'style';
  id: string;
} | null;

interface APISpaceEdgePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface APISpaceEdge {
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

    const output = await this.user.client
      .query(GetProjectByIdDocument, { id })
      .toPromise();

    const project = output.data?.projects_by_pk;

    if (!project) {
      throw new Error('Project was not found');
    }

    const styleStores = project.styles.map(({ id: itemId, name, style }) => new StyleStore(name, style || '', itemId));
    const tokenStores = project.tokens.map(({ id: itemId, name, tokens }) => new TokenStore(name, tokens || '', itemId));
    if (tokenStores.length === 0) {
      tokenStores.push(new TokenStore('Tokens 1'));
    }

    const spaceStores = project.spaces.map((space) => {
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

          if (value.type === 'style') {
            const target = edge.input[key];

            if (!(target instanceof BehaviorSubject)) {
              throw new Error(`Edge style "${edgeData.type}.${key}" could not be set`);
            }

            const styleStore = styleStores.find((s) => s.id === value.id);

            if (!styleStore) {
              return;
            }

            target.next(styleStore);

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
          const ref = edges.find((e) => e.id === child.ref);

          if (ref instanceof ElementEdge) {
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
          const ref = edges.find((e) => e.id === child.ref);

          if (ref instanceof ElementTextEdge) {
            return new ElementTextStore(
              ref,
            );
          }

          return new ElementTextStore(
            child.text || '',
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        throw new Error(`Unknown child type "${(child as any)?.type}"`);
      }

      const components = (space.components as APISpaceComponent[])?.map((component) => (
        new ComponentStore(
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
        )
      ));

      return new SpaceStore(
        space.name,
        undefined,
        components,
        edges,
      );
    });
    if (spaceStores.length === 0) {
      spaceStores.push(new SpaceStore('Space 1'));
    }

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

    // @TODO: Update the project.

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
        content: { name: 123 },
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
