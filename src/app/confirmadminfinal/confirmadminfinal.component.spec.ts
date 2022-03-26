import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmadminfinalComponent } from './confirmadminfinal.component';

describe('ConfirmadminfinalComponent', () => {
  let component: ConfirmadminfinalComponent;
  let fixture: ComponentFixture<ConfirmadminfinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmadminfinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmadminfinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
