import { TestBed } from '@angular/core/testing';

import { TypeOfFireService } from './type-of-fire.service';

describe('TypeOfFireService', () => {
  let service: TypeOfFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeOfFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
