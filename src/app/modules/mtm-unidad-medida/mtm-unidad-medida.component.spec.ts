import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmUnidadMedidaComponent } from './mtm-unidad-medida.component';

describe('MtmUnidadMedidaComponent', () => {
  let component: MtmUnidadMedidaComponent;
  let fixture: ComponentFixture<MtmUnidadMedidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmUnidadMedidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmUnidadMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
