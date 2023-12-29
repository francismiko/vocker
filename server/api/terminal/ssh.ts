import { readFileSync } from "fs";
import { Client } from "ssh2";

export default defineEventHandler(async () => {
	const conn = new Client();
	conn
		.on("ready", () => {
			console.log("Client :: ready");
			conn.shell((err, stream) => {
				if (err) throw err;
				stream
					.on("close", () => {
						console.log("Stream :: close");
						conn.end();
					})
					.on("data", (data: string) => {
						console.log(`OUTPUT: ${data}`);
					});
				stream.end("ls -l\nexit\n");
			});
		})
		.connect({
			host: "192.168.0.11",
			port: 22,
			username: "francis",
		});

	return { success: true };
});
