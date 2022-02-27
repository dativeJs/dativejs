export interface Config {
  slient: boolean;
  /** @default 'development' */
  mode: string;
  noop: () => void;
  CurrentInstance: any;
}
export type Animate = {
   animate: (keyframes: Keyframe[] | PropertyIndexedKeyframes, options?: number | KeyframeAnimationOptions)=> Animation,
   duration: number,
   delay: number,
   setStyle: (options: CSSStyleDeclaration)=> void
}

type DativeAnimateOptions = {
  [x:string]: ({ animate,duration,delay, setStyle }:Animate)=> void
}

type Computed = { [x: string]: Function | { get: Function, set: Function } }


export type Data= Record<string, any>;

export interface DativeOptions {
  data?: Data;
  el?: string | Element;
  target?: string | Element;
  methods?: object;
  template?: string;
  oncreated?: ()=> void;
  onmounted?: ()=> void;
  ondestroy?: ()=> void;
  use: Array<object | Function>;
  computed?: Computed;
  /** @deprecated Removed In V2-alpha */
  update?: Function;
  /** @deprecated Removed In V2-alpha */
  store?: Function;
  /** @deprecated Removed In V2-alpha Use 'onmounted' */
  mounted?: Function;
  /** @deprecated Removed In V2-alpha Use 'oncreated' */
  created?: Function;
  animate: DativeAnimateOptions
}

export type dativeComponentPropsobj = {
  type?:
    | StringConstructor
    | ArrayConstructor
    | FunctionConstructor
    | BooleanConstructor
    | ObjectConstructor
    | null;
};
export type dativeComponentProps =
  | StringConstructor
  | ArrayConstructor
  | FunctionConstructor
  | BooleanConstructor
  | ObjectConstructor
  | null;

export interface DativeComponentOptions extends DativeOptions {
  css?: string;
  props?: dativeComponentPropsobj | dativeComponentProps;
}

export type utlistype = {
  warn: (msg: any, ...other: any[]) => void;
};

export type Ref = {
  [x: string]: Element
}



export default class Dative {
  constructor(options?: DativeOptions);
  $el: Element;
  data: Record<string, any>;
  template: string;
  methods: object;
  oncreated: Function;
  onmounted: Function;
  ondestroy: Function;
  isUnmounted: boolean;
  isMounted: boolean;
  cssId_: string;
  animate: DativeAnimateOptions;
  attached: Array<DativeComponent>;
  /** @default false */
  sanitize: boolean;
  attach(component: Array<Function>): void;
  detach(component: Array<Function>): void;
  use(...args: any[]): void;
  set(obj: object | any): void;
  $ref: Ref;
  get(value?: string): Dative | any;
  proxy(sourceKey: string, key: string): any;
  $destroy(): void;
  render(): Element;
  /** @returns {Element} for further usuage */
  mount(el: string): Element;
  static defineApp(options: DativeOptions): Dative;
  static defineProperty(name: string, callback: () => any): void;
  static extend(options: DativeComponentOptions): typeof DativeComponent;
  static version: string;
  static utlis: utlistype;
  static config: Config;
}

export type dativeComponentCss = {
  value: string;
  transformed: {
    active: boolean;
    value: string;
  };
};


type Props = {
  [x: string]: any
}

export class DativeComponent extends Dative {
  constructor(options: DativeComponentOptions);
  cssScoped: string;
  props: Props;
  css?: dativeComponentCss;
}

export function defineApp(options: DativeOptions): Dative;
export function defineProperty(name: string, callback: Function): void;

export function warn(msg: any, ...other: any[]): void;

export type DativePluginInstall = {
  instance: any,
  proto: any,
  Dative: Dative
}

export type DativePlugin = Function | {
  install: ({ instance,proto, Dative }: DativePluginInstall)=> void
}
