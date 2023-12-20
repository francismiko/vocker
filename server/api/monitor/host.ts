import numeral from "numeral";
import si from "systeminformation";

export type HardwareInfo = {
	manufacturer?: string;
	model?: string;
	memMax?: string;
	brand?: string;
	vendor?: string;
	speed?: string;
	speedMin?: string;
	speedMax?: string;
	cores?: number;
	processors?: number;
	gpuModel?: string;
	diskSize?: string;
	diskType?: string;
	diskVendor?: string;
};

export type SoftwareInfo = {
	platform?: string;
	distro?: string;
	release?: string;
	kernel?: string;
	arch?: string;
	systemOpenssl?: string;
	docker?: string;
	node?: string;
	gcc?: string;
	python3?: string;
	java?: string;
	virtualbox?: string;
};

export type NetworkInfo = {
	iface?: string;
	ip4?: string;
	ip4subnet?: string;
	ip6?: string;
	ip6subnet?: string;
	mac?: string;
	internal?: string;
	virtual?: string;
	type?: string;
	speed?: string;
	dhcp?: string;
};

export type HostInfo = {
	hardwareInfo: HardwareInfo;
	softwareInfo: SoftwareInfo;
	networkInfo: NetworkInfo;
};

export default defineEventHandler(async () => {
	const system = await si.system();
	const baseboard = await si.baseboard();
	const cpu = await si.cpu();
	const gpu = await si.graphics();
	const osInfo = await si.osInfo();
	const versions = await si.versions();
	const disk = await si.diskLayout();
	const network = (await si.networkInterfaces(
		"default",
	)) as si.Systeminformation.NetworkInterfacesData;

	const hostInfo: HostInfo = {
		hardwareInfo: {
			manufacturer: system.manufacturer,
			model: system.model,
			memMax: `${numeral(baseboard.memMax).format("0b")}`,
			brand: cpu.brand,
			vendor: cpu.vendor,
			speed: `${cpu.speed} GHz`,
			speedMin: `${cpu.speedMin} GHz`,
			speedMax: `${cpu.speedMax} GHz`,
			cores: cpu.cores,
			processors: cpu.processors,
			gpuModel: gpu.controllers[0].model,
			diskSize: `${numeral(disk[0].size).format("0.00 b")}`,
			diskType: disk[0].type,
			diskVendor: disk[0].vendor,
		},
		softwareInfo: {
			platform: osInfo.platform,
			distro: osInfo.distro,
			release: osInfo.release,
			kernel: osInfo.kernel,
			arch: osInfo.arch,
			systemOpenssl: versions.systemOpenssl,
			docker: versions.docker,
			node: versions.node,
			gcc: versions.gcc,
			python3: versions.python3,
			java: versions.java,
			virtualbox: versions.virtualbox,
		},
		networkInfo: {
			iface: network.iface,
			ip4: network.ip4,
			ip4subnet: network.ip4subnet,
			ip6: network.ip6,
			ip6subnet: network.ip6subnet,
			mac: network.mac,
			internal: network.internal ? "已开启" : "未开启",
			virtual: network.virtual ? "已开启" : "未开启",
			type: network.type,
			speed: `${network.speed} Mbit / s`,
			dhcp: network.dhcp ? "已开启" : "未开启",
		},
	};

	return hostInfo;
});
