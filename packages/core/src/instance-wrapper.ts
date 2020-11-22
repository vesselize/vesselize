import { IVesselize } from './vesselize';
import { DEFAULT_CONTEXT, Context } from './context';
import { createInstanceHolder, IHolder } from './instance-holder';
import { Ctor, Factory } from './provider';
import { Scope } from './scope';

export enum InstanceWrapperType {
  CLASS,
  VALUE,
  FACTORY,
}

export class InstanceWrapper<T = any> {
  public readonly host: IVesselize;
  public readonly name: string | symbol;
  public readonly type: InstanceWrapperType;
  public readonly ctor?: Ctor<T>;
  public readonly factory?: Factory<T>;
  public readonly scope?: Scope;

  private readonly values = new WeakMap<Context, IHolder<T>>();

  constructor(definition: Partial<InstanceWrapper>) {
    const { host, name, type, ctor, instance, factory, scope } = definition;

    this.host = host;
    this.name = name;
    this.type = type;
    this.ctor = ctor;
    this.instance = instance;
    this.factory = factory;
    this.scope = scope;
  }

  get instance(): T {
    return this.getInstanceByContext(DEFAULT_CONTEXT).instance;
  }

  set instance(value: T) {
    this.setInstanceByContext(DEFAULT_CONTEXT, value);
  }

  private safeGetHolder(context: Context): IHolder<T> {
    let holder = this.values.get(context);

    if (!holder) {
      holder = createInstanceHolder<T>({});

      this.values.set(context, holder);
    }

    return holder;
  }

  public getInstanceByContext(context: Context): IHolder<T> {
    return this.safeGetHolder(context);
  }

  public setInstanceByContext(context: Context, value: T): void {
    const holder = this.safeGetHolder(context);

    holder.instance = value;
  }

  public isClass(): boolean {
    return this.type === InstanceWrapperType.CLASS;
  }

  public isValue(): boolean {
    return this.type === InstanceWrapperType.VALUE;
  }

  public isFactory(): boolean {
    return this.type === InstanceWrapperType.FACTORY;
  }
}
