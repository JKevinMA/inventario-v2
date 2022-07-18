import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoSalidaConsolidadaComponent } from './ingreso-salida-consolidada.component';

describe('IngresoSalidaConsolidadaComponent', () => {
  let component: IngresoSalidaConsolidadaComponent;
  let fixture: ComponentFixture<IngresoSalidaConsolidadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoSalidaConsolidadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoSalidaConsolidadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
