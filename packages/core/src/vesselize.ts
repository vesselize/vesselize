import { VesselizeAware } from './aware';
import { Context, DEFAULT_CONTEXT } from './context';
import { IHolder } from './instance-holder';
import { InstanceWrapper, InstanceWrapperType } from './instance-wrapper';
import {
  Ctor,
  ClassProvider,
  ValueProvider,
  FactoryProvider,
  Provider,
  ProviderToken,
  ProviderName,
  ProviderSource,
  CustomProvider,
} from './provider';
import { Scope } from './scope';
import { isEmpty, isFunction, isPromise, isUndefined } from './util';

export interface IVesselize {
  getProvider<T>(provide: ProviderToken<T>): ProviderSource<T>;

  get<T = any>(provide: ProviderToken<T>): T;

  getAsync<T = any>(provide: ProviderToken<T>): Promise<T>;

  getInContext<T = any>(provide: ProviderToken<T>, context: Context): T;

  getInContextAsync<T = any>(
    provide: ProviderToken<T>,
    context: Context
  ): Promise<T>;
}

export interface VesselizeOptions {
  providers: Provider[];
}

export abstract class AbstractPowerVesselize implements IVesselize {
  protected vesselize: Vesselize;

  constructor(options: VesselizeOptions) {
    this.vesselize = new Vesselize(options);
  }

  getProvider<T>(provide: ProviderToken<T>): ProviderSource<T> {
    return this.vesselize.getProvider(provide);
  }

  get<T = any>(provide: ProviderToken<T>): T {
    return this.vesselize.get(provide);
  }

  getAsync<T = any>(provide: ProviderToken<T>): Promise<T> {
    return this.vesselize.getAsync(provide);
  }

  getInContext<T = any>(provide: ProviderToken<T>, context: Context): T {
    return this.vesselize.getInContext(provide, context);
  }

  getInContextAsync<T = any>(
    provide: ProviderToken<T>,
    context: Context
  ): Promise<T> {
    return this.vesselize.getInContextAsync(provide, context);
  }
}

export class Vesselize implements IVesselize {
  private options: VesselizeOptions;
  private wrappers = new Map<string | symbol, InstanceWrapper>();

  constructor(options: VesselizeOptions) {
    this.options = options;

    this.initialzie();
  }

  protected initialzie(): void {
    const options = this.options;

    this.addProviders(options.providers);
    this.createInstances();
    this.invokeAwares();
  }

  protected addProviders(providers: Provider[] = []): void {
    for (const provider of providers) {
      this.addProvider(provider);
    }
  }

  protected addProvider(provider: Provider): void {
    if (this.isCustomProvider(provider)) {
      return this.addCustomProvider(provider);
    }

    const name = this.getProviderName(provider);

    this.addClassProvider({
      name,
      token: provider,
      useClass: provider,
    });
  }

  protected addCustomProvider(provider: CustomProvider & ProviderName): void {
    const name = this.getProviderName(provider.token);

    provider = { ...provider, name };

    if (this.isClassProvider(provider)) {
      this.addClassProvider(provider);
    } else if (this.isValueProvider(provider)) {
      this.addValueProvider(provider);
    } else if (this.isFactoryProvider(provider)) {
      this.addFactoryProvider(provider);
    }
  }

  protected addClassProvider(provider: ClassProvider & ProviderName): void {
    const { name, useClass: ctor, scope = Scope.DEFAULT } = provider;

    this.wrappers.set(
      name,
      new InstanceWrapper({
        name,
        ctor,
        scope,

        host: this,
        type: InstanceWrapperType.CLASS,
      })
    );
  }

  protected addValueProvider(provider: ValueProvider & ProviderName): void {
    const { name, useValue: value } = provider;

    this.wrappers.set(
      name,
      new InstanceWrapper({
        name,
        instance: value,

        host: this,
        type: InstanceWrapperType.VALUE,
      })
    );
  }

  protected addFactoryProvider(provider: FactoryProvider & ProviderName): void {
    const { name, useFactory: factory } = provider;

    this.wrappers.set(
      name,
      new InstanceWrapper({
        name,
        factory,

        host: this,
        type: InstanceWrapperType.FACTORY,
      })
    );
  }

  public isCustomProvider(provider: Provider): provider is CustomProvider {
    return !isUndefined((provider as CustomProvider).token);
  }

  public isClassProvider(provider: Provider): provider is ClassProvider {
    return !isUndefined((provider as ClassProvider).useClass);
  }

  public isValueProvider(provider: Provider): provider is ValueProvider {
    return !isUndefined((provider as ValueProvider).useValue);
  }

  public isFactoryProvider(provider: Provider): provider is FactoryProvider {
    return !isUndefined((provider as FactoryProvider).useFactory);
  }

  public getProviderName(provide: ProviderToken): string | symbol {
    return isFunction(provide)
      ? (provide as Ctor<any>).name
      : (provide as string | symbol);
  }

  protected createInstances(): void {
    const wrappers = this.wrappers.values();

    for (const wrapper of wrappers) {
      this.createInstance(wrapper);
    }
  }

  protected async createInstance(
    wrapper: InstanceWrapper,
    context: Context = DEFAULT_CONTEXT
  ): Promise<void> {
    if (wrapper.isClass()) {
      this.createClassInstance(wrapper, context);
    } else if (wrapper.isFactory()) {
      await this.createFactoryInstance(wrapper, context);
    }
  }

  protected createClassInstance(
    wrapper: InstanceWrapper,
    context: Context = DEFAULT_CONTEXT
  ): void {
    const { ctor: Ctor } = wrapper;
    const instance = new Ctor();

    wrapper.setInstanceByContext(context, instance);
  }

  protected async createFactoryInstance(
    wrapper: InstanceWrapper,
    context: Context = DEFAULT_CONTEXT
  ): Promise<void> {
    const { factory } = wrapper;
    const holder = wrapper.getInstanceByContext(context);
    const result = factory();

    let donePromise;

    if (isPromise<any>(result)) {
      holder.async = true;
      holder.isResolved = false;
      holder.promise = result;

      donePromise = result.then((instance) => {
        holder.instance = instance;
        holder.isResolved = true;

        return instance;
      });
    } else {
      holder.instance = result;
      donePromise = Promise.resolve(result);
    }

    return donePromise.then((instance) => {
      wrapper.setInstanceByContext(context, instance);
    });
  }

  protected invokeAwares(): void {
    const wrappers = this.wrappers.values();

    for (const wrapper of wrappers) {
      const holder = wrapper.getInstanceByContext(DEFAULT_CONTEXT);

      this.invokeInstanceAware(holder);
    }
  }

  protected async invokeInstanceAware(holder: IHolder<unknown>): Promise<void> {
    if (holder.async) {
      await holder.promise.then(() => {
        this.invokeVesselizeAware(holder.instance);
      });
    } else {
      this.invokeVesselizeAware(holder.instance);
    }
  }

  protected invokeVesselizeAware(instance: unknown): void {
    if (this.isVesselizeAware(instance)) {
      instance.setVesselize(this);
    }
  }

  public isVesselizeAware(instance: unknown): instance is VesselizeAware {
    return !isUndefined((instance as VesselizeAware).setVesselize);
  }

  public getProvider<T>(provide: ProviderToken<T>): ProviderSource<T> {
    const name = this.getProviderName(provide);
    const wrapper = this.wrappers.get(name) as InstanceWrapper<T>;

    if (!isEmpty(wrapper)) {
      if (wrapper.isClass()) {
        return wrapper.ctor;
      } else if (wrapper.isFactory()) {
        return wrapper.factory;
      } else if (wrapper.isValue()) {
        return wrapper.instance;
      }
    }
  }

  public get<T = any>(provide: ProviderToken<T>): T {
    const name = this.getProviderName(provide);
    const wrapper = this.wrappers.get(name) as InstanceWrapper<T>;

    if (!isEmpty(wrapper)) {
      return wrapper.instance;
    }
  }

  protected async createInstanceInContext<T>(
    provide: ProviderToken<T>,
    context: Context
  ): Promise<void> {
    const name = this.getProviderName(provide);
    const wrapper = this.wrappers.get(name);

    if (!isEmpty(wrapper)) {
      await this.createInstance(wrapper, context);

      await this.invokeInstanceAware(wrapper.getInstanceByContext(context));
    }
  }

  public getInContext<T = any>(provide: ProviderToken<T>, context: Context): T {
    const name = this.getProviderName(provide);
    const wrapper = this.wrappers.get(name) as InstanceWrapper<T>;

    if (!isEmpty(wrapper)) {
      const holder = wrapper.getInstanceByContext(context);

      if (!holder.instance) {
        this.createInstanceInContext(provide, context);
      }

      return holder.instance;
    }
  }

  protected async getAsyncInstance<T = any>(
    provide: ProviderToken<T>,
    context: Context = DEFAULT_CONTEXT
  ): Promise<T> {
    const name = this.getProviderName(provide);
    const wrapper = this.wrappers.get(name) as InstanceWrapper<T>;

    if (!isEmpty(wrapper)) {
      const holder = wrapper.getInstanceByContext(context);

      if (!holder.async || holder.isResolved) {
        return Promise.resolve(holder.instance);
      } else {
        return holder.promise;
      }
    }
  }

  public async getAsync<T = any>(provide: ProviderToken<T>): Promise<T> {
    const name = this.getProviderName(provide);
    return this.getAsyncInstance(name);
  }

  public async getInContextAsync<T = any>(
    provide: ProviderToken<T>,
    context: Context
  ): Promise<T> {
    const name = this.getProviderName(provide);
    const wrapper = this.wrappers.get(name) as InstanceWrapper<T>;

    if (!isEmpty(wrapper)) {
      const holder = wrapper.getInstanceByContext(context);

      if (isEmpty(holder.instance) || isEmpty(holder.promise)) {
        await this.createInstanceInContext(provide, context);
      }
    }

    return this.getAsyncInstance(name, context);
  }
}
