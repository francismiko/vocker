import si from "systeminformation";

export type DockerImage = {
	id?: string;
	name?: string;
	tag?: string;
	repoTags?: string;
	created?: number;
	size?: number;
};

export default defineEventHandler(async () => {
	const dockerImages = await si.dockerImages();
	console.log(dockerImages);

	const dockerImageList: DockerImage[] = dockerImages.map(
		(image: DockerImage) => {
			return {
				id: image.id,
				name: image.repoTags?.[0].split(":")[0],
				tag: image.repoTags?.[0].split(":")[1],
				repoTags: image.repoTags,
				created: image.created,
				size: image.size,
			};
		},
	);

	return dockerImageList;
});
