import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrySmallComponent } from './country-small.component';

describe('CountrySmallComponent', () => {
  let component: CountrySmallComponent;
  let fixture: ComponentFixture<CountrySmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountrySmallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrySmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
