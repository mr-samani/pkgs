import { Component } from '@angular/core';
import {
  Configuration,
  IConfiguration,
} from 'projects/grid-layout/src/lib/models/confirguration';
import { Layout } from 'projects/grid-layout/src/lib/models/layout';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  standalone: false,
})
export class GridComponent {
  rtl = false;
  layout: Layout[] = [
    { id: 'i1', w: 2, h: 3, x: 0, y: 0 },
    { id: 'i2', w: 3, h: 5, x: 3, y: 0 },
    { id: 'i3', w: 1, h: 1, x: 8, y: 0 },
  ];
  config: IConfiguration = {
    cols: 12,
    gap: 20,
    background: {
      borderWidth: 5,
    },
  };
}
