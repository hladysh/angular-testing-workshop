import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
class HttpClientStub {
  post = jasmine.createSpy('post');
}

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {provide: HttpClient, useClass: HttpClientStub}
      ]
    });

    service = TestBed.get(AuthService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#login should post email and password', () => {
    const data = {
      email: 'a@b.com',
      password: 'superdupertrupersecurer'
    };

    service.login(data.email, data.password);
    expect(http.post).toHaveBeenCalledWith('http://localhost:3000/auth/login', data);
  });

  describe('#setToken', () => {
    it('should set `token` value in `localStorage`', () => {
      const token = 'kj12kj3g241hlk3j1k24j';
      spyOn(localStorage, 'setItem');
      service.setToken(token);

      expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
    });

    it('should emit truthy authentication event if token exists', () => {
      const token = 'kj12kj3g241hlk3j1k24j';
      spyOn(service.isAuthenticated$, 'next');
      service.setToken(token);
      expect(service.isAuthenticated$.next).toHaveBeenCalledWith(true);
    });

    it('should emit falsy authentication event if token is blank', () => {
      const token = '';
      spyOn(service.isAuthenticated$, 'next');
      service.setToken(token);
      expect(service.isAuthenticated$.next).toHaveBeenCalledWith(false);
    });
  })

  it('#logout should set a blank token', () => {
    spyOn(service, 'setToken');
    service.logout();
    expect(service.setToken).toHaveBeenCalledWith('');
  });

  it('#getToken should retrieve `token` from `localStorage`', () => {
    const token = 'alsdfjasdf8967a8sdflkj';
    localStorage.setItem('token', token);
    expect(service.getToken()).toBe(token);
  });
});
