import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmTipoInventarioComponent } from './mtm-tipo-inventario.component';

describe('MtmTipoInventarioComponent', () => {
  let component: MtmTipoInventarioComponent;
  let fixture: ComponentFixture<MtmTipoInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmTipoInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmTipoInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
