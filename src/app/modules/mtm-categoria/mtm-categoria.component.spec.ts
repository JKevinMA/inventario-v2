import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmCategoriaComponent } from './mtm-categoria.component';

describe('MtmCategoriaComponent', () => {
  let component: MtmCategoriaComponent;
  let fixture: ComponentFixture<MtmCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmCategoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
