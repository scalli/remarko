import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolsettingsComponent } from './schoolsettings.component';

describe('SchoolsettingsComponent', () => {
  let component: SchoolsettingsComponent;
  let fixture: ComponentFixture<SchoolsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
