import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmLocalComponent } from './mtm-local.component';

describe('MtmLocalComponent', () => {
  let component: MtmLocalComponent;
  let fixture: ComponentFixture<MtmLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
