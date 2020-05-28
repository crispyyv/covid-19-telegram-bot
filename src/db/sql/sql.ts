import { QueryFile, IQueryFileOptions } from "pg-promise";
import * as path from "path";

export function sql(file: string): QueryFile {
  const fullPath: string = path.join(__dirname, file); // generating full path;

  const options: IQueryFileOptions = {
    minify: true,
    params: {
      schema: "public",
    },
  };

  const qf: QueryFile = new QueryFile(fullPath, options);

  if (qf.error) {
    throw qf.error;
  }

  return qf;
}
