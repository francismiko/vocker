import osu from "node-os-utils";

export type OverviewInfo = {
	currentLoad?: number;
	currentLoadUser?: number;
	currentLoadSystem?: number;
	totalMemMb?: number;
	userMemMb?: number;
	freeMemMb?: number;
};

export default defineEventHandler(async () => {
	const currentLoad = await osu.cpu.usage();
	const currentMem = await osu.mem.info();

	const overviewInfo: OverviewInfo = {
		currentLoad: currentLoad,
		totalMemMb: currentMem.totalMemMb,
		userMemMb: currentMem.usedMemMb,
	};

	return overviewInfo;
});
