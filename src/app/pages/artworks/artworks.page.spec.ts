import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArtworksPage } from './artworks.page';

describe('ArtworksPage', () => {
  let component: ArtworksPage;
  let fixture: ComponentFixture<ArtworksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtworksPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtworksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
