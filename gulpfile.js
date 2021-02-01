/* eslint-disable */

const gulp = require('gulp');
const ts = require('gulp-typescript');
const fs = require('fs');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const del = require('del');

// CONFIGS

const dest = './dist';

const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// TASKS

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

function scripts() {
	const tsResult = tsProject.src().pipe(tsProject());

	return tsResult.js.pipe(gulp.dest(dest));
}

function watch(cb) {
	gulp.watch('src/**/*.ts', gulp.series(scripts));

	cb();
}

function jsonAssets() {
	return gulp.src(JSON_FILES).pipe(gulp.dest(dest));
}

function buildEnv() {
	return gulp.src('./.env', { dot: true }).pipe(gulp.dest(dest));
}

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

function setupMainEnv(cb) {
	if (!fs.existsSync('.env')) {
		return gulp.src('./.env.example').pipe(replace('MY_RANDOM_KEY', generateGuid())).pipe(rename('.env')).pipe(gulp.dest('.'));
	}
	
	cb();
}

async function setupTestEnv(cb) {
	if (!fs.existsSync('.env.test')) {
		return gulp
			.src('./.env.example')
			.pipe(replace('MY_RANDOM_KEY', generateGuid()))
			.pipe(replace('PORT=', 'PORT=3005'))
			.pipe(replace('tmp/database.sqlite', ':memory:'))
			.pipe(rename('.env.test'))
			.pipe(gulp.dest('.'));
	}
	
	cb();
}

const setupEnvs = gulp.parallel(setupMainEnv, setupTestEnv);

function deleteDist() {
	return del([dest]);
}

function deleteUploads() {
	return del(['uploads']);
}

function deleteDatabase() {
	return del(['tmp/database.sqlite']);
}

function deprecateTmp(cb) {
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

	del(files);

	cb();
}

const build = gulp.series(gulp.parallel(jsonAssets, buildEnv, scripts));

exports.build = build;

exports.cleanbuild = gulp.series(gulp.parallel(deleteDist, deprecateTmp, setupEnvs), build);

exports.cleandb = gulp.parallel(deleteDatabase);
