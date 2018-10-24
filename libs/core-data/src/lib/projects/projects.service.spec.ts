import { TestBed, getTestBed } from '@angular/core/testing';

import { ProjectsService } from './projects.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Project } from './project.model';
import { Injectable } from '@angular/core';
import { NotificationsService } from '../notifications/notifications.service';

const BASE_URL = 'http://localhost:3000/projects';

@Injectable()
class NotificationsServiceStub {}

describe('ProjectsService', () => {
  let injector: TestBed;
  let service: ProjectsService;
  let httpMock: HttpTestingController;

  const projectStub = { id: '123', title: 'Test', details: 'Testing', percentComplete: 0, approved: false, customerId: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProjectsService,
        {provide: NotificationsService, useClass: NotificationsServiceStub}
      ]
    });

    injector = getTestBed();
    service = injector.get(ProjectsService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  it('#all should fetch all projects', () => {
    const mockProjects: Project[] = [
      projectStub,
      {...projectStub, id: '2'},
      {...projectStub, id: '3'}
    ];

    const results = service.all();
    results
      .subscribe((projects: Project[]) => {
        expect(projects.length).toBe(3);
        expect(projects).toEqual(mockProjects);
      });

    const req = httpMock.expectOne(`${BASE_URL}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });

  it('#create should post a new project', () => {
    const mockProject: Project = {...projectStub, id: null};

    const results = service.create(mockProject);
    results
      .subscribe(res => {
        // perform additional asserts as necessary
      });

    const req = httpMock.expectOne(`${BASE_URL}`, JSON.stringify(mockProject));
    expect(req.request.method).toBe('POST');
    req.flush(mockProject);
  });

  it('#update should put an existing project', () => {
    const mockProject: Project = projectStub;

    const results = service.update(mockProject);
    results
      .subscribe(res => {
        // perform additional asserts as necessary
      });

    const req = httpMock.expectOne(`${BASE_URL}/${mockProject.id}`, JSON.stringify(mockProject));
    expect(req.request.method).toBe('PATCH');
    req.flush(mockProject);
  });

  it('#delete should delete an existing project', () => {
    const mockProject: Project = projectStub;

    const results = service.delete(mockProject);
    results
      .subscribe(res => {
        // perform additional asserts as necessary
      });

    const req = httpMock.expectOne(`${BASE_URL}/${mockProject.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockProject);
  });
});
