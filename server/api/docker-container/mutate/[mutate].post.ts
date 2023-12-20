import Docker from "dockerode";

export default defineEventHandler(async (event) => {
	const { req } = event.node;
	const mutation = getRouterParam(event, "mutate");
	console.log(mutation);

	const docker = new Docker();
});
