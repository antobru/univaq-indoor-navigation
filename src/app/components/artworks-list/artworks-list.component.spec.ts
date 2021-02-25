import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArtworksListComponent } from './artworks-list.component';

describe('ArtworksListComponent', () => {
  let component: ArtworksListComponent;
  let fixture: ComponentFixture<ArtworksListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtworksListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtworksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
