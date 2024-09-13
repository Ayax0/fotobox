import { imageMeta } from "image-meta";
import { PDFDocument } from "pdf-lib";
import { default as printer } from "pdf-to-printer";

export default defineEventHandler(async (event) => {
	const imagePath = getRouterParam(event, "image");
	const prt = await useStorage("config").getItem("printer");

	if (!imagePath)
		throw createError({ statusCode: 400, statusMessage: "image path missing" });

	const image = await useStorage("image").getItemRaw<Buffer>(
		imagePath?.toString(),
	);

	if (!image)
		throw createError({ statusCode: 404, statusMessage: "image not found" });

	try {
		const meta = imageMeta(new Uint8Array(image));
		if (!meta.width || !meta.height)
			throw createError({
				statusCode: 500,
				statusMessage: "missing image meta",
			});

		const doc = await PDFDocument.create();
		const page = doc.addPage([meta.width, meta.height]);

		const img = await doc.embedPng(image);
		page.drawImage(img, { x: 0, y: 0, width: meta.width, height: meta.height });

		useStorage("image").setItemRaw("_temp.pdf", await doc.save());

		// await printer.print(`${process.cwd()}/.data/image/_temp.pdf`, {
		// 	printer: prt?.toString(),
		// });
		console.log("print");
	} finally {
		useStorage("image").removeItem("_temp.pdf");
	}

	return { status: "ok" };
});
