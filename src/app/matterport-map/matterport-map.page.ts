import { Component, OnInit } from '@angular/core';
import { NavigationTree } from '../core/navigation-tree';

declare var MP_SDK: any;

@Component({
  selector: 'app-matterport-map',
  templateUrl: './matterport-map.page.html',
  styleUrls: ['./matterport-map.page.scss'],
})
export class MatterportMapPage implements OnInit {

  public iframe: HTMLElement;
  public SDK: any;
  public navigationTree: NavigationTree;
  public sweeps: any;

  constructor() { }

  ngOnInit() {
    this.iframe = document.getElementById('map');
    this.iframe.addEventListener('load', this.showcaseLoader.bind(this), true);
    window['DRAW_PATH'] = this.drawPath.bind(this);
  }

  async showcaseLoader() {
    let self = this;
    // setTimeout(async () => {
    console.clear()
    try {
      self.SDK = await MP_SDK.connect(document.getElementById('map'), 'e97a64c716ab413e8bc3009f714f1d0e', '3.8');
      window['MATTERPORT_SDK'] = self.SDK;
      self.SDK.Sweep.data.subscribe({
        onAdded(index, item, collection) {
          console.log('sweep added to the collection', index, item, collection);
          self.sweeps = collection;
          window['SWEEPS'] = collection;
        },
        onRemoved(index, item, collection) {
          // console.log('sweep removed from the collection', index, item, collection);
          self.sweeps = collection;
          window['SWEEPS'] = collection;
        },
        onUpdated(index, item, collection) {
          // console.log('sweep updated in place in the collection', index, item, collection);
          self.sweeps = collection;
          window['SWEEPS'] = collection;
        },
        onCollectionUpdated(collection) {
          // console.log('the entire up-to-date collection', collection);
          self.sweeps = collection;
          // let sweeps = [];
          // for(let k in self.sweeps) {
          //   sweeps.push(self.sweeps[k])
          // }
          self.navigationTree = new NavigationTree(collection);
          window['SWEEPS'] = self.navigationTree;
        }
      });

    }
    catch (e) {
      console.clear()
      console.log("CONNECT ERROR RESULT: ")
      console.error(e);
    }
    // }, 1000)
  };

  drawPath() {
    this.SDK.Mode.moveTo(this.SDK.Mode.Mode.FLOORPLAN);
    let nodes = this.navigationTree.getShortestWay('da46ac94cf0547488dfeafb6f2feb1d2', '418c8e3476c54359a4434879d2552b64');

    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      // if (nodes[i + 1]) {
      //   let distance = this.navigationTree.edges[node][nodes[i + 1]] || 0;
      //   for (let j = 0; j < distance / 0.1; j++) {
      //     this.SDK.Mattertag.add({
      //       // label: "",
      //       // description: "",
      //       anchorPosition: this.sweeps[node].position,
      //       stemVector: { x: 0, y: -0.3, z: this.getZ(this.sweeps[node].position.x * (i * 0.1), this.sweeps[node].position, this.sweeps[nodes[i + 1]].position), },
      //       color: { r: 0.0, g: 0.0, b: 1.0, },
      //       floorIndex: 0, // optional, if not specified the sdk will provide an estimate of the floor index for the anchor position provided.
      //     });
      //   }
      // }
      this.SDK.Mattertag.add({
        // label: "",
        // description: "",
        anchorPosition: this.sweeps[node].position,
        stemVector: { x: 0, y: -0.3, z: 0, },
        color: { r: 0.0, g: 0.0, b: 1.0, },
        floorIndex: 0, // optional, if not specified the sdk will provide an estimate of the floor index for the anchor position provided.
      });
    }

  }

  getZ(x: number, p1: { x: number, y: number }, p2: { x: number, y: number }) {
    let slope = (p2.y - p1.y) / (p2.x - p1.x);
    let b = p1.y - (slope * p1.x);
    return (slope * x) - b;
  }

}
