import { TestBed } from '@angular/core/testing';

import { MatMst } from './mat-mst';

describe('MatMst', () => {
  let service: MatMst;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatMst);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
