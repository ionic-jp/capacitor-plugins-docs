/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { MarkdownContent } from "./global/definitions";
export namespace Components {
    interface AppAdmob {
    }
    interface AppCodes {
        "activeLine": Record<string, number[]>;
        "codes": Record<string, string>;
    }
    interface AppDocs {
        "path": string;
    }
    interface AppHeader {
        "isBtnActive": boolean;
    }
    interface AppHome {
    }
    interface AppMenu {
        "path": string;
    }
    interface AppParser {
        "hideCodeBlock": boolean;
        "markdownContent": MarkdownContent;
    }
    interface AppRoot {
    }
    interface AppStripe {
    }
}
declare global {
    interface HTMLAppAdmobElement extends Components.AppAdmob, HTMLStencilElement {
    }
    var HTMLAppAdmobElement: {
        prototype: HTMLAppAdmobElement;
        new (): HTMLAppAdmobElement;
    };
    interface HTMLAppCodesElement extends Components.AppCodes, HTMLStencilElement {
    }
    var HTMLAppCodesElement: {
        prototype: HTMLAppCodesElement;
        new (): HTMLAppCodesElement;
    };
    interface HTMLAppDocsElement extends Components.AppDocs, HTMLStencilElement {
    }
    var HTMLAppDocsElement: {
        prototype: HTMLAppDocsElement;
        new (): HTMLAppDocsElement;
    };
    interface HTMLAppHeaderElement extends Components.AppHeader, HTMLStencilElement {
    }
    var HTMLAppHeaderElement: {
        prototype: HTMLAppHeaderElement;
        new (): HTMLAppHeaderElement;
    };
    interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {
    }
    var HTMLAppHomeElement: {
        prototype: HTMLAppHomeElement;
        new (): HTMLAppHomeElement;
    };
    interface HTMLAppMenuElement extends Components.AppMenu, HTMLStencilElement {
    }
    var HTMLAppMenuElement: {
        prototype: HTMLAppMenuElement;
        new (): HTMLAppMenuElement;
    };
    interface HTMLAppParserElement extends Components.AppParser, HTMLStencilElement {
    }
    var HTMLAppParserElement: {
        prototype: HTMLAppParserElement;
        new (): HTMLAppParserElement;
    };
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLAppStripeElement extends Components.AppStripe, HTMLStencilElement {
    }
    var HTMLAppStripeElement: {
        prototype: HTMLAppStripeElement;
        new (): HTMLAppStripeElement;
    };
    interface HTMLElementTagNameMap {
        "app-admob": HTMLAppAdmobElement;
        "app-codes": HTMLAppCodesElement;
        "app-docs": HTMLAppDocsElement;
        "app-header": HTMLAppHeaderElement;
        "app-home": HTMLAppHomeElement;
        "app-menu": HTMLAppMenuElement;
        "app-parser": HTMLAppParserElement;
        "app-root": HTMLAppRootElement;
        "app-stripe": HTMLAppStripeElement;
    }
}
declare namespace LocalJSX {
    interface AppAdmob {
    }
    interface AppCodes {
        "activeLine"?: Record<string, number[]>;
        "codes"?: Record<string, string>;
    }
    interface AppDocs {
        "path"?: string;
    }
    interface AppHeader {
        "isBtnActive"?: boolean;
        "onChangeMenuState"?: (event: CustomEvent<boolean>) => void;
    }
    interface AppHome {
    }
    interface AppMenu {
        "onChangeMenuState"?: (event: CustomEvent<boolean>) => void;
        "path"?: string;
    }
    interface AppParser {
        "hideCodeBlock"?: boolean;
        "markdownContent"?: MarkdownContent;
        "onChangedActiveLine"?: (event: CustomEvent<Record<string, number[]>>) => void;
    }
    interface AppRoot {
    }
    interface AppStripe {
    }
    interface IntrinsicElements {
        "app-admob": AppAdmob;
        "app-codes": AppCodes;
        "app-docs": AppDocs;
        "app-header": AppHeader;
        "app-home": AppHome;
        "app-menu": AppMenu;
        "app-parser": AppParser;
        "app-root": AppRoot;
        "app-stripe": AppStripe;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-admob": LocalJSX.AppAdmob & JSXBase.HTMLAttributes<HTMLAppAdmobElement>;
            "app-codes": LocalJSX.AppCodes & JSXBase.HTMLAttributes<HTMLAppCodesElement>;
            "app-docs": LocalJSX.AppDocs & JSXBase.HTMLAttributes<HTMLAppDocsElement>;
            "app-header": LocalJSX.AppHeader & JSXBase.HTMLAttributes<HTMLAppHeaderElement>;
            "app-home": LocalJSX.AppHome & JSXBase.HTMLAttributes<HTMLAppHomeElement>;
            "app-menu": LocalJSX.AppMenu & JSXBase.HTMLAttributes<HTMLAppMenuElement>;
            "app-parser": LocalJSX.AppParser & JSXBase.HTMLAttributes<HTMLAppParserElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "app-stripe": LocalJSX.AppStripe & JSXBase.HTMLAttributes<HTMLAppStripeElement>;
        }
    }
}
