# Design Details

The `this` object contains:

* Layout Settings: `StylePrefix`
* Inherited EventEmitter Functionality: `on`, `emit`, `once`
* Form-Like Data: `form`
* Root DOM Element: `container`
* Prototype Functions: `build`

Each tag object contains:

* Tag Type: `type`
* Tag Settings/Data: `StyleSuffix`, `RowClick`, `ColumnClick`
* Parent Tag Object: `parent`
* DOM Element: `element`

A subset of child settings bubble to all automatically generated parents. Parent
settings can affect how children are generated.
