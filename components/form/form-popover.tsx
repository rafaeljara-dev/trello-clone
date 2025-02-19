"use client";

import { ElementRef, useRef } from "react";

import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";

import { useAction } from "@/hook/use-action";
import { createBoard } from "@/actions/create-board";

import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { Button } from "../ui/button";
import { FormPicker } from "./form-picker";

interface FormPopoverProps {
	children: React.ReactNode;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	sideOffset?: number;
};

export const FormPopover = ({
	children,
	side = "bottom",
	align,
	sideOffset = 0
}: FormPopoverProps) => {
	const router = useRouter();
	const closeRef = useRef<ElementRef<"button">>(null);

	const { execute, fieldErrors } = useAction(createBoard, {
		onSuccess: (data) => {
			// console.log({ data });
			toast.success("Board created successfully");
			closeRef.current?.click();
			router.push(`/board/${data.id}`);
		},
		onError: (error) => {
			// console.log({ error });
			toast.error(error);
		}
	});

	const onSubmit = (formData: FormData) => {
		const title = formData.get("title") as string;
		const image = formData.get("image") as string;
		
		// console.log({ image });

		execute({ title, image});
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				{children}
			</PopoverTrigger>
			<PopoverContent
				align={align}
				className="w-80 pt-3"
				side={side}
				sideOffset={sideOffset}>
				<div className="text-sm font-medium text-center text-neutral-600 pb-4">
					Create Board
				</div>
				<PopoverClose ref={closeRef} asChild>
					<Button className="h-auto w-auto p-2 absolute top-2 right-2"
						variant="ghost">
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>

				<form action={onSubmit} className="space-y-4">
					<div className="space-y-4">
						<FormPicker id="image" errors={fieldErrors} />
						<FormInput
							label="Board title"
							id="title"
							type="text"
							errors={fieldErrors}
						/>
					</div>
					<FormSubmit className="w-full">
						Create
					</FormSubmit>
				</form>
				
			</PopoverContent>
		</Popover>
	);
};
