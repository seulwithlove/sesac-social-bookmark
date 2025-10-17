import { compare, hash } from "bcryptjs";
import { existsSync } from "fs";
import path from "path";
import z from "zod";
import { findMemberByEmail } from "./db";

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
    return [validErrorWithData(validator.error, obj)];
  } else {
    return [undefined, validator.data];
  }
};

const validErrorWithData = (
  error: unknown | z.ZodError,
  obj: Record<string, FormDataEntryValue | string | unknown>,
) => {
  let err =
    error instanceof z.ZodError &&
    (z.treeifyError(error as z.ZodError<typeof obj>).properties as ValidError);

  for (const [prop, value] of Object.entries(obj)) {
    if (prop.startsWith("$")) continue;
    if (!err)
      err = {
        [prop]: {
          errors: [(error as Error)?.message || JSON.stringify(error)],
        },
      };
    if (!err[prop]) err[prop] = { errors: [] };
    err[prop].value = value as string;
  }
  return err as ValidError;
};

export const validateAsync = async <T extends z.ZodObject>(
  zobj: T,
  formDataOrObj:
    | FormData
    | Record<string, FormDataEntryValue | string | unknown>,
): Promise<[ValidError] | [undefined, z.core.output<T>]> => {
  const obj =
    formDataOrObj instanceof FormData
      ? Object.fromEntries(formDataOrObj.entries())
      : formDataOrObj;
  try {
    const validData = await zobj.parseAsync(obj);
    return [undefined, validData];
  } catch (error) {
    return [validErrorWithData(error, obj)];
  }
};

export const existsEmail = async (email: string, prop: string = "email") => {
  const mbr = await findMemberByEmail(email);
  if (mbr)
    return {
      [prop]: { errors: ["Duplicated Email Address!"], value: email },
    };
};

export const encryptPassword = async (passwd: string) => hash(passwd, 10);

export const comparePassword = (
  plainPasswd: string | undefined,
  encryptPassword: string,
) => compare(plainPasswd || "", encryptPassword);

// validate filepath
export const existsFile = (filePath: string | undefined | null) => {
  if (!filePath) return filePath;

  const fullPath = path.join(process.cwd(), "public", filePath);
  return existsSync(fullPath) ? filePath : null;
};
