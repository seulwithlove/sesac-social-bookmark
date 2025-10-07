import { compare } from "bcryptjs";
import { existsSync } from "fs";
import path from "path";
import z from "zod";

export type ValidError = Record<
  string,
  { errors: string[]; value?: FormDataEntryValue | null }
>;

// export type ValidError = {
//   success: false; // type 판별자
//   error: Record<
//     string,
//     { errors: string[]; value?: FormDataEntryValue | null }
//   >;
// };

export const validate = <T extends z.ZodObject>(
  zobj: T,
  formData: FormData,
): [ValidError] | [undefined, z.core.output<T>] =>
  validateObject(zobj, Object.fromEntries(formData.entries()));

export const validateObject = <T extends z.ZodObject>(
  zobj: T,
  obj: Record<string, FormDataEntryValue | string | unknown>,
): [ValidError] | [undefined, z.core.output<T>] => {
  const validator = zobj.safeParse(obj);

  if (!validator.success) {
    const err = z.treeifyError(validator.error).properties as ValidError;
    // console.log("💻 - validator.ts - err:", err);

    for (const [prop, value] of Object.entries(obj)) {
      if (prop.startsWith("$")) continue;
      if (!err[prop]) err[prop] = { errors: [] };
      err[prop].value = value as string;
      // err[prop] = { ...(err[prop] ?? { errors: [] }), value };
    }
    // console.log("💻 - validator.ts - err:", err);
    return [err];
  } else {
    return [undefined, validator.data];
  }
};

export const comparePassword = (p1: string | undefined, p2: string) =>
  compare(p1 || "", p2 || "");

// validate filepath
export const existsFile = (filePath: string | undefined | null) => {
  if (!filePath) return filePath;

  const fullPath = path.join(process.cwd(), "public", filePath);
  return existsSync(fullPath) ? filePath : null;
};
