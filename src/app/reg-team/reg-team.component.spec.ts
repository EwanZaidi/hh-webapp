import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTeamComponent } from './reg-team.component';

describe('RegTeamComponent', () => {
  let component: RegTeamComponent;
  let fixture: ComponentFixture<RegTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
