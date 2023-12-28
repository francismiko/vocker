import osu from "node-os-utils";
import { fsStats } from "systeminformation";

export type OverviewInfo = {
	currentLoad?: number;
	currentLoadUser?: number;
	currentLoadSystem?: number;
	totalMemMb?: number;
	usedMemMb?: number;
	freeMemMb?: number;
	rx_sec: number | null;
	wx_sec: number | null;
};

export default defineEventHandler(async () => {
	const currentLoad = await osu.cpu.usage();
	const { totalMemMb, usedMemMb } = await osu.mem.info();
	const { rx_sec, wx_sec } = await fsStats();


	const overviewInfo: OverviewInfo = {
		currentLoad,
		totalMemMb,
		usedMemMb,
		rx_sec,
		wx_sec
	};

	return overviewInfo;
});
