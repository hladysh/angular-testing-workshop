import { TestBed, async } from '@angular/core/testing';

import { Observable, of, throwError } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot, cold } from '@nrwl/nx/testing';

import { ProjectsEffects } from './projects.effects';
import { LoadProjects, ProjectsLoaded, AddProject, ProjectAdded, UpdateProject, ProjectUpdated, DeleteProject, ProjectDeleted } from './projects.actions';
import { Injectable } from '@angular/core';
import { ProjectsService } from '../../projects/projects.service';
import { CustomersService } from '../../customers/customers.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { finalize } from 'rxjs/operators';
import { Project } from '../../projects/project.model';

@Injectable()
class ProjectsServiceStub {
  all() { return of([]) }
  create(project) { return of({}) }
  update(project) { return of({}) }
  delete(project) { return of({}) }
}

@Injectable()
class CustomersServiceStub { }

@Injectable()
class NotificationsServiceStub {
  emit() { }
}

describe('ProjectsEffects', () => {
  let actions$: Observable<any>;
  let effects$: ProjectsEffects;
  let projectsService: ProjectsService;

  const mockProject = { id: '123', title: 'Test', details: 'Testing', percentComplete: 0, approved: false, customerId: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        ProjectsEffects,
        DataPersistence,
        provideMockActions(() => actions$),
        { provide: ProjectsService, useClass: ProjectsServiceStub },
        { provide: CustomersService, useClass: CustomersServiceStub },
        { provide: NotificationsService, useClass: NotificationsServiceStub }
      ]
    });

    effects$ = TestBed.get(ProjectsEffects);
    projectsService = TestBed.get(ProjectsService);
  });

  describe('`loadProjects$`', () => {
    it('should trigger `ProjectsLoaded` action with data from `projectsService.all`', () => {
      const projects = [mockProject];
      spyOn(projectsService, 'all').and.returnValue(of(projects));

      actions$ = hot('-a-|', { a: new LoadProjects() });
      const expected$ = cold('-a-|', { a: new ProjectsLoaded(projects) });

      expect(effects$.loadProjects$).toBeObservable(expected$);
      expect(projectsService.all).toHaveBeenCalled();
    });

    it('should log errors', () => {
      spyOn(projectsService, 'all').and.returnValue(throwError('That did not go well...'));
      spyOn(console, 'error').and.callThrough();

      actions$ = hot('-a-|', { a: new LoadProjects() });
      effects$.loadProjects$
        .pipe(finalize(() => expect(console.error).toHaveBeenCalledWith('Error', 'That did not go well...')))
        .subscribe();
    });
  });

  describe('`addProject$`', () => {
    it('should trigger `ProjectAdded` action with data from `projectsService.create`', () => {
      const project = {...mockProject, id: null};
      const createdProject = { ...project, id: 'jhh14-created' };
      spyOn(projectsService, 'create').and.returnValue(of(createdProject));

      actions$ = hot('-a-|', { a: new AddProject(project) });
      const expected$ = cold('-a-|', { a: new ProjectAdded(createdProject) });

      expect(effects$.addProject$).toBeObservable(expected$);
      expect(projectsService.create).toHaveBeenCalledWith(project);
    });

    it('should log errors', () => {
      spyOn(projectsService, 'create').and.returnValue(throwError('That did not go well...'));
      spyOn(console, 'error').and.callThrough();

      actions$ = hot('-a-|', { a: new AddProject({} as Project) });
      effects$.addProject$
        .pipe(finalize(() => expect(console.error).toHaveBeenCalledWith('Error', 'That did not go well...')))
        .subscribe();
    });
  });

  describe('`updateProject$`', () => {
    it('should trigger `ProjectUpdated` action with data from `projectsService.update`', () => {
      const project = mockProject;
      const updatedProject = { ...project, title: 'Updated', details: 'Different' };
      spyOn(projectsService, 'update').and.returnValue(of(updatedProject));

      actions$ = hot('-a-|', { a: new UpdateProject(project) });
      const expected$ = cold('-a-|', { a: new ProjectUpdated(updatedProject) });

      expect(effects$.updateProject$).toBeObservable(expected$);
      expect(projectsService.update).toHaveBeenCalledWith(project);
    });

    it('should log errors', () => {
      spyOn(projectsService, 'update').and.returnValue(throwError('That did not go well...'));
      spyOn(console, 'error').and.callThrough();

      actions$ = hot('-a-|', { a: new UpdateProject({} as Project) });
      effects$.updateProject$
        .pipe(finalize(() => expect(console.error).toHaveBeenCalledWith('Error', 'That did not go well...')))
        .subscribe();
    });
  });

  describe('`deleteProject$`', () => {
    it('should trigger `ProjectDeleted` action with data from `projectsService.delete`', () => {
      const project = mockProject;
      spyOn(projectsService, 'delete').and.returnValue(of(project));

      actions$ = hot('-a-|', { a: new DeleteProject(project) });
      const expected$ = cold('-a-|', { a: new ProjectDeleted(project) });

      expect(effects$.deleteProject$).toBeObservable(expected$);
      expect(projectsService.delete).toHaveBeenCalledWith(project);
    });

    it('should log errors', () => {
      spyOn(projectsService, 'delete').and.returnValue(throwError('That did not go well...'));
      spyOn(console, 'error').and.callThrough();

      actions$ = hot('-a-|', { a: new DeleteProject({} as Project) });
      effects$.deleteProject$
        .pipe(finalize(() => expect(console.error).toHaveBeenCalledWith('Error', 'That did not go well...')))
        .subscribe();
    });
  });
});
