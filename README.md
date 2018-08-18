## Marko Jest &middot; [![Coverage Status](https://coveralls.io/repos/github/abiyasa/marko-jest/badge.svg?branch=master)](https://coveralls.io/github/abiyasa/marko-jest?branch=master) [![CircleCI Status](https://circleci.com/gh/abiyasa/marko-jest/tree/master.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/abiyasa/marko-jest/tree/master)

Jest Marko transformer & rendering test utility.

## What is this?

Contains transformer and other rendering test utility for testing [Marko 4](https://markojs.com/) component with Jest & JSDOM.

## Requirements

- Jest: ^22.1.4
- Marko: ^4.9.0


## Setup

1. Add `marko-jest` to your dev dependencies. You could do it by `yarn add marko-jest --dev` or `npm install marko-jest --save-dev`. Note that marko-jest requires at least Jest version 22.

2. Register marko preprocessor/transformer to your Jest setup so Jest will know how to process Marko file. Add the following lines to your `package.json`:

```json
// package.json
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

## Usage

There are several steps on testing a component with marko-jest `test-utils`:

1. Require the component you want to test by using `initComponent`. This is the only way to 'require' Marko component on test file, which will return the component class.

```javascript
// __tests__/component.spec.js
import { initComponent, createTestSandbox } from 'marko-jest/test-utils';

describe('test-button', () => {
  const componentClass = initComponent(path.resolve(__dirname, '../index.marko'));

  ...
});
```

2. Create a test sandbox. The test sandbox is actual an HTML container (div) where we render & create a component instance.

```javascript
// __tests__/component.spec.js
import { initComponent, createTestSandbox } from 'marko-jest/test-utils';

describe('test-button', () => {
  let testSandbox;

  beforeEach(() => {
    testSandbox = createTestSandbox();
  });

  afterEach(() => {
    testSandbox.reset();
  });

  ...
});
```

3. Using the component class, you render the component using test sandbox's `renderComponent()`. It will return an instance of the component, which is a normal Marko component with its [properties](https://markojs.com/docs/components/#properties)(e.g `state`, `el`, `els`) and [methods](https://markojs.com/docs/components/#methods)(e.g `getEl()`, `update()`, `rerender()`)

```javascript
// __tests__/component.spec.js
describe('test-button', () => {
  const componentClass = initComponent(path.resolve(__dirname, '../index.marko'));

  let testSandbox;
  let component;

  beforeEach(() => {
    testSandbox = createTestSandbox();
  });

  afterEach(() => {
    testSandbox.reset();
  });

  describe('on rendering', () => {
    beforeEach(() => {
      // render component to sandbox
      return testSandbox
        .renderComponent(componentClass, {})
        .then(result => {
          component = result;
        });
    });

    // or if you prefer async/await:
    beforeEach(async () => {
      component = await testSandbox.renderComponent(componentClass, {});
    });


    it('should render a link given default input', () => {
      const button = testSandbox.el.querySelector('a');
      expect(button).toBeDefined();
    });
  });
});
```

## How to test component rendering

After rendering a component given the input data, you can test rendering by accessing the component HTML elements through:

* accessing directly the test sandbox `el` property (which is a div containg all the rendered result), or
* Marko component instance's  [`getEl(key)`](https://markojs.com/docs/components/#codegetelkey-indexcode) or [`getEls(key)`](https://markojs.com/docs/components/#codegetelskeycode)

Once you get the HTML element, you can use any native HTML methods to assert if a certain element or class is existed.

Examples:

```javascript
// test sandbox el (preferable)
it('should render icon DOWN', () => {
  const iconEl = return testSandbox.el.querySelector('.btn__icon');

expect(iconEl).toBeDefined();
  expect(iconEl.innerHTML).toContain('#svg-icon-chevron-down');
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

Marko's `getEl()` and `getEls()` returns HTML elements only, which means it does not return any non-element nodes such as **text and comment nodes**. If you want to access element & non-elements (e.g for snapshot testing), you can use sandbox `getRenderedNodes()` which will return array of all Nodes, including HTML elememtns, text, and comment nodes.

```
it('should render text node', () => {
  const nodes = testSandbox.getRenderedNodes();

  expect(nodes[0].nodeType).toEqual(Node.TEXT_NODE);
});
```

A use case for this is you have a component which can render a text node without any HTML element as container

```
// span-or-text-component.marko
<span body-only-if(!input.showSpan)>
  ${input.text}
</span>

// test-span-or-text-component.spec.js
describe('span-or-text component', () => {
  const componentClass = initComponent(path.resolve(__dirname, './resources/body-only-item/index.marko'));

  let testSandbox;

  beforeEach(() => {
    testSandbox = createTestSandbox();
  });

  afterEach(() => {
    testSandbox.reset();
  });


  it('should render component as a span element', async () => {
    await testSandbox.renderComponent(componentClass, { showSpan: true, text: 'test' });
    const nodes = testSandbox.getRenderedNodes();

    expect(nodes[0].nodeName).toEqual('SPAN');
    expect(nodes[0].nodeType).toEqual(Node.ELEMENT_NODE);
  });

  it('should render component as a text node', async () => {
    await testSandbox.renderComponent(componentClass, { showSpan: false, text: 'test' });
    const nodes = testSandbox.getRenderedNodes();

    expect(nodes[0].nodeName).toEqual('#text');
    expect(nodes[0].nodeType).toEqual(Node.TEXT_NODE);
  });
});
```

## Snapshot testing

You can utilize Jest snapshot testing to test component rendering.
The sandbox `getRenderedNodes()` will return array of HTML elements which we can use for Jest snapshot feature.

Example:

```javascript
// __tests__/component.spec.js
describe('test-button', () => {
  let testSandbox;
  let component;

  // init sandbox
  ...

  describe('on rendering', () => {
    beforeEach(() => {
      // render component to sandbox
      ...
    });

    it('should render correctly given default input', () => {
      expect(testSandbox.getRenderedNodes()).toMatchSnapshot();
    });
  });
});
```

## Behaviour testing

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
import { initComponent, createTestSandbox } from 'marko-jest/test-utils';

describe('test-simple-button', () => {
  const componentClass = initComponent(path.resolve(__dirname, '../index.marko'));

  let testSandbox;
  let component;

  beforeEach(() => {
    testSandbox = createTestSandbox();
  });

  afterEach(() => {
    testSandbox.reset();
  });

  describe('on rendering', () => {
    let mainButton;

    beforeEach(async () => {
      component = await testSandbox.renderComponent(componentClass, { });
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

You can also combine it with snapshot testing to test rendering:

```javascript
import * as path from 'path';
import { initComponent, createTestSandbox } from 'marko-jest/test-utils';

describe('test-simple-button', () => {
  const componentClass = initComponent(path.resolve(__dirname, '../index.marko'));

  let testSandbox;
  let component;

  beforeEach(() => {
    testSandbox = createTestSandbox();
  });

  afterEach(() => {
    testSandbox.reset();
  });

  describe('on rendering', () => {
    beforeEach(async () => {
      component = await testSandbox.renderComponent(componentClass, { });
    });

    it('should render correctly', () => {
      expect(testSandbox.getRenderedNodes()).toMatchSnapshot();
    });

    describe('when clicked', () => {
      beforeEach(() => {
        component.getEl('rootButton').click();
        component.update();
      });

      it('should update the element', () => {
        expect(testSandbox.getRenderedNodes()).toMatchSnapshot();
      });
    });
  });
});
```

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

Now Marko Jest will render your component:

```html
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

marko-jest API provides 2 APIs:
  * `initComponent`: This is the only way to 'require' Marko component on test file.

    At the moment, you can't easily require Marko component on Node.js with JSDOM. By default, when a Marko component is required on Node.js, you can only do server-side-only component. This means you can render the component, but you don't have any browser-side features (e.g render to virtual DOM, DOM event handling, or browser-side lifecycle).

    `initComponent` will 'trick' Marko to require a component on Node.js as if it's done on browser. Therefore, the required component will have all browser-side features, including component rendering.

  * `createTestSandbox`: Create a test sandbox, where you can render a component into.

The test sandbox is basically an empty div container where the tested component will be rendered into. It has several methods:

  * `renderComponent(ComponentClass, input)`: Asynchronously render a component using the input as the data for the component. This will return a promise which will be resolved with an instance of the component.
  * `reset()`: Empty and remove the test sandbox. This will remove the component instance as well.
  * `getRenderedNodes()`: Return array of Nodes, including HTML and non-HTML (text & comment nodes) elements.
  * Property `el`: You can access directly to the container HTML element using property `el`.

## Known Issues

* Failed rendering Marko component with custom transformer
* Limited support of shallow rendering, see Shallow Rendering above or https://github.com/abiyasa/marko-jest/issues/1

## Roadmap

Planned new features and improvements:

* API simplification: remove test sandbox.
* Better support of shallow and deep rendering.

## Contributing

Contributing guidelines is still WIP but you're welcome to contribute by creating issues or Pull Request.

## License

MIT
