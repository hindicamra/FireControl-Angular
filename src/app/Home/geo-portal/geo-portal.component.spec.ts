import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoPortalComponent } from './geo-portal.component';

describe('GeoPortalComponent', () => {
  let component: GeoPortalComponent;
  let fixture: ComponentFixture<GeoPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoPortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
