import { ICoordinates } from './ICoordinates';
import { IPoint } from './IPoint';

export interface IDataPoint {
  name: string;
  location: ICoordinates | undefined;
  locationName: string | undefined;
  time: string;
  areaOutline: Array<IPoint>;
  area: number;
  sludgeDepth: number;
  bottomDepth: number;
  containmentVolume: number;
  fecalSludgeVolume: number;
  note?: string;
  pictures?: string[];
}
