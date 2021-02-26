const gulp = require('gulp');
const fs = require('fs');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const del = require('del');
const ts = require('gulp-typescript');
const alias = require('gulp-ts-alias').default;
const path = require('path');

const util = require('util');
const exec = util.promisify(require('child_process').exec);
// const { pipedGulpEsbuild } = require('gulp-esbuild');

// CONFIGS

const tsProject = ts.createProject('./tsconfig.json');

const tmpFolder = './prisma/tmp';

const configs = {
	buildDest: tsProject.config.compilerOptions.outDir,
	uploadsFolder: './uploads',
	devPort: 3005,
	dbDevPath: `${tmpFolder}/dev.db`,
	tmpFiles: [`${tmpFolder}/**/*`, `!${tmpFolder}/**/backup`, `!${tmpFolder}/**/backup/**/*`],
};

// UTILS

function generateGuid() {
	const dashPositions = [8, 12, 16, 20];

	return Array.from(Array(32))
		.map((_v, index) => {
			const randomChar = Math.floor(Math.random() * 16)
				.toString(16)
				.toUpperCase();

			return dashPositions.includes(index) ? `-${randomChar}` : randomChar;
		})
		.join('');
}

// TASKS

// Build Tasks

function buildTypescript() {
	return (
		tsProject
			.src()
			// @ts-ignore
			.pipe(alias({ configuration: tsProject.config }))
			// .pipe(replace(/(import .+ from (?:'|")\.{1,2}\/.+)((?:'|"))/g, '$1.js$2'))
			// .pipe(
			// 	pipedGulpEsbuild({
			// 		platform: 'node',
			// 		// bundle: true,
			// 	}),
			// )
			.pipe(gulp.dest(configs.buildDest))
	);
}

function buildPackage() {
	return (
		gulp
			.src('./package.json')
			// .pipe(replace('dist/main.js', 'main.js'))
			// .pipe(replace('"type": "commonjs"', '"type": "module"'))
			.pipe(gulp.dest(configs.buildDest))
	);
}

function buildEnv() {
	return gulp.src('./.env', { dot: true }).pipe(replace('src/', '')).pipe(gulp.dest(configs.buildDest));
}

function buildPrisma() {
	return gulp.src(['./prisma/schema.prisma', './prisma/migrations/**/*'], { base: '.' }).pipe(gulp.dest(configs.buildDest));
}

// Creation Tasks

function setupDevEnv() {
	const devEnvName = '.env';

	if (!fs.existsSync(devEnvName)) {
		const prismaDbPath = configs.dbDevPath.replace('prisma/', '');

		return gulp
			.src('./.env.example')
			.pipe(replace('MY_RANDOM_KEY', generateGuid()))
			.pipe(replace('PORT=', `PORT=${configs.devPort}`))
			.pipe(replace('DATABASE_URL=file:./data.db', `DATABASE_URL=file:${prismaDbPath}`))
			.pipe(rename(devEnvName))
			.pipe(gulp.dest('.'));
	}

	return Promise.resolve();
}

function setupProdEnv() {
	const envName = '.env.prod';

	if (!fs.existsSync(envName)) {
		return gulp
			.src('./.env.example')
			.pipe(replace('MY_RANDOM_KEY', generateGuid()))
			.pipe(replace('NODE_ENV=development', 'NODE_ENV=production'))
			.pipe(rename(envName))
			.pipe(gulp.dest('.'));
	}

	return Promise.resolve();
}

function setupTmpDatabaseFolder() {
	if (!fs.existsSync(tmpFolder)) {
		fs.mkdirSync(tmpFolder);
	}

	return Promise.resolve();
}

function updateDatabaseSchema() {
	const prismaBinary = path.join(__dirname, 'node_modules', '.bin', 'prisma');

	return exec(`${prismaBinary} db push --preview-feature`);
}

// Delete tasks

function deleteDist() {
	return del([configs.buildDest]);
}

function deleteUploads() {
	return del([configs.uploadsFolder]);
}

function deleteDatabase() {
	return del([configs.dbPath]);
}

// Deprecation Tasks

function deprecateTmp() {
	const time = Date.now();

	return gulp
		.src(configs.tmpFiles)
		.pipe(
			rename(function (path) {
				path.dirname += '/backup';
				path.basename += `_${time}`;
			}),
		)
		.pipe(gulp.dest(tmpFolder));
}

function deleteTmp() {
	return del(configs.tmpFiles);
}

// COMBINES

const build = gulp.parallel(buildEnv, buildPackage, buildTypescript, buildPrisma);

const setupEnvs = gulp.parallel(setupProdEnv, setupDevEnv);

const handleTmp = gulp.series(setupTmpDatabaseFolder, deprecateTmp, deleteTmp);

const init = gulp.parallel(deleteDist, gulp.series(gulp.parallel(setupEnvs, handleTmp), updateDatabaseSchema));

// EXPORTS

exports.build = build;

exports.init = init;

exports.cleanbuild = gulp.series(init, build);

exports.cleandb = gulp.parallel(deleteDatabase);
