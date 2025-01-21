import { TestBed } from '@angular/core/testing';

import { EventGroupsService } from './event-groups.service';

describe('EventGroupsService', () => {
  let service: EventGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
