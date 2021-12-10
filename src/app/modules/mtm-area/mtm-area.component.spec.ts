import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmAreaComponent } from './mtm-area.component';

describe('MtmAreaComponent', () => {
  let component: MtmAreaComponent;
  let fixture: ComponentFixture<MtmAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
