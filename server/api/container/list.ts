import si from "systeminformation";

type containerList = {};

export default defineEventHandler(async () => {
	const container = await si.dockerContainers();
  console.log(container);
  

	const containerList = {};

	return containerList;
});
