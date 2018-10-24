import { TestBed } from '@angular/core/testing';

import { Observable, of, throwError, noop } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot, cold } from '@nrwl/nx/testing';

import { Injectable } from '@angular/core';
import { CustomersService } from '../../customers/customers.service';
import { finalize } from 'rxjs/operators';
import { CustomersEffects } from './customers.effects';
import { CustomersLoaded, LoadCustomers } from './customers.actions';

@Injectable()
class CustomersServiceStub {
  all() {return of(noop())}
}

describe('CustomersEffects', () => {
  let actions$: Observable<any>;
  let effects$: CustomersEffects;
  let customersService: CustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        CustomersEffects,
        DataPersistence,
        provideMockActions(() => actions$),
        { provide: CustomersService, useClass: CustomersServiceStub },
      ]
    });

    effects$ = TestBed.get(CustomersEffects);
    customersService = TestBed.get(CustomersService);
  });

  describe('`loadCustomers$`', () => {
    it('should trigger `CustomersLoaded` action with data from `customersService.all`', () => {
      const customers = [{
        id: '321',
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@b.com',
        phone: '1234567890',
        title: 'Awesome Advocate',
        status: 1
      }];
      spyOn(customersService, 'all').and.returnValue(of(customers));

      actions$ = hot('-a-|', { a: new LoadCustomers() });
      const expected$ = cold('-a-|', { a: new CustomersLoaded(customers) });

      expect(effects$.loadCustomers$).toBeObservable(expected$);
      expect(customersService.all).toHaveBeenCalled();
    });

    it('should log errors', () => {
      spyOn(customersService, 'all').and.returnValue(throwError('That did not go well...'));
      spyOn(console, 'error').and.callThrough();

      actions$ = hot('-a-|', { a: new LoadCustomers() });
      effects$.loadCustomers$
        .pipe(finalize(() => expect(console.error).toHaveBeenCalledWith('Error', 'That did not go well...')))
        .subscribe();
    });
  });
});
