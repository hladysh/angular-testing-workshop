import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { noop } from 'rxjs/internal-compatibility';

import { RemoteComponent } from './remote.component';
import { RemoteService } from './remote.service';

interface Project {
  id: string;
  title: string;
  details: string;
  percentComplete: number;
  approved: boolean;
  customerId: string;
}

class RemoteServiceStub {
  all() { return of(noop())}
  create() { return of(noop()) }
  update() { return of(noop()) }
  delete() { return of(noop()) }
}

describe('RemoteComponent', () => {
  let component: RemoteComponent;
  let fixture: ComponentFixture<RemoteComponent>;
  let debugElement: DebugElement;
  let service: RemoteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
          RemoteComponent
        ],
        providers: [
          {provide: RemoteService, useClass: RemoteServiceStub}
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    service = debugElement.injector.get(RemoteService);
    fixture.detectChanges();
  });

  it('should call remoteService.all on getProjects', () => {
    spyOn(service, 'all').and.callThrough();

    component.getProjects();

    expect(service.all).toHaveBeenCalled();
  });

  it('should call remoteService.create on createProject', () => {
    const mockProject: Project = { id: null, title: 'mock', details: 'mock', percentComplete: 10, approved: true, customerId: '1' };
    spyOn(service, 'create').and.callThrough();

    component.createProject(mockProject);

    expect(service.create).toHaveBeenCalledWith(mockProject);
  });
});
