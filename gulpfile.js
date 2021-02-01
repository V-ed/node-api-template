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

function scripts(cb) {
	const tsResult = tsProject.src().pipe(tsProject());

	tsResult.js.pipe(gulp.dest(dest));

	cb();
}

function watch(cb) {
	gulp.watch('src/**/*.ts', gulp.series('scripts'));

	cb();
}

function jsonAssets(cb) {
	gulp.src(JSON_FILES).pipe(gulp.dest(dest));

	cb();
}

function buildEnv(cb) {
	gulp.src('./.env', { dot: true }).pipe(gulp.dest(dest));

	cb();
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

function setupEnv(cb) {
	fs.access('.env', (err) => {
		if (err) {
			// If .env doesn't exists, copy .env.example
			gulp.src('./.env.example').pipe(replace('MY_RANDOM_KEY', generateGuid())).pipe(rename('.env')).pipe(gulp.dest('.'));
		}
	});

	fs.access('.env.test', (err) => {
		if (err) {
			// If .env.test doesn't exists, copy .env.example
			gulp
				.src('./.env.example')
				.pipe(replace('MY_RANDOM_KEY', generateGuid()))
				.pipe(replace('PORT=', 'PORT=3005'))
				.pipe(replace('tmp/database.sqlite', ':memory:'))
				.pipe(rename('.env.test'))
				.pipe(gulp.dest('.'));
		}
	});

	cb();
}

function deleteDist(cb) {
	del([dest]);

	cb();
}

function deleteUploads(cb) {
	del(['uploads']);

	cb();
}

function deleteDatabase(cb) {
	del(['tmp/database.sqlite']);

	cb();
}

function deprecateTmp(cb) {
	const time = Date.now();

	const files = [
		'./tmp/**/*', '!./tmp/**/backup', '!./tmp/**/backup/**/*'
	];

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

const build = gulp.parallel(jsonAssets, buildEnv, scripts);

exports.build = build;

exports.cleanbuild = gulp.series(gulp.parallel(deleteDist, deprecateTmp, setupEnv), build);

exports.cleandb = gulp.parallel(deleteDatabase);
