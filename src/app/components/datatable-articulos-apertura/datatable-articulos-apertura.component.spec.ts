import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableArticulosAperturaComponent } from './datatable-articulos-apertura.component';

describe('DatatableArticulosAperturaComponent', () => {
  let component: DatatableArticulosAperturaComponent;
  let fixture: ComponentFixture<DatatableArticulosAperturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatatableArticulosAperturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableArticulosAperturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
