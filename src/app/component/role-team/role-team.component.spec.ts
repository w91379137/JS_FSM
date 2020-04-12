import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleTeamComponent } from './role-team.component';

describe('RoleTeamComponent', () => {
  let component: RoleTeamComponent;
  let fixture: ComponentFixture<RoleTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
