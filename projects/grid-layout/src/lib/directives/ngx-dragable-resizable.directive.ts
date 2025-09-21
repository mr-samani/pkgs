import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Position } from './position';

declare type Corner =
  | 'top'
  | 'right'
  | 'left'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

@Directive({
  selector: '[NgxDragableResizable]',
  standalone: true,
})
export class NgxDragableResizableDirective
  implements AfterViewInit, AfterContentInit
{
  @Input() bounding: HTMLElement | null = null;
  @Input() minWidth = 20;
  @Input() minHeight = 20;
  @Input() resize = true;
  @Input() drag = true;
  @Input() dragRootElement = '';
  @Output() onDrag: EventEmitter<Position> = new EventEmitter<Position>();
  @Output() onDragStart: EventEmitter<Position> = new EventEmitter<Position>();
  @Output() onDragEnd: EventEmitter<Position> = new EventEmitter<Position>();
  @Output() onResize: EventEmitter<Position> = new EventEmitter<Position>();
  @Output() onResizeEnd: EventEmitter<Position> = new EventEmitter<Position>();
  protected width!: number;
  protected height!: number;
  protected px: number;
  protected py: number;
  x: number = 0;
  y: number = 0;
  protected draggingCorner: boolean;
  protected draggingWindow: boolean;
  protected resizer!: Function;
  protected corners: Corner[] = [
    'top',
    'right',
    'left',
    'bottom',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
  ];
  protected widgetCornerResizeStyle = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    // 'background': 'red',
    visibility: 'visible',
  };

  protected topLeftResizeStyle = {
    top: '0px',
    left: '0px',
    cursor: 'nw-resize',
  };
  protected topRightResizeStyle = {
    top: '0px',
    right: '0px',
    cursor: 'nesw-resize',
  };
  protected bottomLeftResizeStyle = {
    bottom: '0px',
    left: '0px',
    cursor: 'nesw-resize',
  };
  protected bottomRightResizeStyle = {
    bottom: '0px',
    right: '0px',
    cursor: 'nwse-resize',
  };
  protected topResizeStyle = {
    top: '0',
    height: '10px',
    width: '100%',
    cursor: 'row-resize',
  };
  protected rightResizeStyle = {
    top: '0',
    right: '0',
    width: '10px',
    height: '100%',
    cursor: 'col-resize',
  };

  protected leftResizeStyle = {
    top: '0',
    left: '0',
    width: '10px',
    height: '100%',
    cursor: 'col-resize',
  };
  protected bottomResizeStyle = {
    bottom: '0',
    height: '10px',
    width: '100%',
    cursor: 'row-resize',
  };

  protected borderTop = '';
  protected borderRight = '';
  protected borderBottom = '';
  protected borderLeft = '';
  previousTransition = '';
  protected el: HTMLElement;
  constructor(
    private _el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _doc: Document,
  ) {
    this.px = 0;
    this.py = 0;
    this.draggingCorner = false;
    this.draggingWindow = false;
    this.el = this._el.nativeElement;
  }

  ngAfterViewInit(): void {
    this.findFirstParentDragRootElement();

    if (this.resize) {
      this.addCornersToElement();
    }
    if (this.el.getAnimations().length === 0) {
      this.initSize();
    } else {
      this.el.addEventListener('animationend', (ev) => {
        this.initSize();
        // console.log('animationend', ev);
      });
    }
  }

  ngAfterContentInit(): void {
    var style = getComputedStyle(this.el);
    this.borderTop = style.borderTopWidth;
    this.borderRight = style.borderRightWidth;
    this.borderBottom = style.borderBottomWidth;
    this.borderLeft = style.borderLeftWidth;
  }

  findFirstParentDragRootElement() {
    if (this.dragRootElement) {
      let parentRoot: any = findParentBySelector(
        this._doc,
        this._el.nativeElement,
        this.dragRootElement,
      );
      if (parentRoot) {
        this.el = parentRoot;
      }
    }
  }

  // TODO : resize material dialog
  // TODO not working in rtl
  private checkFlexibale() {
    if (!this._doc.defaultView || !this.el.parentElement) {
      return;
    }
    let parentStyle = this._doc.defaultView.getComputedStyle(
      this.el.parentElement,
    );
    if (
      (parentStyle.alignItems && parentStyle.alignItems !== 'normal') ||
      (parentStyle.justifyContent && parentStyle.justifyContent !== 'normal')
    ) {
      this.el.parentElement.style.display = 'block';
      this.el.parentElement.style.alignItems = 'unset';
      this.el.parentElement.style.justifyContent = 'unset';
      this.el.style.position = 'unset !important';
    }
  }

  private initSize() {
    const elRec = this.el.getBoundingClientRect();
    this.width = elRec.width;
    this.height = elRec.height;
    // دریافت مقادیر استایل transform
    var computedStyle = window.getComputedStyle(this.el);
    var transformValue = computedStyle.getPropertyValue('transform');

    // تجزیه و تحلیل مقدار transform
    var matrix = transformValue.match(/^matrix\((.+)\)$/);
    if (matrix) {
      var matrixValues = matrix[1].split(', ');
      var translateX = parseInt(matrixValues[4], 10); // مقدار جابجایی در جهت left
      var translateY = parseInt(matrixValues[5], 10); // مقدار جابجایی در جهت top
      this.x = translateX;
      this.y = translateY;
    }
    this.setElPosition();
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  private onCornerRelease(event: MouseEvent) {
    if (this.draggingWindow) {
      this.onDragEnd.emit(this.getPosition());
    }
    if (this.draggingCorner) {
      this.onResizeEnd.emit(this.getPosition());
    }
    this.draggingWindow = false;
    this.draggingCorner = false;
    this.el.style.transition = this.previousTransition;
  }

  @HostListener('document:mousemove', ['$event'])
  private onCornerMouseMove(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }
    let offsetX = event.clientX - this.px;
    let offsetY = event.clientY - this.py;
    this.onCornerMove(offsetX, offsetY, event.clientX, event.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  private onCornerTouchMove(event: TouchEvent) {
    if (!this.draggingCorner) {
      return;
    }
    let offsetX = event.touches[0].clientX - this.px;
    let offsetY = event.touches[0].clientY - this.py;
    let clientX = event.touches[0].clientX;
    let clientY = event.touches[0].clientY;
    this.onCornerMove(offsetX, offsetY, clientX, clientY);
  }

  @HostListener('touchstart', ['$event'])
  private onTouched(event: TouchEvent) {
    if (this.drag === false) {
      return;
    }
    event.preventDefault();
    this.previousTransition = this.el.style.transition;
    this.el.style.transition = 'none';
    this.draggingWindow = true;
    this.px = event.touches[0].clientX;
    this.py = event.touches[0].clientY;
    this.initSize();
    this.onDragStart.emit(this.getPosition());
  }

  @HostListener('mousedown', ['$event'])
  private onMouseDown(event: MouseEvent) {
    if (this.drag === false) {
      return;
    }
    event.preventDefault();
    this.previousTransition = this.el.style.transition;
    this.el.style.transition = 'none';
    this.draggingWindow = true;
    this.px = event.clientX;
    this.py = event.clientY;
    this.initSize();
    this.onDragStart.emit(this.getPosition());
  }

  @HostListener('window:touchmove', ['$event'])
  private onTouchMove(event: TouchEvent) {
    if (!this.draggingWindow || this.drag === false) {
      return;
    }
    event.preventDefault();
    let offsetX = event.touches[0].clientX - this.px;
    let offsetY = event.touches[0].clientY - this.py;
    this.draging(
      offsetX,
      offsetY,
      event.touches[0].clientX,
      event.touches[0].clientY,
    );
  }

  @HostListener('window:mousemove', ['$event'])
  private onMouseMove(event: MouseEvent) {
    if (!this.draggingWindow || this.drag === false) {
      return;
    }
    event.preventDefault();
    let offsetX = event.clientX - this.px;
    let offsetY = event.clientY - this.py;
    this.draging(offsetX, offsetY, event.clientX, event.clientY);
  }

  private draging(
    offsetX: number,
    offsetY: number,
    clientX: number,
    clientY: number,
  ) {
    if (this.checkBoundY(offsetY)) {
      this.y += offsetY;
    }
    this.py = clientY;
    if (this.checkBoundX(offsetX)) {
      this.x += offsetX;
    }
    this.px = clientX;
    this.setElPosition();
    this.onDrag.emit(this.getPosition());
  }

  private checkBoundY(offsetY: number, checkTop = true, checkHeight = true) {
    if (!this.bounding) {
      return true;
    }
    const boundleRec = this.bounding.getBoundingClientRect();
    const selfRec = this.el.getBoundingClientRect();
    const newY = selfRec.y + offsetY;
    if (newY < boundleRec.y && checkTop) {
      return false;
    }
    // TODO : برای افزودن ارتفاع به گرید اصلی
    // else if ((newY + this.height) > (boundleRec.y + boundleRec.height) && checkHeight) {
    //   return false;
    // }
    else {
      return true;
    }
  }

  /**
   * checkLeft and checkWidth useful in resize
   */
  private checkBoundX(offsetX: number, checkLeft = true, checkWidth = true) {
    if (!this.bounding) {
      return true;
    }
    const boundleRec = this.bounding.getBoundingClientRect();
    const selfRec = this.el.getBoundingClientRect();
    const newX = selfRec.x + offsetX;
    if (newX < boundleRec.x && checkLeft) {
      return false;
    } else if (
      newX + this.width > boundleRec.x + boundleRec.width &&
      checkWidth
    ) {
      return false;
    } else {
      return true;
    }
  }

  private topLeftResize(offsetX: number, offsetY: number) {
    if (this.checkBoundX(offsetX, true, false)) {
      this.x += offsetX;
      this.width -= offsetX;
    }
    if (this.checkBoundY(offsetY)) {
      this.y += offsetY;
      this.height -= offsetY;
    }
  }

  private topRightResize(offsetX: number, offsetY: number) {
    if (this.checkBoundX(offsetX, false, true)) {
      this.width += offsetX;
    }
    if (this.checkBoundY(offsetY, true, false)) {
      this.y += offsetY;
      this.height -= offsetY;
    }
  }

  private bottomLeftResize(offsetX: number, offsetY: number) {
    if (this.checkBoundX(offsetX, true, false)) {
      this.x += offsetX;
      this.width -= offsetX;
    }
    if (this.checkBoundY(offsetY, false)) {
      this.height += offsetY;
    }
  }

  private bottomRightResize(offsetX: number, offsetY: number) {
    if (this.checkBoundX(offsetX, false)) {
      this.width += offsetX;
    }
    if (this.checkBoundY(offsetY, false)) {
      this.height += offsetY;
    }
  }
  private topResize(offsetX: number, offsetY: number) {
    if (this.checkBoundY(offsetY, true, false)) {
      this.y += offsetY;
      this.height -= offsetY;
    }
  }
  private rightResize(offsetX: number, offsetY: number) {
    if (this.checkBoundX(offsetX, false)) {
      this.width += offsetX;
    }
  }
  private bottomResize(offsetX: number, offsetY: number) {
    if (this.checkBoundY(offsetY, false)) {
      this.height += offsetY;
    }
  }
  private leftResize(offsetX: number, offsetY: number) {
    if (this.checkBoundX(offsetX, true, false)) {
      this.x += offsetX;
      this.width -= offsetX;
    }
  }

  private onCornerTouch(event: TouchEvent, resizer: Function) {
    this.draggingCorner = true;
    this.px = event.touches[0].clientX;
    this.py = event.touches[0].clientY;
    this.resizer = resizer;
    event.preventDefault();
    event.stopPropagation();
    this.previousTransition = this.el.style.transition;
    this.el.style.transition = 'none';
    this.initSize();
    this.checkFlexibale();
  }
  private onCornerClick(event: MouseEvent, resizer: Function) {
    this.draggingCorner = true;
    this.px = event.clientX;
    this.py = event.clientY;
    this.resizer = resizer;
    event.preventDefault();
    event.stopPropagation();
    this.previousTransition = this.el.style.transition;
    this.el.style.transition = 'none';
    this.initSize();
    this.checkFlexibale();
  }

  private onCornerMove(
    offsetX: number,
    offsetY: number,
    clientX: number,
    clientY: number,
  ) {
    let lastX = this.x;
    let lastY = this.y;
    let pWidth = this.width;
    let pHeight = this.height;
    this.resizer(offsetX, offsetY);
    if (this.width < this.minWidth) {
      this.x = lastX;
      this.width = pWidth;
    }
    if (this.height < this.minHeight) {
      this.y = lastY;
      this.height = pHeight;
    }

    this.px = clientX;
    this.py = clientY;
    this.setElPosition();
    this.onResize.emit(this.getPosition());
  }

  /*******OUTPUT******/

  public setElPosition() {
    this.el.style.transform = `translate(${this.x}px,${this.y}px)`;
    //this.el.style.removeProperty('position');
    //this.el.style.position = 'absolute';
    this.el.style.width = this.width + 'px';
    this.el.style.height = this.height + 'px';
  }
  public getPosition(): Position {
    return {
      translateY: this.y,
      translateX: this.x,
      width: this.width,
      height: this.height,
      point: {
        x: this.x,
        y: this.y,
      },
    };
  }

  /*---------------------------------------------------------------------------------*/
  private setStyle(child: any, styleName: any) {
    Object.keys(styleName).forEach((newStyle) => {
      // this.renderer.setStyle(
      //   this.el, `${newStyle}`, styleName[newStyle]
      // );
      this.renderer.setStyle(child, `${newStyle}`, styleName[newStyle]);
    });
  }

  private addCornersToElement() {
    for (const corner of this.corners) {
      const child = this._doc.createElement('div');
      child.classList.add('widget-corner-resize', corner);
      this.setStyle(child, this.widgetCornerResizeStyle);
      const self: any = this;

      switch (corner) {
        case 'top':
          this.topResizeStyle.top = `calc(-${this.borderTop ?? 0})`;
          break;
        case 'right':
          this.rightResizeStyle.right = `calc(-${this.borderRight ?? 0})`;
          break;
        case 'bottom':
          this.bottomResizeStyle.bottom = `calc(-${this.borderBottom ?? 0})`;
          break;
        case 'left':
          this.leftResizeStyle.left = `calc(-${this.borderLeft ?? 0})`;
          break;
        case 'topRight':
          this.topRightResizeStyle.top = `calc(-${this.borderTop ?? 0})`;
          this.topRightResizeStyle.right = `calc(-${this.borderRight ?? 0})`;
          break;
        case 'bottomRight':
          this.bottomRightResizeStyle.right = `calc(-${this.borderRight ?? 0})`;
          this.bottomRightResizeStyle.bottom = `calc(-${this.borderBottom ?? 0})`;
          break;
        case 'bottomLeft':
          this.bottomLeftResizeStyle.left = `calc(-${this.borderLeft ?? 0})`;
          this.bottomLeftResizeStyle.bottom = `calc(-${this.borderBottom ?? 0})`;
          break;
        case 'topLeft':
          this.topLeftResizeStyle.left = `calc(-${this.borderLeft ?? 0})`;
          this.topLeftResizeStyle.top = `calc(-${this.borderTop ?? 0})`;
          break;
      }
      this.setStyle(child, self[corner + 'ResizeStyle']);
      child.addEventListener('mousedown', ($event) => {
        this.onCornerClick($event, self[corner + 'Resize']);
      });
      child.addEventListener('touchstart', ($event) => {
        this.onCornerTouch($event, self[corner + 'Resize']);
      });
      this.renderer.appendChild(this.el, child);
    }
  }
}

export function collectionHas(a: NodeListOf<Element>, b: ParentNode) {
  //helper function (see below)
  for (var i = 0, len = a.length; i < len; i++) {
    if (a[i] == b) return true;
  }
  return false;
}
export function findParentBySelector(
  doc: Document,
  elm: HTMLElement,
  selector: string,
) {
  var all = doc.querySelectorAll(selector);
  var cur = elm.parentNode;
  while (cur && !collectionHas(all, cur)) {
    //keep going up until you find a match
    cur = cur.parentNode; //go up
  }
  return cur; //will return null if not found
}
