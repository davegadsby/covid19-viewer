import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsSmComponent } from './tools-sm.component';

describe('ToolsSmComponent', () => {
  let component: ToolsSmComponent;
  let fixture: ComponentFixture<ToolsSmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsSmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
