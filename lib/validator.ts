import z from "zod";

export type ValidError = Record<
  string,
  { errors: string[]; value?: FormDataEntryValue | null }
>;

// export type ValidError = {
//   success: false; // type
//   error: Record<
//     string,
//     { errors: string[]; value?: FormDataEntryValue | null }
//   >;
// };

export const validate = <T extends z.ZodObject>(
  zobj: T,
  formData: FormData,
): [ValidError | undefined, z.core.output<T>?] => {
  const ent = Object.fromEntries(formData.entries());
  const validator = zobj.safeParse(ent);

  if (!validator.success) {
    const err = z.treeifyError(validator.error).properties as ValidError;
    // console.log("💻 - validator.ts - err:", err);

    for (const [prop, value] of Object.entries(ent)) {
      if (prop.startsWith("$")) continue;
      if (!err[prop]) err[prop] = { errors: [] };
      err[prop].value = value;
      // err[prop] = { ...(err[prop] ?? { errors: [] }), value };
    }
    // console.log("💻 - validator.ts - err:", err);
    return [err];
  } else {
    return [undefined, validator.data];
  }
};
