import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUsageComponent } from './view-usage.component';

describe('ViewUsageComponent', () => {
  let component: ViewUsageComponent;
  let fixture: ComponentFixture<ViewUsageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUsageComponent]
    });
    fixture = TestBed.createComponent(ViewUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
