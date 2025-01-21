import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventGroupComponent } from './event-group.component';

describe('EventGroupComponent', () => {
  let component: EventGroupComponent;
  let fixture: ComponentFixture<EventGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
