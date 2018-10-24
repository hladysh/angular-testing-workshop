import { ProjectsLoaded, ProjectsActionTypes, ProjectAdded, ProjectUpdated, ProjectDeleted, ProjectSelected } from './projects.actions';
import {
  ProjectsState,
  initialState,
  projectsReducer
} from './projects.reducer';
import { Project } from '../../projects/project.model';
import { selectCurrentProject, selectCurrentProjectId, emptyProject } from '..';

describe('Projects Reducer', () => {
  const mockProject = { id: '123', title: 'Test', details: 'Testing', percentComplete: 0, approved: false, customerId: '1' };
  it('should return state with unknown action', () => {
    const action = { type: 'DoesNotExist', payload: 'Sample' };
    const actual = projectsReducer(initialState, action as any);
    expect(actual).toEqual(initialState);
  });

  it(`"${ProjectsActionTypes.ProjectsLoaded}" action should replace state with payload`, () => {
    const exampleProjects: Project[] = [mockProject];
    const entities = {
      '123': exampleProjects[0]
    };

    const action: ProjectsLoaded = new ProjectsLoaded(exampleProjects);
    const state = projectsReducer(initialState, action);
    expect(state.entities).toEqual(entities);
  });

  it(`"${ProjectsActionTypes.ProjectAdded}" action should add project to state`, () => {
    const addedProject: Project = mockProject;
    const entities = {
      '123': addedProject
    };

    const action: ProjectAdded = new ProjectAdded(addedProject);
    const state = projectsReducer(initialState, action);
    expect(state.entities).toEqual(entities);
  });

  it(`"${ProjectsActionTypes.ProjectUpdated}" action should update project in state`, () => {
    const existingEntities = { '123': mockProject };
    const existingState = {...initialState, entities: existingEntities};

    const updatedProject: Project = { ...mockProject, details: 'What now??'};

    const action: ProjectUpdated = new ProjectUpdated(updatedProject);
    const state = projectsReducer(existingState, action);
    expect(state.entities['123']).toEqual(updatedProject);
  });

  it(`"${ProjectsActionTypes.ProjectDeleted}" action should remove project from state`, () => {
    const existingEntities = {
      '123': mockProject,
      'another-project': {...mockProject, id: 'another-project', title: 'WAT'},
    };
    const existingState = {...initialState, entities: existingEntities};

    const deletedProject: Project = existingEntities['another-project'];

    const action: ProjectDeleted = new ProjectDeleted(deletedProject);
    const state = projectsReducer(existingState, action);
    expect(state.entities['another-project']).not.toBeTruthy();
  });

  it(`"${ProjectsActionTypes.ProjectSelected}" action should set 'selectedProjectId' in state`, () => {
    const selectedProject = 'project-id';

    const action: ProjectSelected = new ProjectSelected(selectedProject);
    const state = projectsReducer(initialState, action);
    expect(state.selectedProjectId).toBe(selectedProject);
  });

  describe('selectors', () => {
    it('`selectCurrentProjectId` should get currently selected project ID', () => {
      const state = {projects: {...initialState, selectedProjectId: '123'}};
      expect(selectCurrentProjectId(state)).toBe('123');
    });

    describe('`selectCurrentProject`', () => {
      it('should get currently selected project', () => {
        const state = {
          projects: {
            ...initialState,
            selectedProjectId: '123',
            entities: { '123': mockProject }
          }
        };
        expect(selectCurrentProject(state)).toBe(state.projects.entities['123']);
      });

      it('should return an empty project if no selected project', () => {
        const state = {
          projects: {
            ...initialState,
            selectedProjectId: null,
            entities: { '123': mockProject }
          }
        };
        expect(selectCurrentProject(state)).toEqual(emptyProject);
      });
    })
  });
});
