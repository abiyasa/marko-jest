# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.0.0] - 2019-01-10

### Changed

- Breaking: Remove test sandbox
- Breaking: API simplification, added init function to init Marko component. Added render and cleanup function

### Added

- TypeScript definition

## [4.2.0] - 2018-08-24

### Added

- Support Jest 23

## [4.1.0] - 2018-08-20

### Added

- New feature: support shallow rendering with Marko `taglibFinder.excludePackage()`. Add module name to Jest globals `marko-jest` > `taglibExcludePackages`. All components from that module/package will be shallow rendered

## [4.0.0] - 2018-08-01

### Added

- Implement sandbox `getRenderedNodes()` to get all rendered nodes (including HTML and non-HTML element nodes). Marko component property el & els will be deprecated.

### Changed

- Breaking change: Increase the minimum Marko version (min 4.9.x)
- Breaking change: Update Jest version

## [3.0.0] - 2018-01-26

### Fixed

- Fix the issues with nested components rendering. This is breaking changes since it will break the tests result from the previous version.
- `component.getComponents()` and `component.getComponent()` works properly
- All nested components are now rendered & instances are initiated properly.

## [2.1.1] - 2018-01-25

### Fixed

- Remove child elements removal on sandbox reset. This could cause node issues on some component with nesting ones.

## [2.1.0] - 2018-01-22

### Added

- MIT License ⚖️

## [2.0.0] - 2018-01-22

### Changed

- Update to Jest 22. No need to do JSDOM setup. Jest 22 comes with JSDOM.
- Tests run up to 30% faster.

## [1.1.0] - 2018-01-22

### Added

- Initial release 🎊
