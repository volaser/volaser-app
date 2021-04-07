import { IFileSystemService } from '../../core/dataPoints/services/IFileSystemService';
import RNFS, { ReadDirItem } from 'react-native-fs';
import { logger } from '../../ui/helpers/logger';
import { Alert } from 'react-native';
import moment from 'moment';
import { EXPORT_PREFIX } from '../constants/appConstants';

export class FileSystemService implements IFileSystemService {
  constructor() {}
  tmpDir: string = RNFS.TemporaryDirectoryPath;
  workingDir: string = RNFS.DocumentDirectoryPath;

  async cp(filePath: string, destinationPath: string): Promise<void> {
    return RNFS.copyFile(filePath, destinationPath);
  }

  async mkdir(path: string): Promise<void> {
    return RNFS.mkdir(path);
  }

  async rm(path: string): Promise<void> {
    try {
      await RNFS.unlink(path);
    } catch (error) {
      logger.warn(error);
    }
  }

  async mv(filePath: string, destinationPath: string): Promise<void> {
    return RNFS.moveFile(filePath, destinationPath);
  }

  async write(path: string, content: string, encoding?: string): Promise<void> {
    try {
      return RNFS.writeFile(path, content, encoding);
    } catch (error) {
      Alert.alert(
        'There was an unexpected error when trying to write to the file, please try again',
      );
    }
  }

  async ls(path: string): Promise<ReadDirItem[]> {
    return RNFS.readDir(path);
  }

  /* Delete all export files older than 1h */
  async cleanExportCache(): Promise<void> {
    logger.info('Cleaning up cache...');
    const tmpFiles: ReadDirItem[] = await this.ls(this.tmpDir);
    const now = moment();

    for await (const tmpFile of tmpFiles) {
      const timeDiffInHours = moment
        .duration(now.diff(moment(tmpFile.mtime)))
        .asHours();

      const isTmpFile = tmpFile.name.includes(EXPORT_PREFIX);
      if (timeDiffInHours > 1 && isTmpFile) {
        this.rm(tmpFile.path);
      }
    }
  }
}
