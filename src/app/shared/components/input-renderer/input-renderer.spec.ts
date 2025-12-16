import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRenderer } from './input-renderer';

describe('InputRenderer', () => {
  let component: InputRenderer;
  let fixture: ComponentFixture<InputRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputRenderer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
