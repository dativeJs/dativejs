import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import { version, author, repository, license } from './package.json'
import { terser } from 'rollup-plugin-terser';


const isProd = process.env.NODE_ENV === 'production';

const getFilePath = (type = '') => `dist/dative${type === '' ? '' : '.'}${type}.js`
const getFilePathMin = (type = '') => `dist/dative${type === '' ? '' : '.'}${type}.min.js`


var banner = `/**
  * dativejs v${version}
  * (c) 2021-${new Date().getFullYear()} ${author}
  * ${repository.url.replace(/(git\+|\.git)/g, '')}
  * Released under the ${license} License.
*/`

const output = options => ({
    banner,
    name: 'Dative',
    sourcemap: true,
    exports: 'named',
    ...options
})
const outputmin = options => ({
    name: 'Dative',
    sourcemap: true,
    exports: 'named',
    plugins: [terser()],
    ...options
})

var minfile = ['system', 'esm', 'cjs', 'umd']

const config = {
    input: './src/index.js',
    output: [output({
        file: getFilePath(),
        format: 'iife'
    }), outputmin({
        file: getFilePathMin(),
        format: 'iife'
    }), output({
        file: getFilePath('system'),
        format: 'system'
    }), outputmin({
        file: getFilePathMin('system'),
        format: 'system'
    }), output({
        file: getFilePath('esm'),
        format: 'es'
    }), outputmin({
        file: getFilePathMin('esm'),
        format: 'es'
    }), output({
        file: getFilePath('cjs'),
        format: 'cjs'
    }), outputmin({
        file: getFilePathMin('cjs'),
        format: 'cjs'
    }), output({
        file: getFilePath('umd'),
        format: 'umd'
    }), outputmin({
        file: getFilePathMin('umd'),
        format: 'umd'
    })],
    plugins: [
        resolve({
            browser: true
        }),
        commonjs()
    ]
}

// if (isProd) {
//     config.output = config.output.map(output => {
//         const format = `.${output.format}`
//         output.file = `dist/dative${format}.min.js`;
//         delete output.banner;
//         return output;
//     })
//     config.plugins.push(terser())
// }


export default config;

