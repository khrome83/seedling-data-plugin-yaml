import {
  assertEquals,
} from "https://deno.land/std@0.64.0/testing/asserts.ts";
import { denock } from "https://deno.land/x/denock@0.2.0/mod.ts";
import yaml from "./mod.ts";

const response = {
  success: (data: object) => {
    return data;
  },
  skip: (data: object) => {
    return data;
  },
  error: (data: object) => {
    return data;
  },
  end: (data: object) => {
    return data;
  },
  retry: (data: object) => {
    return data;
  },
};

Deno.test("YAML in body of data directive", async () => {
  const request = {
    attrs: {},
    body: `
    foo: bar
    baz:
      - qux
      - quux
    `,
    root: Deno.cwd(),
  };

  const output = await yaml(request, response);
  const expected = { foo: "bar", baz: ["qux", "quux"] };

  assertEquals(output, expected);
});

Deno.test("YAML from file attribute of data directive", async () => {
  const request = {
    attrs: {
      file: "test.yaml",
    },
    body: "",
    root: Deno.cwd(),
  };

  const output = await yaml(request, response);
  const expected = { foo: "bar", baz: ["qux", "quux"] };

  assertEquals(output, expected);
});

Deno.test("YAML from url attribute of data directive", async () => {
  const request = {
    attrs: {
      url: "https://example.com/test.yaml",
    },
    body: "",
    root: Deno.cwd(),
  };

  denock({
    method: "GET",
    protocol: "https",
    host: "example.com",
    path: "/test.yaml",
    replyStatus: 200,
    responseBody: `
    foo: bar
    baz:
      - qux
      - quux
    `,
  });

  const output = await yaml(request, response);
  const expected = { foo: "bar", baz: ["qux", "quux"] };

  assertEquals(output, expected);
});

Deno.test("YAML with multiple entries", async () => {
  const request = {
    attrs: {
      multiple: "multiple",
    },
    body: `
    ---
    id: 1
    name: Alice
    ---
    id: 2
    name: Bob
    ---
    id: 3
    name: Eve
    `,
    root: Deno.cwd(),
  };

  const output = await yaml(request, response);
  const expected = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Eve" },
  ];

  assertEquals(output, expected);
});
