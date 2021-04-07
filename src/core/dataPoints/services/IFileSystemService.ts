import { ReadDirItem } from 'react-native-fs';

export interface IFileSystemService {
  tmpDir: string;
  workingDir: string;
  cp(filePath: string, destinationPath: string): Promise<void>;
  mkdir(path: string): Promise<void>;
  rm(path: string): Promise<void>;
  mv(filePath: string, destinationPath: string): Promise<void>;
  write(path: string, content: string, encoding?: string): Promise<void>;
  ls(path: string): Promise<ReadDirItem[]>;
  cleanExportCache(): Promise<void>;
}
