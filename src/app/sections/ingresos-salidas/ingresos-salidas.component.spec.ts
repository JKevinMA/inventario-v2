import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosSalidasComponent } from './ingresos-salidas.component';

describe('IngresosSalidasComponent', () => {
  let component: IngresosSalidasComponent;
  let fixture: ComponentFixture<IngresosSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresosSalidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresosSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
