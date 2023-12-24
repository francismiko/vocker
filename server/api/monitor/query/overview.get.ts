import si from "systeminformation";

export type OverviewInfo = {
	currentLoad?: number;
	currentLoadUser?: number;
	currentLoadSystem?: number;
};

export default defineEventHandler(async () => {
	const {
		currentLoad: { currentLoad, currentLoadUser, currentLoadSystem },
	} = await si.getDynamicData();

	const overviewInfo = { currentLoad, currentLoadUser, currentLoadSystem };

	return overviewInfo;
});
