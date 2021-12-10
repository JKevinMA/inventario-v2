import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmEmpresaComponent } from './mtm-empresa.component';

describe('MtmEmpresaComponent', () => {
  let component: MtmEmpresaComponent;
  let fixture: ComponentFixture<MtmEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
