export function formatErrorsToFormik(errors: { propertyPath: string; message: string }[]) {
	const formattedErrors: { [key: string]: string } = {};
	errors.forEach((error) => {
		formattedErrors[error.propertyPath] = error.message;
	});
	return formattedErrors;
}
