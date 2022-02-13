export function formatErrorsToFormik(errors: { propertyPath: string; message: string; field?: string }[]) {
  const formattedErrors: { [key: string]: string } = {};
  errors.forEach((error) => {
    formattedErrors[error.propertyPath ?? error.field] = error.message;
  });
  return formattedErrors;
}
