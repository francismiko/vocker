import Docker from "dockerode";

export type DockerContainerMutations = "start" | "pause" | "unpause" | "stop";

export default defineEventHandler(async (event) => {
	const { containerId } = await readBody(event);
	const mutation = getRouterParam(event, "mutate");

	if (!mutation) {
		throw new Error("Missing mutation parameter");
	}
	if (!containerId) {
		throw new Error("Missing containerId parameter");
	}
	if (
		mutation !== "start" &&
		mutation !== "pause" &&
		mutation !== "unpause" &&
		mutation !== "stop"
	) {
		throw new Error("Invalid mutation parameter");
	}

	const docker = new Docker();
	const container = docker.getContainer(containerId);

	const mutationHandlers: Record<
		DockerContainerMutations,
		() => Promise<void>
	> = {
		start: async () => {
			await container.start();
		},
		unpause: async () => {
			await container.unpause();
		},
		pause: async () => {
			await container.pause();
		},
		stop: async () => {
			await container.stop();
		},
	};

	await mutationHandlers[mutation]();

	return { success: true };
});
