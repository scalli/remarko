import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentoverviewComponent } from './studentoverview.component';

describe('StudentoverviewComponent', () => {
  let component: StudentoverviewComponent;
  let fixture: ComponentFixture<StudentoverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentoverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
