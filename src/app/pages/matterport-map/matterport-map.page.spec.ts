import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MatterportMapPage } from './matterport-map.page';

describe('MatterportMapPage', () => {
  let component: MatterportMapPage;
  let fixture: ComponentFixture<MatterportMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatterportMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MatterportMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
