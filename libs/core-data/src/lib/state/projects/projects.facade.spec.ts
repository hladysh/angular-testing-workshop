import { NgModule, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/nx/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/nx';

import { ProjectsEffects } from './projects.effects';
import { ProjectsFacade } from './projects.facade';

import { LoadProjects, ProjectsLoaded, ProjectSelected, AddProject, UpdateProject, DeleteProject } from './projects.actions';
import {
  ProjectsState,
  initialState,
  projectsReducer
} from './projects.reducer';
import { Project } from '../../projects/project.model';
import { ProjectsService } from '../../projects/projects.service';
import { CustomersService } from '../../customers/customers.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { of } from 'rxjs';
import { emptyProject } from '..';

interface TestSchema {
  projects: ProjectsState;
}

@Injectable()
class ProjectsServiceStub {
  all() { return of([]) }
  create(project) { return of({}) }
  update(project) { return of({}) }
  delete(project) { return of({}) }
}

@Injectable()
class CustomersServiceStub {}

@Injectable()
class NotificationsServiceStub {
  emit() {}
}

describe('ProjectsFacade', () => {
  let facade: ProjectsFacade;
  let store: Store<TestSchema>;
  let createProjects;

  beforeEach(() => {
    createProjects = (id: string, title = ''): Partial<Project> => ({
      id,
      title: title || `title-${id}`
    });
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({ projects: projectsReducer }),
          EffectsModule.forRoot([ProjectsEffects])
        ],
        providers: [
          ProjectsFacade,
          {provide: ProjectsService, useClass: ProjectsServiceStub},
          {provide: CustomersService, useClass: CustomersServiceStub},
          {provide: NotificationsService, useClass: NotificationsServiceStub}
        ]
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.get(Store);
      facade = TestBed.get(ProjectsFacade);
    });

    it('allProjects$ should return the current list', async done => {
      try {
        let list = await readFirst(facade.allProjects$);

        expect(list.length).toBe(0);

        store.dispatch(new ProjectsLoaded([
            createProjects('AAA'),
            createProjects('BBB')
          ]));

        list = await readFirst(facade.allProjects$);

        expect(list.length).toBe(2);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('currentProject$ should return the currently selected project', async done => {
      try {
        let current = await readFirst(facade.currentProject$);

        expect(current).toBe(emptyProject);

        store.dispatch(new ProjectsLoaded([
            createProjects('AAA'),
            createProjects('BBB')
          ]));

        store.dispatch(new ProjectSelected('BBB'));

        current = await readFirst(facade.currentProject$);

        expect(current.id).toBe('BBB');

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('mutations$ should only stream mutative actions', () => {
      const addProjectAction = new AddProject({} as Project),
        updateProjectAction = new UpdateProject({} as Project),
        deleteProjectAction = new DeleteProject({} as Project);

      const actions = [];
      facade.mutations$.subscribe(mutation => {
        actions.push(mutation);
      });

      store.dispatch(addProjectAction);
      store.dispatch(new LoadProjects());
      store.dispatch(updateProjectAction);
      store.dispatch(new ProjectSelected({}));
      store.dispatch(deleteProjectAction);

      const expectedActions = [addProjectAction, updateProjectAction, deleteProjectAction];

      expect(actions).toEqual(expectedActions);
    });

    describe('dispatchers', () => {
      beforeEach(() => {
        spyOn(store, 'dispatch');
      });

      it('#selectProject should dispatch `ProjectSelected` action with an project ID', () => {
        const expectedAction = new ProjectSelected('AAA');
        facade.selectProject('AAA');
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });

      it('#loadAll should dispatch `LoadProjects` action', () => {
        const expectedAction = new LoadProjects();
        facade.loadProjects();
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });

      it('#addProject should dispatch `AddProject` action with an project', () => {
        const project = createProjects('AAA');
        const expectedAction = new AddProject(project);
        facade.addProject(project);
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });

      it('#updateProject should dispatch `UpdateProject` action with an project', () => {
        const project = createProjects('AAA');
        const expectedAction = new UpdateProject(project);
        facade.updateProject(project);
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });

      it('#deleteProject should dispatch `DeleteProject` action with an project', () => {
        const project = createProjects('AAA');
        const expectedAction = new DeleteProject(project);
        facade.deleteProject(project);
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });
    });
  });
});
