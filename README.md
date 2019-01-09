## Marko Jest &middot; [![Coverage Status](https://coveralls.io/repos/github/abiyasa/marko-jest/badge.svg?branch=master)](https://coveralls.io/github/abiyasa/marko-jest?branch=master) [![CircleCI Status](https://circleci.com/gh/abiyasa/marko-jest/tree/master.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/abiyasa/marko-jest/tree/master)

Jest Marko transformer and rendering test utility.

## What is this?

Transformer and rendering test library for [Marko 4](https://markojs.com/) component with Jest & JSDOM.

- Renders Marko component on JSDOM
- Supports rendering and client-side behaviour testing
- Snapshot testing
- TypeScript support

## Requirements

- Jest: 23.x
- Marko: ^4.9.0

## Setup

1. Add `marko-jest` to your dev dependencies. You could do it by `yarn add marko-jest --dev` or `npm install marko-jest --save-dev`.

1. Register marko preprocessor/transformer on your Jest config. This allows Jest to process and compile Marko file. Add the following lines to the Jest transform section:

```json
// package.json or jest config
{
  ...

  "jest": {
    "transform": {
      "^.+\\.marko$": "<rootDir>/node_modules/marko-jest/preprocessor.js"
    },
    ...
  },

  ...
}
```

## Quick Start

These are a quick steps to test a Marko component with marko-jest:

1. Require marko-jest module and use the `init` function to initiate the Marko component you want to test. This is the way to 'require' Marko component on test files.

1. The `init` function will return `render` function which you can use to render the initiated Marko component.

    ```javascript
    // __tests__/component.spec.js
    import { init } from 'marko-jest';
    // or const { init } = require('marko-jest');

    // init() requires full path to Marko component
    const componentPath = path.resolve(__dirname, '../index.marko');
    const { render } = init(componentPath);

    describe('test-button', () => {
      ...
    });
    ```

1. The `render` function returns `RenderResult` object which allows you to get the component instance. Use the component instance to access its [properties](https://markojs.com/docs/components/#properties) (e.g `el`, `els`, or `state`) or [methods](https://markojs.com/docs/components/#methods) (e.g `getEl()`, `update()`, `rerender()`) for testing.

    ```javascript
    // __tests__/component.spec.js
    import { init, cleanup } from 'marko-jest';

    const componentPath = path.resolve(__dirname, '../index.marko');
    const { render } = init(componentPath);

    describe('test-button', () => {
      let renderResult;

      afterEach(cleanup);

      describe('on rendering', () => {
        const input = { label: 'Click here' };

        beforeEach(async () => {
          renderResult = await render(input);
        });

        it('should render a link given default input', () => {
          const button = renderResult.component.el.querySelector('a');
          expect(button).toBeDefined();
        });
      });
    });
    ```

## Component Rendering Test

One way to test a component is to test its generated HTML. You can access it from the `RenderResult` object returned by the `render` function.

You can use the following methods/property from the `RenderResult` object:
  - Property `component`: component instance. You can access the output HTML element using Marko component instance's [properties](https://markojs.com/docs/components/#properties) (such as `el` or `els`), or [methods](https://markojs.com/docs/components/#methods) (`getEl(key)` or `getEls(key)`).
  - Property `container`: the test container element, which is a div element. Behind the scene, marko-jest `render` function automatically creates a test container and renders the component inside it.
  - Method `getNodes`: return the list of rendered HTML elements. Usually useful for snapshot testing (see next section).

Once you get the HTML element, you can use any native HTML methods to assert if a certain element or class is existed.

Examples:

```javascript
// container
it('should render icon DOWN', () => {
  const iconEl = return renderResult.container.querySelector('.btn__icon');
  expect(iconEl.innerHTML).toContain('#svg-icon-chevron-down');
});

// component instance with property el
it('should render a link given default input', () => {
  const ctaLink = rendereResult.component.el.querySelector('main-cta');
  expect(ctaLink.textContent).toBe('Shop Now');
});

// component instance with getEl() if you have key attribute inside Marko template
it('should render a link given default input', () => {
  const button = component.getEl('main-cta');
  expect(button).toBeDefined();
});

// component instance with getEls()
it('should render benefit links', () => {
  const benefitLinks = component.getEls('benefits');
  expect(benefitLinks.lenth).toBeGreaterThan(2);
});

```

## Accessing Non-Element Nodes

Marko's `getEl()` and `getEls()` returns HTML elements only, which means it does not return any non-element nodes such as **text and comment nodes**. If you want to access element & non-elements (e.g for snapshot testing), you can use RenderResult `getNodes()` which will return array of all Nodes, including HTML elements, text, and comment nodes.

```javascript
it('should render text node', () => {
  const nodes = renderResult.getNodes();

  expect(nodes[0].nodeType).toEqual(Node.TEXT_NODE);
});
```

A use case for this is you have a component which can render a text node without any HTML element as container

```marko
// span-or-text-component.marko
<span body-only-if(!input.showSpan)>
  ${input.text}
</span>
```

```javascript
// test-span-or-text-component.spec.js
import { init, cleanup } from 'marko-jest';
const { render } = init(path.resolve(__dirname, './resources/body-only-item/index.marko'));

describe('span-or-text component', () => {
  let renderResult;

  afterEach(cleanup);

  it('should render component as a span element', async () => {
    renderResult = await render({ showSpan: true, text: 'test' });
    const nodes = renderResult.getNodes();

    expect(nodes[0].nodeName).toEqual('SPAN');
    expect(nodes[0].nodeType).toEqual(Node.ELEMENT_NODE);
  });

  it('should render component as a text node', async () => {
    renderResult = await render({ showSpan: false, text: 'test' });
    const nodes = renderResult.getNodes();

    expect(nodes[0].nodeName).toEqual('#text');
    expect(nodes[0].nodeType).toEqual(Node.TEXT_NODE);
  });
});
```

## Snapshot testing

You can utilize Jest snapshot testing to test component rendering.
The RenderResult `getNodes()` will return array of HTML elements which we can use for Jest snapshot feature.

Example:

```javascript
// __tests__/component.spec.js
import * as path from 'path';
import { init, cleanup } from 'marko-jest';

const componentPath = path.resolve(__dirname, '../index.marko');
const { render } = init(componentPath);

describe('test-button', () => {
  afterEach(cleanup);

  it('should render correctly given default input', async () => {
    const input = { label: 'Click here' };
    const renderResult = await render(input);

    expect(renderResult.getNodes()).toMatchSnapshot();
  });
});
```

## Behaviour Testing

You can test component behaviour (e.g click handler) by triggering event though the HTML element.

Example on testing a toggle button:

```marko
// index.marko
class {
  onCreate() {
    this.state = {
      clicked: false
    };
  }

  toggleButton() {
    this.state.clicked = !this.state.clicked;
  }
}

<button class="btn" on-click('toggleButton')>
  <span if(state.clicked)>DONE</span>
  <span else>Click me</span>
</button>
```

You can access the button element and trigger the click:

```javascript
// __tests__/index.spec.js
import * as path from 'path';
import { init, cleanup } from 'marko-jest';

const componentPath = path.resolve(__dirname, '../index.marko');
const { render } = init(componentPath);

describe('test-simple-button', () => {
  let component;

  afterEach(cleanup);

  describe('on rendering', () => {
    let mainButton;

    beforeEach(async () => {
      const renderResult = await render({ });

      component = renderResult.component;
      mainButton = component.getEl('rootButton');
    });

    it('should render a button', () => {
      expect(mainButton).toBeTruthy();
    });

    it('should render default label', () => {
      const buttonLabel = mainButton.textContent;
      expect(buttonLabel).toEqual('Click me');
    });

    describe('when clicked', () => {
      beforeEach(() => {
        mainButton.click();
        component.update();
      });

      it('should change the button label', () => {
        const buttonLabel = mainButton.textContent;
        expect(buttonLabel).toEqual('DONE');
      });
    });
  });
});
```

You can also combine it with snapshot testing:

```javascript
import * as path from 'path';
import { init, cleanup } from 'marko-jest';

const componentPath = path.resolve(__dirname, '../index.marko');
const { render } = init(componentPath);

describe('test-simple-button', () => {
  let renderResult;
  let component;

  afterEach(cleanup);

  describe('on rendering', () => {
    beforeEach(async () => {
      renderResult = await render({ });
      component = renderResult.component;
    });

    it('should render correctly', () => {
      expect(renderResult.getNodes()).toMatchSnapshot();
    });

    describe('when clicked', () => {
      beforeEach(() => {
        component.getEl('rootButton').click();
        component.update();
      });

      it('should update the element', () => {
        expect(renderResult.getNodes()).toMatchSnapshot();
      });
    });
  });
});
```

## TypeScript Support

`marko-jest` module provides TypeScript type definition. Make sure you also install type definition for Marko by adding module `@types/marko` to your project.

## Shallow Rendering

marko-jest can do [shallow rendering](https://reactjs.org/docs/shallow-renderer.html) on external component. If you use external Marko component module/library (such as [ebayui-core](https://github.com/eBay/ebayui-core)), you can exclude those components from being rendered deeply by adding the module name to Jest globals config `taglibExcludePackages`. marko-jest will use Marko's [`taglibFinder.excludePackage()`](https://markojs.com/docs/custom-tags/#hiding-taglibs) to prevent any components from those modules to be rendered.

For example, if you want to do shallow rendering on all components from `@ebay/ebayui-core` module, add the module name to Jest globals config:

```json
// package.json
{
  ...

  "jest": {
    "transform": {
      ...
    },
    ...
    "globals": {
      "marko-jest": {
        "taglibExcludePackages": [
          "@ebay/ebayui-core",
          "marko-material"
        ]
      }
    }
  },

  ...
}
```

Now Marko Jest will render your Marko component:

```marko
// cta-component.marko
<section>
  <ebay-button priority="primary" on-click('toggleButton')>
    PAY
  </ebay-button>
</section>
```

As:

```html
<section>
  <ebay-button priority="primary">PAY</ebay-button>
<section>
```

Instead of

```html
<section>
  <button type="button" class="btn btn--primary">PAY</button>
<section>
```

One of the advantages of shallow rendering is to isolate your unit test so you can focus on testing your component instead of the external ones. On the example above, if the `ebay-button` implementation has changed (e.g css class name or new attribute added), your snapshot test will not failed.

### Current Limitation of marko-jest shallow rendering

- The shallow rendering will affect ALL test suites, you cannot turn it on or off
 during runtime.
- You can only do shallow rendering on external modules. Unfortunately, you cannot do shallow rendering on component from the same project. The only workaround so far is to separate your UI component as external module (npm package) and consume it on your project.


## marko-jest APIs

marko-jest API provides 2 high level functions: `init` and `cleanup`.

### `init(fullPathToMarkoComponent: string): InitResult`

This is a way to 'require' Marko component on test file. It requires full path to Marko component.

At the moment, you can't easily require Marko component on Node.js with JSDOM. By default, when a Marko component is required on Node.js, you can only do server-side-only component. This means you can render the component as HTML but without any browser-side features such as render to virtual DOM, DOM event handling, or browser-side lifecycle.

`init` function will 'trick' Marko to require a component on Node.js as if it's done on browser. Therefore, the required component will have all browser-side features, including component rendering.

The `init` function will return an object **`InitResult`** which has:

  * property **`componentClass: Component`**, the Class of require/init-ed Marko Component. Quite useful if you want to spy on Marko component lifecycle method.
  * function **`render(input: any): Promise<RenderResult>`**: Asynchronously render the component using the given input. This will return a promise which will be resolved with an instance of `RenderResult`.

The **`RenderResult`** is the result of component rendering which has:

  * property **`component: Component`**: the rendered component instance. Use this instance to access any Marko component [properties](https://markojs.com/docs/components/#properties) or [methods](https://markojs.com/docs/components/#methods).
  * property **`container: HTMLElement`**: the test container element, which is a div element. Behind the scene, marko-jest `render` function automatically creates a test container and renders the component inside it.
  * method **`getNodes(): HTMLElement[]`**: return the list of any rendered HTML elements. This method is better than Marko's `getEl()` and `getEls()` which does not return any non-element nodes such as **text and comment nodes**. If you want to access element & non-elements (e.g for snapshot testing), you can use `getNodes()` which will return array of all Nodes, including HTML elements, text, and comment nodes.


### `cleanup(): void`

Remove all test containers created by the `render` function. Totally recommended to call cleanup on Jest `afterEach`.

For more info about marko-jest API, you can check the TypeScript type definition [here](index.d.ts)

## Known Issues

* Failed rendering Marko component with custom transformer
* Limited support of shallow rendering, see Shallow Rendering above or https://github.com/abiyasa/marko-jest/issues/1

## Roadmap

Planned new features and improvements:

* Better support of shallow and deep rendering.

## Contributing

Contributing guidelines is still WIP but you're welcome to contribute by creating issues or Pull Request.

## License

MIT
