const gulp = require('gulp');
const fs = require('fs');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const del = require('del');
const ts = require('gulp-typescript');
const alias = require('gulp-ts-alias').default;
const gulpEsbuild = require('gulp-esbuild');

// CONFIGS

const tsProject = ts.createProject('./tsconfig.json');

const configs = {
	buildDest: tsProject.config.compilerOptions.outDir,
	uploadsFolder: './uploads',
	devPort: 3005,
};

// UTILS

function generateGuid() {
	var result, i, j;

	result = '';
	for (j = 0; j < 32; j++) {
		if (j == 8 || j == 12 || j == 16 || j == 20) result = result + '-';
		i = Math.floor(Math.random() * 16)
			.toString(16)
			.toUpperCase();
		result = result + i;
	}
	return result;
}

// TASKS

// Build Tasks

function esbuild() {
	return (
		tsProject
			.src()
			// @ts-ignore
			// .pipe(alias({ configuration: tsProject.config }))
			.pipe(
				gulpEsbuild({
					platform: 'node',
					// bundle: true,
				}),
			)
			.pipe(gulp.dest(configs.buildDest))
	);
}

function buildPackage() {
	return gulp.src('./package.json').pipe(replace('dist/main.js', 'main.js')).pipe(gulp.dest(configs.buildDest));
}

function buildEnv() {
	return gulp.src('./.env', { dot: true }).pipe(replace('src/', '')).pipe(replace('*.ts', '*.js')).pipe(gulp.dest(configs.buildDest));
}

// Creation Tasks

function setupMainEnv() {
	if (!fs.existsSync('.env')) {
		return gulp
			.src('./.env.example')
			.pipe(replace('MY_RANDOM_KEY', generateGuid()))
			.pipe(replace('NODE_ENV=development', 'NODE_ENV=production'))
			.pipe(rename('.env'))
			.pipe(gulp.dest('.'));
	}

	return Promise.resolve();
}

function setupTestEnv(cb) {
	if (!fs.existsSync('.env.test')) {
		return gulp
			.src('./.env.example')
			.pipe(replace('MY_RANDOM_KEY', generateGuid()))
			.pipe(replace('PORT=', `PORT=${configs.devPort}`))
			.pipe(replace('tmp/database.sqlite', ':memory:'))
			.pipe(rename('.env.test'))
			.pipe(gulp.dest('.'));
	}

	return Promise.resolve();
}

// Delete tasks

function deleteDist() {
	return del([configs.buildDest]);
}

function deleteUploads() {
	return del([configs.uploadsFolder]);
}

function deleteDatabase() {
	return del(['tmp/database.sqlite']);
}

// Deprecation Tasks

function deprecateTmp() {
	const time = Date.now();

	const files = ['./tmp/**/*', '!./tmp/**/backup', '!./tmp/**/backup/**/*'];

	gulp
		.src(files)
		.pipe(
			rename(function (path) {
				path.dirname += '/backup';
				path.basename += `_${time}`;
			}),
		)
		.pipe(gulp.dest('./tmp'));

	return del(files);
}

// COMBINES

const setupEnvs = gulp.parallel(setupMainEnv, setupTestEnv);

const build = gulp.parallel(buildEnv, buildPackage, esbuild);

// EXPORTS

exports.build = build;

exports.cleanbuild = gulp.series(gulp.parallel(deleteDist, deprecateTmp, setupEnvs), build);

exports.cleandb = gulp.parallel(deleteDatabase);
