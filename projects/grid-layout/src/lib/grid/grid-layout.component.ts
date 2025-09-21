import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { GridItemComponent } from '../grid-item/grid-item.component';
import { IConfiguration } from '../models/confirguration';
import { Layout } from '../models/layout';
import { mergeConfig } from '../utils/merge-config';
import { GridLayoutService } from '../grid-layout.service';

@Component({
  standalone: false,
  selector: 'grid',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.height.px]': 'gridService.gridHeight',
  },
})
export class GridLayoutComponent implements OnInit, AfterContentInit {
  @Input('rowHieght') set _rowHeight(val: number) {
    if (typeof val == 'number') this.gridService.rowHeight = val;
  }
  @Input('config') set _config(val: IConfiguration) {
    this.gridService.config = mergeConfig(this.gridService.config, val);
  }
  @Input('layout') set _layout(val: Layout[]) {
    this.gridService.layout = val ?? [];
  }
  @ContentChildren(GridItemComponent, { descendants: true })
  _gridItem?: QueryList<GridItemComponent>;

  el: HTMLElement;
  placeholder?: HTMLElement;
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private gridService: GridLayoutService,
    private renderer: Renderer2,
  ) {
    this.el = elementRef.nativeElement;
    gridService.gridLayout = this;
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.gridService.colWidth =
      (this.el.offsetWidth -
        (this.gridService.config.cols - 1) * this.gridService.config.gap) /
      this.gridService.config.cols;
    console.log(
      'rowHeight',
      this.gridService.rowHeight,
      'colWidth',
      this.gridService.colWidth,
    );
    this.render();
    this.setBackgroundCssVariables();
    this.gridService.calculateRenderData();
  }

  render() {
    for (let i = 0; i < this.gridService.layout.length; i++) {
      if (this._gridItem && this._gridItem.toArray()[i]) {
        const findedItem = this._gridItem.find(
          (x) => x.id == this.gridService.layout[i].id,
        );
        if (findedItem) {
          findedItem.position = this.gridService.layout[i];
          findedItem.index = i;
          findedItem.drawGridByLayout();
        }
      }
    }
  }

  private setBackgroundCssVariables() {
    const style = (this.elementRef.nativeElement as HTMLDivElement).style;
    if (this.gridService.config.background) {
      // structure
      style.setProperty('--gap', this.gridService.config.gap + 'px');
      style.setProperty('--row-height', this.gridService.rowHeight + 'px');
      style.setProperty('--columns', `${this.gridService.config.cols}`);
      style.setProperty(
        '--border-width',
        this.gridService.config.background.borderWidth + 'px',
      );

      // colors
      style.setProperty(
        '--border-color',
        this.gridService.config.background.borderColor,
      );
      style.setProperty(
        '--gap-color',
        this.gridService.config.background.gapColor,
      );
      style.setProperty(
        '--row-color',
        this.gridService.config.background.rowColor,
      );
      style.setProperty(
        '--column-color',
        this.gridService.config.background.columnColor,
      );
    } else {
      style.removeProperty('--gap');
      style.removeProperty('--row-height');
      style.removeProperty('--columns');
      style.removeProperty('--border-width');
      style.removeProperty('--border-color');
      style.removeProperty('--gap-color');
      style.removeProperty('--row-color');
      style.removeProperty('--column-color');
    }
  }

  /** Creates placeholder element */
  createPlaceholderElement(
    newX: number,
    newY: number,
    width: number,
    height: number,
    left: number,
    top: number,
  ) {
    if (!this.placeholder)
      this.placeholder = this.renderer.createElement('div');
    this.placeholder!.style.width = `${width}px`;
    this.placeholder!.style.height = `${height}px`;
    this.placeholder!.style.left = `${left}px`;
    this.placeholder!.style.top = `${top}px`;
    this.placeholder!.style.transform = `translateX(${newX}px) translateY(${newY}px)`;
    this.placeholder!.classList.add('grid-item-placeholder');
    this.renderer.appendChild(this.elementRef.nativeElement, this.placeholder);

    // // Create and append custom placeholder if provided.
    // // Important: Append it after creating & appending the container placeholder. This way we ensure parent bounds are set when creating the embeddedView.
    // if (gridItemPlaceholder) {
    //   this.placeholderRef = this.viewContainerRef.createEmbeddedView(
    //     gridItemPlaceholder.templateRef,
    //     gridItemPlaceholder.data
    //   );
    //   this.placeholderRef.rootNodes.forEach(node => this.placeholder!.appendChild(node));
    //   this.placeholderRef.detectChanges();
    // } else {
    //   this.placeholder!.classList.add('ktd-grid-item-placeholder-default');
    // }
  }

  /** Destroys the placeholder element and its ViewRef. */
  destroyPlaceholder() {
    this.placeholder?.remove();
    //this.placeholderRef?.destroy();
    //this.placeholder = this.placeholderRef = null!;
  }
}
