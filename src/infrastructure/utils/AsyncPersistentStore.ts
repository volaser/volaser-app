import AsyncStorage from '@react-native-community/async-storage';

export class AsyncPersistentStore<S> {
  storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  write(value: S): Promise<void> {
    const valueString = JSON.stringify(value);
    return AsyncStorage.setItem(this.storageKey, valueString);
  }
  async read(): Promise<S | undefined> {
    const valueString = await AsyncStorage.getItem(this.storageKey);
    if (!valueString) {
      return;
    }
    return JSON.parse(valueString) as S;
  }
  clear(): Promise<void> {
    return AsyncStorage.removeItem(this.storageKey);
  }
}
