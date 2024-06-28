export interface Point {
  x: number;
  y: number;
}

export interface PointOfList {
  row: number;
  col: number;
}

export interface DrawTool {
  getPoints(): void;
  start(): void;
  done(): void;
  push(x: number, y: number): void;
  pop(): void;
  clear(): void;
}

export class LineDrawTool implements DrawTool {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private list: number[];
  private replace: boolean;

  private points: Point[] = [];

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    list: number[],
    replace: boolean
  ) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.list = list;
    this.replace = replace;
  }

  public getPoints() {
    return this.points;
  }

  public start() {
    this.draw();
  }

  public done() {
    if (this.points.length >= 2) {
      for (const pt of this.points) {
        this.list.push(pt.x);
        this.list.push(pt.y);
      }
    }
    this.list = [];
    this.points = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public push(x: number, y: number) {
    const scaleX = this.canvas.width * 1.0;
    const scaleY = this.canvas.height * 1.0;

    if (this.replace) {
      this.list.length = 0;
    }
    if (this.points.length >= 2) {
      this.points = [];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.points.push({ x: x / scaleX, y: y / scaleY });
    this.draw();
  }

  public pop() {
    if (this.points.length > 0) {
      this.points.pop();
    }
    this.draw();
  }

  public clear(): void {
    this.list.length = 0;
    this.points = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const scaleX = this.canvas.width * 1.0;
    const scaleY = this.canvas.height * 1.0;

    this.ctx.beginPath();
    this.ctx.fillStyle = "lightgreen";
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 1;
    let start = true;
    for (const pt of this.points) {
      if (start) {
        this.ctx.moveTo(pt.x * scaleX, pt.y * scaleY);
      } else {
        this.ctx.lineTo(pt.x * scaleX, pt.y * scaleY);
      }
      start = !start;
      this.ctx.fillRect(pt.x * scaleX - 2, pt.y * scaleY - 2, 4, 4);
    }
    this.ctx.stroke();

    this.ctx.strokeStyle = "lightgray";
    start = true;
    let pt: number[] = [];
    console.log(this.list);
    for (const e of this.list) {
      pt.push(e);
      if (pt.length == 2) {
        if (start) {
          this.ctx.moveTo(pt[0] * scaleX, pt[1] * scaleY);
        } else {
          this.ctx.lineTo(pt[0] * scaleX, pt[1] * scaleY);
        }
        start = !start;
        pt = [];
      }
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

export class RectDrawTool implements DrawTool {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private list: number[];
  private replace: boolean;

  private points: Point[] = [];

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    list: number[],
    replace: boolean
  ) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.list = list;
    this.replace = replace;
  }

  public getPoints() {
    const a = this.points[0];
    const b = this.points[1];
    return [a.x, a.y, b.x, b.y];
  }

  public start() {
    this.draw();
  }

  public done() {
    if (this.points.length >= 2) {
      for (const pt of this.points) {
        this.list.push(pt.x);
        this.list.push(pt.y);
      }
    }
    this.list = [];
    this.points = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public push(x: number, y: number) {
    const scaleX = this.canvas.width * 1.0;
    const scaleY = this.canvas.height * 1.0;

    if (this.replace) {
      this.list.length = 0;
    }
    if (this.points.length >= 2) {
      this.points = [];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.points.push({ x: x / scaleX, y: y / scaleY });
    this.draw();
  }

  public pop() {
    if (this.points.length > 0) {
      this.points.pop();
    }
    this.draw();
  }

  public clear(): void {
    this.list.length = 0;
    this.points = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private draw() {
    console.log("draw");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const scaleX = this.canvas.width * 1.0;
    const scaleY = this.canvas.height * 1.0;

    this.ctx.beginPath();
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "lightgreen";
    this.ctx.lineWidth = 1;
    if (this.points.length == 2) {
      const a = this.points[0];
      const b = this.points[1];
      this.ctx.moveTo(a.x * scaleX, a.y * scaleY);
      this.ctx.lineTo(b.x * scaleX, a.y * scaleY);
      this.ctx.lineTo(b.x * scaleX, b.y * scaleY);
      this.ctx.lineTo(a.x * scaleX, b.y * scaleY);
      this.ctx.lineTo(a.x * scaleX, a.y * scaleY);
      this.ctx.stroke();
    }
    for (const pt of this.points) {
      this.ctx.fillRect(pt.x * scaleX - 2, pt.y * scaleY - 2, 4, 4);
    }

    this.ctx.strokeStyle = "lightgray";
    let pts = [];
    console.log(this.list);
    for (const pt of this.list) {
      pts.push(pt);
      if (pts.length == 4) {
        const a = { x: pts[0], y: pts[1] };
        const b = { x: pts[2], y: pts[3] };
        this.ctx.moveTo(a.x * scaleX, a.y * scaleY);
        this.ctx.lineTo(b.x * scaleX, a.y * scaleY);
        this.ctx.lineTo(b.x * scaleX, b.y * scaleY);
        this.ctx.lineTo(a.x * scaleX, b.y * scaleY);
        this.ctx.lineTo(a.x * scaleX, a.y * scaleY);
        pts = [];
      }
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

export class PolygonDrawTool implements DrawTool {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private list: number[];
  private replace: boolean;

  private points: Point[] = [];

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    list: number[],
    replace: boolean
  ) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.list = list;
    this.replace = replace;
  }

  public getPoints() {
    const pts = [];
    for (const pt of this.points) {
      pts.push(pt.x);
      pts.push(pt.y);
    }
    return pts;
  }

  public start() {
    this.draw();
  }

  public done() {
    if (this.points.length >= 3) {
      for (const pt of this.points) {
        this.list.push(pt.x);
        this.list.push(pt.y);
      }
    }
    this.list = [];
    this.points = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public push(x: number, y: number) {
    const scaleX = this.canvas.width * 1.0;
    const scaleY = this.canvas.height * 1.0;
    if (this.replace) {
      this.list.length = 0;
    }
    this.points.push({ x: x / scaleX, y: y / scaleY });
    this.draw();
  }

  public pop() {
    if (this.points.length > 0) {
      this.points.pop();
    }
    this.draw();
  }

  public clear(): void {
    this.list.length = 0;
    this.points = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const scaleX = this.canvas.width * 1.0;
    const scaleY = this.canvas.height * 1.0;

    this.ctx.beginPath();
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "lightgreen";
    this.ctx.lineWidth = 1;
    let start = true;
    let first: Point | undefined;
    for (const pt of this.points) {
      if (start) {
        this.ctx.moveTo(pt.x * scaleX, pt.y * scaleY);
        first = pt;
        start = false;
      } else {
        this.ctx.lineTo(pt.x * scaleX, pt.y * scaleY);
      }
      this.ctx.fillRect(pt.x * scaleX - 2, pt.y * scaleY - 2, 4, 4);
    }
    if (first) {
      this.ctx.lineTo(first.x * scaleX, first.y * scaleY);
    }
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = "lightgray";

    let startOld = true;
    let firstOld: number[] | undefined;
    let pt = [];
    for (const e of this.list) {
      pt.push(e);
      if (pt.length == 2) {
        if (startOld) {
          this.ctx.moveTo(pt[0] * scaleX, pt[1] * scaleY);
          firstOld = pt;
          startOld = false;
        } else {
          this.ctx.lineTo(pt[0] * scaleX, pt[1] * scaleY);
        }
        this.ctx.fillRect(pt[0] * scaleX - 2, pt[1] * scaleY - 2, 4, 4);
        pt = [];
      }
    }
    if (firstOld) {
      this.ctx.lineTo(firstOld[0] * scaleX, firstOld[1] * scaleY);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }

  public update(x: number, y: number) {
    this.draw();
  }
}
