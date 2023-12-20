import si from "systeminformation";

export type DockerImage = {
	id?: string;
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
				repoTags: image.repoTags,
				created: image.created,
				size: image.size,
			};
		},
	);

	return dockerImageList;
});
