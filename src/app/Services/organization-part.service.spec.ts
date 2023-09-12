import { TestBed } from '@angular/core/testing';

import { OrganizationPartService } from './organization-part.service';

describe('OrganizationPartService', () => {
  let service: OrganizationPartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationPartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
