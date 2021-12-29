import * as yup from "yup";

export async function validateYupSchema(schema: yup.AnyObjectSchema, data: any) {
	let errorList: { propertyPath: string; message: string }[] = [];

	//
	await schema.validate(data, { abortEarly: false }).catch((e: yup.ValidationError) => {
		e.inner.forEach((innerValidation) => {
			const brokenKeys = innerValidation.path?.split(".");
			const field = brokenKeys?.[brokenKeys.length - 1] as string;

			errorList.push({ propertyPath: field, message: innerValidation.message });
		});
	});

	if (errorList.length > 0) {
		return errorList;
	}

	return null;
}
