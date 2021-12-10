import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmArticuloComponent } from './mtm-articulo.component';

describe('MtmArticuloComponent', () => {
  let component: MtmArticuloComponent;
  let fixture: ComponentFixture<MtmArticuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmArticuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
