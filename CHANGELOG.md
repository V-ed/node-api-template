# Changelog

### [0.0.1](https://www.github.com/V-ed/node-api-template/compare/v0.0.0...v0.0.1) (2022-01-28)


### Bug Fixes

* broken import in .graphqlrc.ts file ([76ab377](https://www.github.com/V-ed/node-api-template/commit/76ab3777df6c78c002621d49ab6040922cf21582))
* gulp does not use proper generated folder path ([8d20e57](https://www.github.com/V-ed/node-api-template/commit/8d20e57f502b071b3db5926661e263a929b5797a))
* node engine version set to ^16 instead of >= 16 ([ca4e857](https://www.github.com/V-ed/node-api-template/commit/ca4e857de8fdb5a64b7e4333fc216d62fabbbab3))
* reflect metadata could not work on aliased imports ([14ace1d](https://www.github.com/V-ed/node-api-template/commit/14ace1d3e776ab3b1ae9e683e63f9782ece4750c))


### Refactor

* **ci:** remove now useless pre/postversion scripts ([774f096](https://www.github.com/V-ed/node-api-template/commit/774f09615e1081aa88f3c4cd875891e3187fa841))
* **db:** simplify pushDb string building logic ([6e9d1a4](https://www.github.com/V-ed/node-api-template/commit/6e9d1a4f097e6283b879b7f4d9a9eb312b4e81c2))
* **Prisma Functions:** streamline pushDb logic ([9979509](https://www.github.com/V-ed/node-api-template/commit/9979509982075b8f3742ea125b285933774bebb7))
* **Prisma Seed:** tweak cli output to use pretty table ([8e208c9](https://www.github.com/V-ed/node-api-template/commit/8e208c9723551e5abc8673713c4b5378e4a75c40))
* **tests:** removes now useless type casting ([399edef](https://www.github.com/V-ed/node-api-template/commit/399edef8d6f25a13577c7932292ef996b23d1420))


### Continuous Integration

* bump node version and remove unused env var ([69ba595](https://www.github.com/V-ed/node-api-template/commit/69ba595ebcab0209acdce372a7b9a40754e7c21d))
* move release job into its own workflow ([ae189e0](https://www.github.com/V-ed/node-api-template/commit/ae189e07304e7e77ee3ee80ab5deeba18ce10075))
* **release:** hide dependencies section ([4506114](https://www.github.com/V-ed/node-api-template/commit/45061140a8353b5499f13c94df0b8358079cb3cb))
* remove "Checks" from workflow names ([5f1e52c](https://www.github.com/V-ed/node-api-template/commit/5f1e52cec7e52edbfdfb091f6d55038037a7d836))
* remove test job as it is already done by the coverage job ([d6650d5](https://www.github.com/V-ed/node-api-template/commit/d6650d52eab98673f445527ea8f549dc4d6fa452))


### Miscellaneous

* add CODEOWNERS file ([1d3e2c3](https://www.github.com/V-ed/node-api-template/commit/1d3e2c3f9dae06f27b81503444a7c6b7854d24bc))
* add db args support in .env.example ([2c938b1](https://www.github.com/V-ed/node-api-template/commit/2c938b1aaff3a2ff8ec58f5d8e8616223b174cc9))
* add deps to release categories ([0cc818a](https://www.github.com/V-ed/node-api-template/commit/0cc818ab9c323f9014c0006c716b0b85d547ca6b))
* convert project to node 16 / npm 7 ([6504cf0](https://www.github.com/V-ed/node-api-template/commit/6504cf0c950665769e5a8280c013200276a10635))
* **deps:** lock file maintenance ([0ebd7fd](https://www.github.com/V-ed/node-api-template/commit/0ebd7fdb4f2c2f9909f486cea8c811ce8784c64e))
* **deps:** lock file maintenance ([3ae3aab](https://www.github.com/V-ed/node-api-template/commit/3ae3aab00a8172d2c784e74efdce1937f69f645a))
* **eslint:** add 24 to accepted magic number and ignore enums ([19e8d40](https://www.github.com/V-ed/node-api-template/commit/19e8d4044dcacf14a28f04b993b86d9772e6583f))
* move common files such as config and prisma to own folder ([f3a65c1](https://www.github.com/V-ed/node-api-template/commit/f3a65c1221b3fcb209d621fff66051934c37412c))
* move config files into their own folder ([9b9d7b3](https://www.github.com/V-ed/node-api-template/commit/9b9d7b3c607c28db3d35b66b6b57a79b2a195e90))
* move graphql module to common folder ([d4cb9f2](https://www.github.com/V-ed/node-api-template/commit/d4cb9f249c0ee32b469b2a0df350ffab2c83a8e3))
* remove .npmrc ([6b9e8a0](https://www.github.com/V-ed/node-api-template/commit/6b9e8a0aaac726f4b5c8da4c836b7ade944772fa))
* rename generated folder to use underscore ([9948d92](https://www.github.com/V-ed/node-api-template/commit/9948d926009e7474b2707e0c048651e859fcf1df))
* **Renovate:** move to shared config ([43f431e](https://www.github.com/V-ed/node-api-template/commit/43f431e597d87f1d64fe3a5e1a3418efe1ccc105))
* set engines versions to easier visual queues ([e1e0e9d](https://www.github.com/V-ed/node-api-template/commit/e1e0e9d70616f8db9548581a0cb2e1365f6e9c4c))
* set renovate commit message prefix to use semantic commit ([27f473a](https://www.github.com/V-ed/node-api-template/commit/27f473aaa5399f744ab42169c68c1ac458eb0856))
* tweak renovate to properly use semantic commits ([88b12ad](https://www.github.com/V-ed/node-api-template/commit/88b12ade13f278d6de2412553e55e55ebb000bda))
