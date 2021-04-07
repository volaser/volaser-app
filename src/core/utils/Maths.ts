import { IPoint } from '../dataPoints/models/IPoint';

// TODO: investigate using https://mikemcl.github.io/bignumber.js/ for increased precision
class Maths {
  getAreaOutline(points: IPoint[]): string {
    if (points.length > 2) {
      return points.reduce((outline: string, point: IPoint) => {
        let x = point.range * Math.cos((point.angle * Math.PI) / 180);
        let y = point.range * Math.sin((point.angle * Math.PI) / 180);
        return outline + ` ${x},${y}`;
      }, '');
    }
    return '0,0';
  }

  areaFromOutline(outline: Array<IPoint>): number {
    if (!outline || outline.length < 3) {
      return 0;
    }
    // Area = (SUM i -> n ( x[i] * (y[i] - y[i+2]) ))/2
    // Outline needs to be sorted!
    const areaSum = outline
      .slice(1, -1)
      .reduce((partialArea: number, point: IPoint, index: number) => {
        const x = this.getXCoordinate(point.range, point.angle);
        const y1 = this.getYCoordinate(
          outline[index + 2].range,
          outline[index + 2].angle,
        );
        const y2 = this.getYCoordinate(
          outline[index].range,
          outline[index].angle,
        );
        return partialArea + x * (y1 - y2);
      }, 0);
    return Math.abs(areaSum / 2);
  }

  angleToRadians(angle: number): number {
    return angle * (Math.PI / 180);
  }

  getXCoordinate(distance: number, angle: number): number {
    return distance * Math.cos(this.angleToRadians(angle));
  }

  getYCoordinate(distance: number, angle: number): number {
    return distance * Math.sin(this.angleToRadians(angle));
  }

  volume(area: number, depth: number): number {
    return area * depth;
  }

  faecalSludgeVolume(area: number, depth: number, sludge: number): number {
    return area * (depth - sludge);
  }

  averageRange(rangeSum: number, nMeasurements: number) {
    return rangeSum / nMeasurements;
  }
}

export const maths = new Maths();
