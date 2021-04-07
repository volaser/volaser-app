import { inject, injectable } from 'tsyringe';
import { IUsecase } from '../../utils/IUsecase';
import { IDataPoint } from '../models/IDataPoint';
import { generateCsvString } from '../../../infrastructure/utils/generateCsvString';
import { logger } from '../../../ui/helpers/logger';
import Share, { Options } from 'react-native-share';
import { zip } from 'react-native-zip-archive';
import moment from 'moment';
import { IFileSystemService } from '../services/IFileSystemService';
import { IDataPointService } from '../services/IDataPointService';
import {
  DATE_FORMAT_WITH_SECONDS,
  DEFAULT_DATE_FORMAT,
  EXPORT_PREFIX,
} from '../../../infrastructure/constants/appConstants';

@injectable()
export class ExportDataPointsUsecase
  implements IUsecase<Array<IDataPoint>, Promise<void>> {
  constructor(
    @inject('IDataPointService')
    private readonly dataPointService: IDataPointService,
    @inject('IFileSystemService')
    private readonly fs: IFileSystemService,
  ) {}

  /*
   * Generate CSV, zip it and share it
   */
  async execute(dataPoints: Array<IDataPoint>): Promise<void> {
    const nowString: string = moment().format(DATE_FORMAT_WITH_SECONDS);
    const exportDir = await this.createExportDir(nowString);
    await this.writeCSV(dataPoints, exportDir, nowString);
    await this.copyPicturesForExport(exportDir, dataPoints);
    await this.zipAndShare(exportDir);
  }

  private async writeCSV(
    dataPoints: Array<IDataPoint>,
    exportDir: string,
    now: string,
  ): Promise<void> {
    const csvString = generateCsvString(dataPoints);
    const csvPath = `${exportDir}/${EXPORT_PREFIX}_${now}.csv`;
    await this.fs.write(csvPath, csvString, 'utf8');
  }

  private async createExportDir(now: string): Promise<string> {
    const exportPath = `${this.fs.tmpDir}/${EXPORT_PREFIX}_${now}`;
    await this.fs.mkdir(exportPath);
    return exportPath;
  }

  private async copyPicturesForExport(
    exportDir: string,
    dataPoints: IDataPoint[],
  ): Promise<void> {
    for await (const dataPoint of dataPoints) {
      const safeDataPointName = this.dataPointService.safeDataPointName(
        dataPoint,
      );

      const dateString = moment
        .parseZone(dataPoint.time)
        .format(DEFAULT_DATE_FORMAT)
        .toString();

      const dataPointPath = `${exportDir}/${dateString}_${safeDataPointName}`;
      await this.fs.mkdir(dataPointPath);

      if (dataPoint.pictures) {
        let i = 0;
        for await (const picture of dataPoint.pictures) {
          const destPath = `${dataPointPath}/${safeDataPointName}_${i.toString()}.jpg`;
          await this.fs.cp(picture, destPath);
          i++;
        }
      }
    }
  }

  private async zipAndShare(exportDir: string): Promise<void> {
    const nowString: string = moment().format(DEFAULT_DATE_FORMAT);
    const tmpZipPath = `${this.fs.tmpDir}/${EXPORT_PREFIX}_${nowString}.zip`;
    await zip(exportDir, tmpZipPath);
    await this.shareFile(tmpZipPath);
    await this.fs.cleanExportCache();
  }

  private async shareFile(path: string): Promise<void> {
    const date = new Date();
    const shareOptions: Options = {
      message: `Volaser export from ${date.toISOString()}`,
      title: 'Volaser Export',
      url: `file://${path}`,
    };
    try {
      await Share.open(shareOptions);
    } catch (error) {
      logger.warn(error);
    }
  }
}
