import { IDataPoint } from '../../core/dataPoints/models/IDataPoint';
import { printLocation } from '../../ui/helpers/printLocation';

export const generateCsvString = (dataPoints: Array<IDataPoint>): string => {
  if (dataPoints.length === 0) {
    return '';
  }

  const header = `${Object.keys(new PrintableDataPoint(dataPoints[0])).join(
    ',',
  )}\n`;

  const rows = dataPoints.map(dataPoint => {
    return Object.values(new PrintableDataPoint(dataPoint)).join(',');
  });
  return header + rows.join('\n');
};

class PrintableDataPoint {
  name: string;
  location: string | undefined;
  locationName: string | undefined;
  time: string;
  area: string;
  sludgeDepth: string;
  bottomDepth: string;
  containmentVolume: string;
  fecalSludgeVolume: string;
  note: string;
  constructor({
    name,
    location,
    locationName,
    time,
    area,
    sludgeDepth,
    bottomDepth,
    containmentVolume,
    fecalSludgeVolume,
    note = '',
  }: IDataPoint) {
    this.name = `"${name}"`;
    this.location = printLocation(location).replace(',', '');
    this.locationName = locationName;
    this.time = time;
    this.area = area.toFixed(2);
    this.sludgeDepth = sludgeDepth.toFixed(2);
    this.bottomDepth = bottomDepth.toFixed(2);
    this.containmentVolume = containmentVolume.toFixed(2);
    this.fecalSludgeVolume = fecalSludgeVolume.toFixed(2);
    this.note = `"${note}"`; // Wrap in quotes or commas would be considered as a new column
  }
}
