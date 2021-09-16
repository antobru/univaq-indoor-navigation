import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Area } from 'src/app/models/area.model';
import { Beacon } from 'src/app/models/beacon.model';
import { Coordinate } from 'src/app/models/coordinate';
import { AreasService } from 'src/app/services/areas.service';

@Component({
  selector: 'app-beacon-form',
  templateUrl: './beacon-form.component.html',
  styleUrls: ['./beacon-form.component.scss'],
})
export class BeaconFormComponent implements OnInit {

  @Input() beacon: Beacon = new Beacon();
  @Input() coordinate: Coordinate;
  areas: Area[] = [];
  number: number;
  defaultUUID: string = '00000000-0000-0000-0000-'

  constructor(private areasService: AreasService, private modalCtrl: ModalController) { }

  async ngOnInit() {
    this.areas = await this.areasService.find({}, 0, 1000);
  }

  save() {
    this.beacon.uuid = this.defaultUUID + ("" + this.number).padStart(12, '0');
    this.beacon.coordinate = this.coordinate;
    this.modalCtrl.dismiss(this.beacon);
  }

}
