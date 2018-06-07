import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardControllerComponent } from './scoreboard-controller.component';

describe('ScoreboardControllerComponent', () => {
  let component: ScoreboardControllerComponent;
  let fixture: ComponentFixture<ScoreboardControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreboardControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreboardControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
