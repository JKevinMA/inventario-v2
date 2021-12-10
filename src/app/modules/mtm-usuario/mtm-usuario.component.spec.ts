import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmUsuarioComponent } from './mtm-usuario.component';

describe('MtmUsuarioComponent', () => {
  let component: MtmUsuarioComponent;
  let fixture: ComponentFixture<MtmUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtmUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
