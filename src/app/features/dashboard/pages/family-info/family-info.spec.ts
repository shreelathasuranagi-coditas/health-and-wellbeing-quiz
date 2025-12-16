import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyInfo } from './family-info';

describe('FamilyInfo', () => {
  let component: FamilyInfo;
  let fixture: ComponentFixture<FamilyInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
