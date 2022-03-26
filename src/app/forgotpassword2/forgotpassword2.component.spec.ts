import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Forgotpassword2Component } from './forgotpassword2.component';

describe('Forgotpassword2Component', () => {
  let component: Forgotpassword2Component;
  let fixture: ComponentFixture<Forgotpassword2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Forgotpassword2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Forgotpassword2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
