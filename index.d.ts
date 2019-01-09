import Component from 'marko/src/components/Component';

export interface RenderResult {
  container: HTMLElement

  /**
   * Component instance
   */
  component: Component

  getNodes: () => HTMLElement[]
}

export interface InitResult {
  /**
   * Component class, exposed so we could spy or mock on Marko component methods.
   * You can access Marko component static properties & methods through its prototype,
   * e.g `componentClass.prototype.onMount`
   */
  componentClass: Component,

  /**
   * Render & mount Marko component inside a test container, which is
   * appended to document.body.
   * It should be used with cleanup.
   */
  render: (input: any) => Promise<RenderResult>
}

/**
 * Init testing util with the given Marko component
 *
 * @param componentFullPath Full path to your Marko component
 *
 * @example
 *
 * const { render, cleanup } = init(path.resolve(__dirname, '../index.marko'));
 */
export function init(componentFullPath: string): InitResult

/**
 * Unmounts test container that were mounted with render()
 */
export function cleanup(): void
