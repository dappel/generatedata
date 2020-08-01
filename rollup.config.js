/**
 * This generates es5 files for single entry-point TS files. It's used for the webworker files: core, core utils, plugins.
 *
 * TODO at the moment we're actually loading the utils code twice. There's no reason for this - the core script COULD load
 * this generated file & use the methods from the window object; as long as the typings were provided that'd cut down on
 * build size. But honestly it's <20KB and there are bigger fish to fry.
 */
import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";

// example usage: `npm rollup -c --config-src=src/utils/coreUtils.ts --config-target=dist/workers/coreUtils.js`
export default (cmdLineArgs) => {
	const { 'config-src': src, 'config-target': target } = cmdLineArgs;

	if (!src || !target) {
		console.error("\n*** Missing command line args. See file for usage. ***\n");
		return;
	}

	return {
		input: src,
		output: {
			file: target,
			format: 'es'
		},
		plugins: [
			typescript({
				tsconfigOverride: {
					compilerOptions: {
						target: "es5"
					}
				}
			}),
			uglify()
		]
	}
};

