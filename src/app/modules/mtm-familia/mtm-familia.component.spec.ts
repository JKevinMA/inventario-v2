import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmFamiliaComponent } from './mtm-familia.component';

describe('MtmFamiliaComponent', () => {
  let component: MtmFamiliaComponent;
  let fixture: ComponentFixture<MtmFamiliaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmFamiliaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmFamiliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
