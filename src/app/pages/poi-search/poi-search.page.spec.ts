import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoiSearchPage } from './poi-search.page';

describe('PoiSearchPage', () => {
  let component: PoiSearchPage;
  let fixture: ComponentFixture<PoiSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoiSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoiSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
