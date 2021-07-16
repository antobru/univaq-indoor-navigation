import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GeojsonMapPage } from './geojson-map.page';

describe('GeojsonMapPage', () => {
  let component: GeojsonMapPage;
  let fixture: ComponentFixture<GeojsonMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeojsonMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GeojsonMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
