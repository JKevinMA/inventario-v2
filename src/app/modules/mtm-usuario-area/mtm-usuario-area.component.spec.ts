import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmUsuarioAreaComponent } from './mtm-usuario-area.component';

describe('MtmUsuarioAreaComponent', () => {
  let component: MtmUsuarioAreaComponent;
  let fixture: ComponentFixture<MtmUsuarioAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmUsuarioAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmUsuarioAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
