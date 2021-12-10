import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmArticuloTipoInventarioComponent } from './mtm-articulo-tipo-inventario.component';

describe('MtmArticuloTipoInventarioComponent', () => {
  let component: MtmArticuloTipoInventarioComponent;
  let fixture: ComponentFixture<MtmArticuloTipoInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmArticuloTipoInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmArticuloTipoInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
