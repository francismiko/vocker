import si from "systeminformation";

export type DockerContainer = {
	id?: string;
	name?: string;
	image?: string;
	command?: string;
	created?: number;
	started?: number;
	finished?: number;
	state?: string;
	platform?: string;
	driver?: string;
	ports?: string[];
	mounts?: string[];
};

export default defineEventHandler(async () => {
	const dockerContainers = await si.dockerAll();

	const dockerContainerList: DockerContainer[] = dockerContainers.map(
		(container: DockerContainer) => {
			return {
				id: container.id,
				name: container.name,
				image: container.image,
				command: container.command,
				created: container.created,
				started: container.started,
				finished: container.finished,
				state: container.state,
				platform: container.platform,
				driver: container.driver,
				ports: container.ports,
				mounts: container.mounts,
			};
		},
	);

	return dockerContainerList;
});
