const path = require('path');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const prismaBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');

async function pushDb() {
	return exec(`${prismaBinary} db push --preview-feature`);
}

async function seedDb() {
	return exec(`${prismaBinary} db seed --preview-feature`);
}

module.exports = {
	pushDb,
	seedDb,
};
