import {
  CustomersState,
  initialState,
  customersReducer
} from './customers.reducer';
import { Customer } from '../../customers/customer.model';
import { CustomersLoaded, CustomersActionTypes } from './customers.actions';

describe('Customers Reducer', () => {
  it('should return state with unknown action', () => {
    const action = { type: 'DoesNotExist', payload: 'Sample' };
    const actual = customersReducer(initialState, action as any);
    expect(actual).toEqual(initialState);
  });

  it(`"${CustomersActionTypes.CustomersLoaded}" action should replace state with payload`, () => {
    const exampleCustomers: Customer[] = [{
      id: '321',
      firstName: 'John',
      lastName: 'Doe',
      email: 'a@b.com',
      phone: '1234567890',
      title: 'Awesome Advocate',
      status: 1
    }];
    const entities = { '321': exampleCustomers[0] };

    const action: CustomersLoaded = new CustomersLoaded(exampleCustomers);
    const state = customersReducer(initialState, action);
    expect(state.entities).toEqual(entities);
  });
});
