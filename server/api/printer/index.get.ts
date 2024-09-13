import { default as printer } from "pdf-to-printer";

export default defineEventHandler(async (event) => {
	const defaults = await printer.getDefaultPrinter();
	const printers = await printer.getPrinters();
	return printers.map((prt) => ({
		default: prt.deviceId === defaults?.deviceId,
		...prt,
	}));
});
