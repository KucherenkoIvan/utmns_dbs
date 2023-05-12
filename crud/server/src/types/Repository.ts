export interface Repository<T> {
  exists(field: keyof T, value: T[keyof T]): Promise<boolean>;
}
