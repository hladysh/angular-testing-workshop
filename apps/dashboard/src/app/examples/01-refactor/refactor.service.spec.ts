import { getTestBed, TestBed } from '@angular/core/testing';
import { RefactorService } from './refactor.service';
import { Project } from '@workshop/core-data';

describe('RefactorService', () => {
  let injector: TestBed;
  let service: RefactorService;

  const projectStub = { id: '1', title: 'mock', details: 'mock', percentComplete: 10, approved: true, customerId: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefactorService]
    });

    injector = getTestBed();
    service = injector.get(RefactorService);
  });

  it('should call updateProjects and getTotalPercentComplete on reCalculateTotal', () => {
    spyOn(service, 'updateProjects').and.callThrough();
    spyOn(service, 'getTotalPercentComplete').and.callThrough();

    const mockMode = 'create';
    const mockProjects = [];
    const mockProject = {};

    service.reCalculateTotal(mockMode, mockProjects, mockProject);

    expect(service.updateProjects).toHaveBeenCalledWith(mockMode, mockProjects, mockProject);
    expect(service.getTotalPercentComplete).toHaveBeenCalled();
  });

  it('should call the appropriate method depending on mode in updateProjects', () => {
    spyOn(service, 'addProject').and.callThrough();
    spyOn(service, 'updateProject').and.callThrough();
    spyOn(service, 'deleteProject').and.callThrough();

    service.updateProjects('create', [], {});
    expect(service.addProject).toHaveBeenCalledWith([], {});

    service.updateProjects('update', [], {});
    expect(service.updateProject).toHaveBeenCalledWith([], {});

    service.updateProjects('delete', [], {});
    expect(service.deleteProject).toHaveBeenCalledWith([], {});
  });

  it('should add a project on addProject', () => {
    let projects = [];
    const project = { ...projectStub, id: null};

    expect(projects.length).toBe(0);

    projects = service.addProject(projects, project);

    expect(projects.length).toBe(1);
  });

  it('should update a project on updateProject', () => {
    let projects = [projectStub];
    const project = {...projectStub, title: 'UPDATED', details: 'PROJECT', percentComplete: 56};

    projects = service.updateProject(projects, project);

    expect(projects[0]).toEqual(project);
  });

  it('should delete a project on deleteProject', () => {
    let projects = [projectStub];
    const project = projectStub;

    expect(projects.length).toBe(1);

    projects = service.deleteProject(projects, project);

    expect(projects.length).toBe(0);
  });

  it('should get total price on getTotalPercentComplete', () => {

    const projects: Project[] = [
      projectStub,
      {...projectStub, id: '2', percentComplete: 20},
      {...projectStub, id: '3', percentComplete: 30}

    ];

    const total = service.getTotalPercentComplete(projects);

    expect(total).toBe(20);
  });
});
