import Docker from "dockerode";

export default defineEventHandler(async (event) => {
	const { containerId } = await readBody(event);
	const mutation = getRouterParam(event, "mutate");

	const docker = new Docker();
	const container = docker.getContainer(containerId);

	if (mutation === "start") {
		await container.start();
		return { success: true };
	}
	if (mutation === "stop") {
		await container.stop();
		return { success: true };
	}
});
