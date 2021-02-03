const gulp = require('gulp');
const fs = require('fs');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const del = require('del');
const gulpEsbuild = require('gulp-esbuild');

// CONFIGS

const buildDest = './dist';

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
	return gulp
		.src('./src/index.ts')
		.pipe(
			gulpEsbuild({
				platform: 'node',
				bundle: true,
				// loader: {
				// 	'.tsx': 'tsx',
				// },
			}),
		)
		.pipe(gulp.dest(buildDest));
}

function buildPackage() {
	return gulp.src('./package.json').pipe(replace('dist/index.js', 'index.js')).pipe(gulp.dest(buildDest));
}

function buildEnv() {
	return gulp.src('./.env', { dot: true }).pipe(gulp.dest(buildDest));
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
			.pipe(replace('PORT=', 'PORT=3005'))
			.pipe(replace('tmp/database.sqlite', ':memory:'))
			.pipe(rename('.env.test'))
			.pipe(gulp.dest('.'));
	}
	
	return Promise.resolve();
}

// Delete tasks

function deleteDist() {
	return del([buildDest]);
}

function deleteUploads() {
	return del(['uploads']);
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
