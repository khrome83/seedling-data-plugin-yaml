import type {
  Request,
  Response,
} from "https://raw.githubusercontent.com/use-seedling/seedling/master/mod.ts";
import { join } from "https://deno.land/std@0.70.0/path/mod.ts";
import { parse, parseAll } from "https://deno.land/std@0.70.0/encoding/yaml.ts";

interface YAMLFiles {
  file?: string;
  url?: string;
  multiple?: string | boolean;
}

export default async (request: Request, response: Response) => {
  const body = request.body;
  const { file, url, multiple } = request.attrs as YAMLFiles;
  const parser = (multiple !== undefined) ? parseAll : parse;

  if (body !== undefined && body.length > 0) {
    try {
      // Need to remove any indentation, uses the first line as the measurement
      const modified = [];
      const [full] = body.match(/^(\s)+/) || [];
      const parts = body.split("\n");

      for (let i = 0, len = parts.length; i < len; i++) {
        modified.push(parts[i].substring(full.length - 1));
      }

      return response.success(parser(modified.join("\n")));
    } catch (e) {
      console.log(e);
      return response.error(
        "Unable to parse YAML in body of Data Directive",
        e,
      );
    }
  } else if (file !== undefined) {
    const path = join(request.root, file);
    try {
      const file = await Deno.readTextFile(path);
      return response.success(parser(file));
    } catch (e) {
      return response.error(`Unable to open file at '${path}'`, e);
    }
  } else if (url !== undefined) {
    try {
      const result = await fetch(url);

      if (!result.ok) {
        if (result.status >= 500) {
          return response.retry(
            "Unexpected error, backing off and then trying again",
          );
        } else if (result.status >= 400 && result.status < 500) {
          return response.error("Network issue, request failed");
        }
      }

      const output = await result.text();
      return response.success(parser(output));
    } catch (e) {
      console.log(e);
      return response.error("Something went wrong", e);
    }
  } else {
    return response.error(
      "No valid methods provided for YAML in Data Directive",
    );
  }
};
