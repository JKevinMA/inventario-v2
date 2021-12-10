import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmAlmacenComponent } from './mtm-almacen.component';

describe('MtmAlmacenComponent', () => {
  let component: MtmAlmacenComponent;
  let fixture: ComponentFixture<MtmAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmAlmacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
