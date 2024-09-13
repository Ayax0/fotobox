import { v7 as uuid } from "uuid";
import { extension } from "mime-types";

export default defineEventHandler(async (event) => {
	const data = await readMultipartFormData(event);

	if (!data || data.length === 0)
		throw createError({ statusCode: 500, statusMessage: "image missing" });

	const id = uuid();
	const image = data[0];
	const filename = `${id}.${extension(image.type || "image/png")}`;

	useStorage("image").setItemRaw(filename, image.data);

	return { id, filename };
});
