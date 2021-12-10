import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizacionComponent } from './finalizacion.component';

describe('FinalizacionComponent', () => {
  let component: FinalizacionComponent;
  let fixture: ComponentFixture<FinalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
