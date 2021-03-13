import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddArtworkInRouteComponent } from './add-artwork-in-route.component';

describe('AddArtworkInRouteComponent', () => {
  let component: AddArtworkInRouteComponent;
  let fixture: ComponentFixture<AddArtworkInRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddArtworkInRouteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddArtworkInRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
