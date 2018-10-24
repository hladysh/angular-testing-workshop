import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RemoteService } from './remote.service';

const BASE_URL = 'http://localhost:3000/projects/';

interface Project {
  id: string;
  title: string;
  details: string;
  percentComplete: number;
  approved: boolean;
  customerId: string;
}

describe('RemoteService', () => {
  let injector: TestBed;
  let service: RemoteService;
  let httpMock: HttpTestingController;

  const projectStub = { id: '1', title: 'mock', details: 'mock', percentComplete: 10, approved: true, customerId: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RemoteService]
    });

    injector = getTestBed();
    service = injector.get(RemoteService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all projects', () => {
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

  it('should post a new project', () => {
    const mockProject: Project = {...projectStub, id: null};
    const results = service.create(mockProject);

    results.subscribe(r => {});

    const req = httpMock.expectOne(`${BASE_URL}`, JSON.stringify(mockProject));
    expect(req.request.method).toBe('POST');
    req.flush(mockProject);
  });

  it('should put an existing project', () => {
    const mockProject: Project = projectStub;
    const results = service.update(mockProject);

    results.subscribe(r => {});

    const req = httpMock.expectOne(`${BASE_URL}${mockProject.id}`, JSON.stringify(mockProject));
    expect(req.request.method).toBe('PATCH');
    req.flush(mockProject);
  });

  it('should delete an existing project', () => {
    const mockProject: Project = projectStub;
    const results = service.delete(mockProject);

    results.subscribe(r => {});

    const req = httpMock.expectOne(`${BASE_URL}${mockProject.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockProject);
  });

});
