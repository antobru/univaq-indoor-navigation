import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoutessListComponent } from './routess-list.component';

describe('RoutessListComponent', () => {
  let component: RoutessListComponent;
  let fixture: ComponentFixture<RoutessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutessListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoutessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
