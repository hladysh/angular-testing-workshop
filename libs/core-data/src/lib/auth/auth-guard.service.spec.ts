import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
class AuthServiceStub {
  isAuthenticated$ = new BehaviorSubject(false);
}

@Injectable()
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthGuardService', () => {
  let service: AuthGuardService;
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        {provide: AuthService, useClass: AuthServiceStub},
        {provide: Router, useClass: RouterStub}
      ]
    });

    service = TestBed.get(AuthGuardService);
    router = TestBed.get(Router);
    authService = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#canActivate', () => {
    it('should redirect user to login if not authenticated', () => {
      service.canActivate();
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });

    it('should return `false` if not authenticated', () => {
      expect(service.canActivate()).toBeFalsy();
    });

    it('should return `true` if authenticated', () => {
      authService.isAuthenticated$.next(true);
      expect(service.canActivate()).toBeTruthy();
    });
  });

});
