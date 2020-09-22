# seedling-data-plugin-yaml

A data plugin to read and parse YAML data.

## Usage

1. Create a new file in `/data` with the name `yaml.ts`.

```ts
import yaml from "https://deno.land/x/seedling_data_plugin_yaml@0.0.1/mod.ts";
export default yaml;
```

2. Use with seedling data directive. There are three ways to use the directive.

### As raw inline YAML

```html
  <:data use="yaml">
    foo: bar
    baz:
      - qux
      - quux
  </:data>
```

### From a local file

```html
<:data use="yaml" file="path/to/json/file.yaml" />
```

> **Note** - This plugin requires the `--allow-read` command line parameter for Deno when using file attribute.

### From a remote url

```html
<:data use="yaml" url="https://example.com/path/to/file.yaml" />
```

> **Note** - This plugin requires the `--allow-net` command line parameter for Deno when using url attribute.

## Multiple YAML Documents

If you have a YAML document with multiple entries within it, seperated by `---`, you can pass `multiple` attribute to the directive to get an array of the parsed values.

```html
  <:data use="yaml" multiple>
    ---
    id: 1
    name: Alice
    ---
    id: 2
    name: Bob
    ---
    id: 3
    name: Eve
  </:data>
```
