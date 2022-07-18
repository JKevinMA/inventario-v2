import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomaConsolidadaComponent } from './toma-consolidada.component';

describe('TomaConsolidadaComponent', () => {
  let component: TomaConsolidadaComponent;
  let fixture: ComponentFixture<TomaConsolidadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TomaConsolidadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TomaConsolidadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
