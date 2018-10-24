import { TestBed, getTestBed } from '@angular/core/testing';

import { CustomersService } from './customers.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Customer } from './customer.model';

const BASE_URL = 'http://localhost:3000/customers';

describe('CustomersService', () => {
  let injector: TestBed;
  let service: CustomersService;
  let httpMock: HttpTestingController;

  const customerStub = {
    id: '555',
    firstName: 'Test',
    lastName: 'Tester',
    email: 'a@b.com',
    phone: '1234567890',
    title: 'Developer',
    status: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomersService,
      ]
    });

    injector = getTestBed();
    service = injector.get(CustomersService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  it('#all should fetch all customers', () => {
    const mockCustomers: Customer[] = [
      customerStub,
      { ...customerStub, id: '2' },
      { ...customerStub, id: '3' }
    ];

    const results = service.all();
    results
      .subscribe((customers: Customer[]) => {
        expect(customers.length).toBe(3);
        expect(customers).toEqual(mockCustomers);
      });

    const req = httpMock.expectOne(`${BASE_URL}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });

  it('#create should post a new customer', () => {
    const mockCustomer: Customer = { ...customerStub, id: null };

    const results = service.create(mockCustomer);
    results
      .subscribe(res => {
        // perform additional asserts as necessary
      });

    const req = httpMock.expectOne(`${BASE_URL}`, JSON.stringify(mockCustomer));
    expect(req.request.method).toBe('POST');
    req.flush(mockCustomer);
  });

  it('#update should put an existing customer', () => {
    const mockCustomer: Customer = customerStub;

    const results = service.update(mockCustomer);
    results
      .subscribe(res => {
        // perform additional asserts as necessary
      });

    const req = httpMock.expectOne(`${BASE_URL}/${mockCustomer.id}`, JSON.stringify(mockCustomer));
    expect(req.request.method).toBe('PATCH');
    req.flush(mockCustomer);
  });

  it('#delete should delete an existing customer', () => {
    const mockCustomer: Customer = customerStub;

    const results = service.delete(mockCustomer);
    results
      .subscribe(res => {
        // perform additional asserts as necessary
      });

    const req = httpMock.expectOne(`${BASE_URL}/${mockCustomer.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockCustomer);
  });
});
