import osu from "node-os-utils";

export type OverviewInfo = {
	currentLoad?: number;
	currentLoadUser?: number;
	currentLoadSystem?: number;
};

export default defineEventHandler(async () => {
	const currentLoad = await osu.cpu.usage();

	const overviewInfo: OverviewInfo = { currentLoad };

	return overviewInfo;
});
