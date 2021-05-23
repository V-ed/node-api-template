import { exec as execCallback } from 'child_process';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import ts from 'gulp-typescript';
import util from 'util';
import { generate as generatePrisma, pushDb } from './prisma/functions';

const exec = util.promisify(execCallback);

// CONFIGS

const tsProject = ts.createProject('./tsconfig.json');

const tmpFolder = './prisma/tmp';

const configs = {
	buildDest: (tsProject.config.compilerOptions?.outDir as string) || './dist',
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

function generatePrismaHelpers() {
	return generatePrisma();
}

function updateDatabaseSchema() {
	return pushDb();
}

// Delete tasks

function deleteDist() {
	return del(configs.buildDest);
}

// function deleteUploads() {
// 	return del([configs.uploadsFolder]);
// }

function deleteDatabase() {
	return del(configs.dbDevPath);
}

// Deprecation Tasks

function deprecateFiles(files: string | string[], dest: string) {
	const time = Date.now();

	return gulp
		.src(files)
		.pipe(
			rename((path) => {
				path.dirname += '/backup';
				path.basename += `_${time}`;
			}),
		)
		.pipe(gulp.dest(dest));
}

function deprecateTmp() {
	return deprecateFiles(configs.tmpFiles, tmpFolder);
}

function deleteTmp() {
	return del(configs.tmpFiles);
}

function deprecateDb() {
	return deprecateFiles(configs.dbDevPath, tmpFolder);
}

// COMBINES

const build = gulp.series(buildNest, gulp.parallel(gulp.series(setupProdEnv, buildEnv), buildPackage, buildPrisma));

const setupEnvs = gulp.parallel(setupProdEnv, setupDevEnv);

const handleTmp = gulp.series(setupTmpDatabaseFolder, deprecateTmp, deleteTmp);

const setupPrisma = gulp.series(generatePrismaHelpers, updateDatabaseSchema);

const init = gulp.parallel(deleteDist, gulp.series(gulp.parallel(setupEnvs, handleTmp), setupPrisma));

// EXPORTS

export const cleanbuild = gulp.series(init, build);

export const cleandb = gulp.parallel(deleteDatabase);

export const clearDb = gulp.series(setupEnvs, deprecateDb, updateDatabaseSchema);

export { build, init };
