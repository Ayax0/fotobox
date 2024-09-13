export default defineEventHandler(async (event) => {
	const printerId = getRouterParam(event, "printerId");
	if (!printerId)
		throw createError({ statusCode: 500, statusMessage: "printer missing" });

	await useStorage("config").setItem("printer", printerId.toString());
	return { status: "ok" };
});
