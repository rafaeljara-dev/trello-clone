"use server";

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return {
			error: "User not logged in",
		};
	}

	const { title, image } = data;

	const [
		imageId,
		imageThumbUrl,
		imageFullUrl,
		imageLinkHTML,
		imageUserName
	] = image.split("|");

	console.log({ imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName });

	if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
		return {
			error: "Missing Fields, Failed to create board",
		};
	}
	
	let board;

	try {
		board = await db.board.create({
			data: {
				title,
				orgId,
				imageId,
				imageThumbUrl,
				imageFullUrl,
				imageLinkHTML,
				imageUserName,
			}
		});
	} catch (error) {
		return {
			error: "Database Error",
		};
	}

	revalidatePath(`/board/${board.id}`);
	return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);