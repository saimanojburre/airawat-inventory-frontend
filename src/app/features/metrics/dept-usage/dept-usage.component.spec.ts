import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptUsageComponent } from './dept-usage.component';

describe('DeptUsageComponent', () => {
  let component: DeptUsageComponent;
  let fixture: ComponentFixture<DeptUsageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeptUsageComponent]
    });
    fixture = TestBed.createComponent(DeptUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
