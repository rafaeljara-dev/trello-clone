import { z } from "zod";

export type FieldErros<T> = {
	[K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
	fieldErrors?: FieldErros<TInput>;
	error?: string | null;
	data?: TOutput;
};

export const createSafeAction = <TInput, TOutput>(
	schema: z.Schema<TInput>,
	handler: (validateData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
	return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
		const validationResult = schema.safeParse(data);
		if (!validationResult.success) {
			return {
				fieldErrors: validationResult.error.flatten().fieldErrors as FieldErros<TInput>,
			};
		}
		return handler(validationResult.data);
	};
};