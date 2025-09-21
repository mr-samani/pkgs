import { Injectable } from '@angular/core';
import { Configuration } from './models/confirguration';
import { GridItemComponent, GridLayoutComponent } from '../public-api';
import { Layout } from './models/layout';

@Injectable({
  providedIn: 'root'
})
export class GridLayoutService {
  colWidth = 50;
  rowHeight = 50;
  config = new Configuration();
  gridLayout!: GridLayoutComponent;
  layout: Layout[] = [];
  gridHeight = 300;
  constructor() { }

  calculateRenderData() {
    // setTimeout(() => {
    this.gridHeight = this.gridLayout._gridItem
      ? getBottomGrid(this.layout, this.rowHeight, this.config.gap)
      : 0;
    console.log(this.gridHeight);
    // }, 100);
  }

  getFreePosition(position: Layout, i = 0) {
    let l = this.layout[i];
    if (l.id == position.id) {
      return position;
    }
    if (position.x >= l.x && position.x < (l.x + l.w)) {
      position.x = l.x + l.w;
      this.getFreePosition(position, ++i);
    }
    return position;
  }



  checkLayoutOverlap(currL: Layout) {
    for (let l of this.layout) {
      if (l.id == currL.id)
        continue;
      if (collides(currL, l)) {
        // console.log('overlap with:', l.id);
        l.y = currL.y + currL.h;
        let gridItem = this.gridLayout._gridItem?.find(x => x.id == l.id);
        if (gridItem) {
          gridItem.position.y = l.y;
          gridItem.drawGridByLayout();
          this.calculateRenderData();
          this.checkLayoutOverlap(gridItem.position);
        }
      }

    }
  }


  compactLayout(g: GridItemComponent) {
    for (let i = 0; i < this.layout.length; i++) {
      if (g && g.id == this.layout[i].id)
        continue;
      let gridItem = this.gridLayout._gridItem?.find(x => x.id == this.layout[i].id);
      if (gridItem) {
        // Bottom 'y' possible is the bottom of the layout.
        // This allows you to do nice stuff like specify {y: Infinity}
        // This is here because the layout must be sorted in order to get the correct bottom `y`.
        // this.layout[i].y = Math.min(bottom(this.layout),this.layout[i].y)+1;
        let cloned = JSON.parse(JSON.stringify(gridItem.position));
        cloned.y--;
        while (this.layout[i].y > 0 && !getFirstCollision(this.layout, cloned)) {
          this.layout[i].y--;
        }
        gridItem.drawGridByLayout();
      }
    }
  }




}
/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */
export function bottom(layout: Layout[]): number {
  let max = 0,
    bottomY;
  for (let i = 0, len = layout.length; i < len; i++) {
    bottomY = layout[i].y + layout[i].h;
    if (bottomY > max) {
      max = bottomY;
    }
  }
  return max;
}

/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 */
export function getFirstCollision(layouts: Layout[], layoutItem: Layout,): Layout | null | undefined {
  for (let i = 0, len = layouts.length; i < len; i++) {
    if (collides(layouts[i], layoutItem)) {
      return layouts[i];
    }
  }
  return null;
}


/*------------------------------------------------------*/
export function collides(l1: Layout, l2: Layout): boolean {
  if (l1.id === l2.id) {
    return false;
  } // same element
  if (l1.x + l1.w <= l2.x) {
    return false;
  } // l1 is left of l2
  if (l1.x >= l2.x + l2.w) {
    return false;
  } // l1 is right of l2
  if (l1.y + l1.h <= l2.y) {
    return false;
  } // l1 is above l2
  if (l1.y >= l2.y + l2.h) {
    return false;
  } // l1 is below l2
  return true; // boxes overlap
}



function getMaxGridItemHeight(layout: Layout[], rowHeight: number, gap: number): number {
  return layout.reduce((acc, cur) => Math.max(acc, (cur.y + cur.h) * rowHeight + Math.max(cur.y + cur.h - 1, 0) * gap), 0);
}
function getSumGridItemHeight(gridItem: GridItemComponent[]): number {
  return gridItem.reduce((sum, cur) => sum += (cur.left + cur.height), 0);
}
function getBottomGrid(layout: Layout[], rowHeight: number, gap: number): number {
  let bottomEl = layout[0];
  let prvY = 0;

  for (let item of layout) {
    //item.render();
    if (item.y + item.h > prvY) {
      prvY = item.y + item.h;
      bottomEl = item;
    }
  }
  console.info('last element in bottom is:', bottomEl?.id);
  const maxHeight = (bottomEl.y + bottomEl.h) * rowHeight + ((bottomEl.y + bottomEl.h - 1) * gap);
  return maxHeight;
}