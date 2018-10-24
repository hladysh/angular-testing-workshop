import { NgModule, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/nx/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/nx';

import { CustomersService } from '../../customers/customers.service';
import { Customer } from '../../customers/customer.model';
import { customersReducer, CustomersState } from './customers.reducer';
import { CustomersFacade } from './customers.facade';
import { CustomersEffects } from './customers.effects';
import { LoadCustomers, CustomersLoaded } from './customers.actions';

interface TestSchema {
  customers: CustomersState;
}

@Injectable()
class CustomersServiceStub {}

describe('CustomersFacade', () => {
  let facade: CustomersFacade;
  let store: Store<TestSchema>;
  let createCustomers;

  beforeEach(() => {
    createCustomers = (id: string, firstName = '', lastName = ''): Partial<Customer> => ({
      id,
      firstName: firstName || `firstName-${id}`,
      lastName: lastName || `lastName-${id}`,
    });
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({ customers: customersReducer }),
          EffectsModule.forRoot([CustomersEffects])
        ],
        providers: [
          CustomersFacade,
          {provide: CustomersService, useClass: CustomersServiceStub},
        ]
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.get(Store);
      facade = TestBed.get(CustomersFacade);
    });

    it('allCustomers$ should return the current list', async done => {
      try {
        let list = await readFirst(facade.allCustomers$);

        expect(list.length).toBe(0);

        store.dispatch(new CustomersLoaded([
            createCustomers('AAA'),
            createCustomers('BBB')
          ]));

        list = await readFirst(facade.allCustomers$);

        expect(list.length).toBe(2);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    describe('dispatchers', () => {
      beforeEach(() => {
        spyOn(store, 'dispatch');
      });

      it('#loadCustomers should dispatch `LoadCustomers` action', () => {
        const expectedAction = new LoadCustomers();
        facade.loadCustomers();
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });
    });
  });
});
