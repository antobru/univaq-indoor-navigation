import { Component, OnInit } from '@angular/core';
import { Route } from '../../models/route.model';

@Component({
  selector: 'routes-list',
  templateUrl: './routess-list.component.html',
  styleUrls: ['./routess-list.component.scss'],
})
export class RoutessListComponent implements OnInit {

  public routes: Route[] = [];

  constructor() { }

  ngOnInit() {}

}
