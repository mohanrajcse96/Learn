import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestpraticeComponent } from './testpratice.component';

describe('TestpraticeComponent', () => {
  let component: TestpraticeComponent;
  let fixture: ComponentFixture<TestpraticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestpraticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestpraticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
