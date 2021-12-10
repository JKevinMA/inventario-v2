import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomaComponent } from './toma.component';

describe('TomaComponent', () => {
  let component: TomaComponent;
  let fixture: ComponentFixture<TomaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TomaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
