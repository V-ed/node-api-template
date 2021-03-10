import { exec as execCallback } from 'child_process';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import ts from 'gulp-typescript';
import util from 'util';
import { pushDb } from './prisma/functions';

const exec = util.promisify(execCallback);

// CONFIGS

const tsProject = ts.createProject('./tsconfig.json');

const tmpFolder = './prisma/tmp';

const configs = {
	buildDest: tsProject.config.compilerOptions?.outDir || './dist',
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

function buildNest() {
	return exec('npx nest build');
}

function buildPackage() {
	return (
		gulp
			.src('./package.json')
			.pipe(replace(configs.buildDest, '.'))
			// .pipe(replace('"type": "commonjs"', '"type": "module"'))
			.pipe(gulp.dest(configs.buildDest))
	);
}

function buildEnv() {
	return gulp.src('./.env.prod', { dot: true }).pipe(rename('.env')).pipe(gulp.dest(configs.buildDest));
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
	return pushDb();
}

// Delete tasks

function deleteDist() {
	return del([configs.buildDest]);
}

// function deleteUploads() {
// 	return del([configs.uploadsFolder]);
// }

function deleteDatabase() {
	return del([configs.dbDevPath]);
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

const build = gulp.series(buildNest, gulp.parallel(gulp.series(setupProdEnv, buildEnv), buildPackage, buildPrisma));

const setupEnvs = gulp.parallel(setupProdEnv, setupDevEnv);

const handleTmp = gulp.series(setupTmpDatabaseFolder, deprecateTmp, deleteTmp);

const init = gulp.parallel(deleteDist, gulp.series(gulp.parallel(setupEnvs, handleTmp), updateDatabaseSchema));

// EXPORTS

const cleanbuild = gulp.series(init, build);

const cleandb = gulp.parallel(deleteDatabase);

export { build, init, cleanbuild, cleandb };
