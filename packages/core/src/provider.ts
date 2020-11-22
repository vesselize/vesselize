import { Scope } from './scope';

export interface Ctor<T = any> extends Function {
  new (...args: any[]): T;
}

export interface Factory<T = any> extends Function {
  (...args: any[]): T;
}

export type ProviderToken<T = any> = string | symbol | Ctor<T>;

export interface ClassProvider<T = any> {
  token: ProviderToken;

  useClass: Ctor<T>;

  scope?: Scope;
}

export interface FactoryProvider<T = any> {
  token: ProviderToken;

  useFactory: Factory<T>;

  scope?: Scope;
}

export interface ValueProvider<T = any> {
  token: ProviderToken;

  useValue: T;
}

export type CustomProvider<T = any> =
  | ClassProvider<T>
  | FactoryProvider<T>
  | ValueProvider<T>;

export type Provider<T = any> = Ctor<T> | CustomProvider<T>;

export type ProviderSource<T = any> = Ctor<T> | Factory<T> | T;

export interface ProviderName {
  name?: string | symbol;
}
