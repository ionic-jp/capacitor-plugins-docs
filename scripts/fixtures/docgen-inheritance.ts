export interface DocgenGrandBase {
  grandProperty: string;
  grandMethod(): Promise<void>;
}

export interface DocgenBase extends DocgenGrandBase {
  baseProperty: string;
  baseMethod(): Promise<void>;
}

export type DocgenBaseAlias = DocgenBase;

export interface DocgenOptions extends DocgenBaseAlias {
  ownProperty: string;
  baseProperty: number;
}

export interface DocgenBasePlugin {
  inheritedMethod(options: DocgenOptions): Promise<void>;
}

export interface DocgenFixturePlugin extends DocgenBasePlugin {
  ownMethod(options: DocgenOptions): Promise<void>;
}

export interface OrderGrandBase {
  grandProperty: string;
}

export interface OrderBase extends OrderGrandBase {
  baseProperty: string;
}

export interface OrderDerived extends OrderBase {
  ownProperty: string;
}

export interface OrderPlugin {
  inspectBase(options: OrderBase): Promise<void>;
  inspectDerived(options: OrderDerived): Promise<void>;
}
