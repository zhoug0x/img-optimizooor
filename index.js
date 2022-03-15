import * as path from "path";
import { readdir } from "fs/promises";
import imagemin from "imagemin";
import imageminPngquant from "imagemin-pngquant";
import imageminJpegtran from "imagemin-jpegtran";
import Jimp from "jimp";

// toggle for generating thumbnails
const RUN_RESIZE = false;

const RESIZE_WIDTH = 150; // in pixels
const RESIZE_HEIGHT = Jimp.AUTO;

const Main = async () => {
	try {
		const dirIn = path.join(path.resolve(), "input");
		const dirResized = path.join(path.resolve(), "thumbnails");
		const dirOut = path.join(path.resolve(), "output");

		// optimize the images
		console.log("\noptimizing img(s)...");
		await imagemin([dirIn, "*.{png,jpg,jpeg}"], {
			destination: dirOut,
			plugins: [
				imageminJpegtran(),
				imageminPngquant({
					quality: [0.6, 0.8],
				}),
			],
		});
		console.log("optimization complete!\n\n");

		// resize the images if set
		if (RUN_RESIZE) {
			console.log("\nresizing img(s)...");
			const files = await readdir(dirOut);
			for (const file of files) {
				const image = await Jimp.read(`${dirOut}/${file}`);
				image.resize(RESIZE_WIDTH, RESIZE_HEIGHT);
				await image.writeAsync(`${dirResized}/${file}`);
			}
			console.log("img(s) resized!\n\n");
		}
	} catch (error) {
		console.error(error);
	}
};

Main();
