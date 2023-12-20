import Docker from "dockerode";

export default defineEventHandler(async (event) => {
	const { req } = event.node;
	console.log(req);

	const docker = new Docker();
});
