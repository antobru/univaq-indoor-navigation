import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArtworksCommandsComponent } from './artworks-commands.component';

describe('ArtworksCommandsComponent', () => {
  let component: ArtworksCommandsComponent;
  let fixture: ComponentFixture<ArtworksCommandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtworksCommandsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtworksCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
