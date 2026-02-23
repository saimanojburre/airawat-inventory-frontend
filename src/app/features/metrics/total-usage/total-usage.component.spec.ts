import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalUsageComponent } from './total-usage.component';

describe('TotalUsageComponent', () => {
  let component: TotalUsageComponent;
  let fixture: ComponentFixture<TotalUsageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalUsageComponent]
    });
    fixture = TestBed.createComponent(TotalUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
