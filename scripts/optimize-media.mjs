import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const uploadsDir = path.resolve("public/uploads");
const cachePath = path.resolve(".astro/media-optimization-cache.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const maxWidth = 1600;
const jpegQuality = 82;
const pngCompressionLevel = 9;
const webpQuality = 82;

async function listImages(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(dir, entry.name);

			if (entry.isDirectory()) {
				return listImages(fullPath);
			}

			if (!entry.isFile() || !imageExtensions.has(path.extname(entry.name).toLowerCase())) {
				return [];
			}

			return [fullPath];
		}),
	);

	return files.flat();
}

async function loadCache() {
	try {
		return JSON.parse(await readFile(cachePath, "utf8"));
	} catch (error) {
		if (error?.code === "ENOENT") {
			return {};
		}

		throw error;
	}
}

async function saveCache(cache) {
	await mkdir(path.dirname(cachePath), { recursive: true });
	await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
}

async function optimizeImage(filePath, cache) {
	if (filePath.includes(`${path.sep}uploads${path.sep}favicon${path.sep}`)) {
		return;
	}

	const before = await stat(filePath);
	const relativePath = path.relative(process.cwd(), filePath);
	const cacheEntry = cache[relativePath];

	if (cacheEntry?.size === before.size && cacheEntry?.mtimeMs === before.mtimeMs) {
		console.log(`skipped ${relativePath} unchanged`);
		return;
	}

	const image = sharp(filePath, { failOn: "none" }).rotate();
	const metadata = await image.metadata();
	const shouldResize = metadata.width && metadata.width > maxWidth;
	const pipeline = shouldResize ? image.resize({ width: maxWidth, withoutEnlargement: true }) : image;
	const extension = path.extname(filePath).toLowerCase();
	const tempPath = `${filePath}.optimized`;

	if (extension === ".jpg" || extension === ".jpeg") {
		await pipeline.jpeg({ quality: jpegQuality, mozjpeg: true }).toFile(tempPath);
	} else if (extension === ".png") {
		await pipeline.png({ compressionLevel: pngCompressionLevel, palette: true }).toFile(tempPath);
	} else if (extension === ".webp") {
		await pipeline.webp({ quality: webpQuality }).toFile(tempPath);
	}

	const after = await stat(tempPath);

	if (after.size < before.size) {
		await rename(tempPath, filePath);
		console.log(`optimized ${relativePath} ${before.size} -> ${after.size} bytes`);
	} else {
		console.log(`kept ${relativePath} already optimized`);
		await rm(tempPath, { force: true });
	}

	const current = await stat(filePath);
	cache[relativePath] = {
		size: current.size,
		mtimeMs: current.mtimeMs,
	};
}

try {
	const images = await listImages(uploadsDir);
	const cache = await loadCache();

	if (images.length === 0) {
		console.log("No uploaded media found to optimize.");
	} else {
		await Promise.all(images.map((image) => optimizeImage(image, cache)));
		await saveCache(cache);
	}
} catch (error) {
	if (error?.code === "ENOENT") {
		console.log("No public/uploads directory found; skipping media optimization.");
	} else {
		throw error;
	}
}
