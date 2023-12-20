import si from "systeminformation";

export type DockerInfo = {
	id?: string;
	containers?: number;
};

export default defineEventHandler(async () => {
	const info = await si.dockerInfo();

	const dockerInfo: DockerInfo = {
		id: info.id,
		containers: info.containers,
	};

	return dockerInfo;
});
