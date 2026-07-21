import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMst } from './mat-mst';

describe('MatMst', () => {
  let component: MatMst;
  let fixture: ComponentFixture<MatMst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMst],
    }).compileComponents();

    fixture = TestBed.createComponent(MatMst);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
