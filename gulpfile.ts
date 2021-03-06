import { exec as execCallback } from 'child_process';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import ts from 'gulp-typescript';
import util from 'util';
import { generate as generatePrisma, pushDb, seedDb } from './prisma/functions';

const exec = util.promisify(execCallback);

// CONFIGS

const tsProject = ts.createProject('./tsconfig.json');

export const configs = {
	buildDest: (tsProject.config.compilerOptions?.outDir as string) || './dist',
	uploadsFolder: './uploads',
	devPort: 3005,
	tmpFolder: '.tmp',
	get tmpFullFolderPath() {
		return `./prisma/${this.tmpFolder}`;
	},
	get dbDevPath() {
		return `${this.tmpFullFolderPath}/dev.db`;
	},
	get tmpFiles() {
		return [`${this.tmpFullFolderPath}/**/*`, `!${this.tmpFullFolderPath}/**/backup`, `!${this.tmpFullFolderPath}/**/backup/**/*`];
	},
	get prismaGeneratedFolder() {
		return `${this.tmpFullFolderPath}/@generated`;
	},
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
	if (!fs.existsSync(configs.tmpFolder)) {
		fs.mkdirSync(configs.tmpFolder);
	}

	return Promise.resolve();
}

function generatePrismaHelpers() {
	return generatePrisma();
}

function updateDatabaseSchema() {
	return pushDb({ skipGenerators: true });
}

function seedDatabase() {
	return seedDb();
}

// Delete tasks

function deleteDist() {
	return del(configs.buildDest);
}

// function deleteUploads() {
// 	return del(configs.uploadsFolder);
// }

function deleteDatabase() {
	return del(configs.dbDevPath);
}

function deleteTmp() {
	return del(configs.tmpFiles);
}

function deletePrismaGenerated() {
	return del(configs.prismaGeneratedFolder);
}

// Deprecation Tasks

function deprecateFiles(files: string | string[], dest: string) {
	const time = Date.now();

	return gulp
		.src(files, { allowEmpty: true })
		.pipe(
			rename((path) => {
				path.dirname += '/backup';
				path.basename += `_${time}`;
			}),
		)
		.pipe(gulp.dest(dest));
}

function deprecateTmp() {
	return deprecateFiles(configs.tmpFiles, configs.tmpFullFolderPath);
}

function deprecateDb() {
	return deprecateFiles(configs.dbDevPath, configs.tmpFullFolderPath);
}

// ------------------------
// |     Gulp Commands    |
// ------------------------

// COMBINES

export const build = gulp.series(deleteDist, buildNest, gulp.parallel(gulp.series(setupProdEnv, buildEnv), buildPackage, buildPrisma));

export const setupEnvs = gulp.parallel(setupProdEnv, setupDevEnv);

export const handleTmp = gulp.series(setupTmpDatabaseFolder, deprecateTmp, deleteTmp);

export const setupPrisma = gulp.series(deletePrismaGenerated, generatePrismaHelpers, updateDatabaseSchema);

export const init = gulp.parallel(deleteDist, gulp.series(gulp.parallel(setupEnvs, handleTmp), setupPrisma));

export const cleanBuild = gulp.series(init, build);

export const cleanDb = gulp.series(setupEnvs, deprecateDb, deleteDatabase, updateDatabaseSchema);

export const cleanSeed = gulp.series(cleanDb, seedDatabase);

// Useful commands

export { deleteDist, deleteDatabase };
