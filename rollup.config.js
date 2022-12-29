import autoExternal from 'rollup-plugin-auto-external';
import includePaths from 'rollup-plugin-includepaths';
import babel from '@rollup/plugin-babel';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import {terser} from 'rollup-plugin-terser'; // to minify generated es bundle (very popular, have strong opinion on named export https://www.npmjs.com/package/rollup-plugin-terser#why-named-export)
import sizes from 'rollup-plugin-sizes';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';

export default {
    input: 'src/index.js',
    plugins: [
        autoExternal(),
        includePaths({
            include: {},
            paths: ['src'],
            external: [],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        }),
        url({ limit: 50000 }), //  If a file exceeds this limit, it will be copied to the destination folder and the hashed filename will be provided instead. If limit is set to 0 all files will be copied.
        postcss({
            extract: true,
            // Minimization config for vui.css
            // minimize: {
            //     'preset': 'advanced',
            // },
            use: [
                ['sass', {
                    includePaths: [
                        './src',
                    ],
                }],
            ],
            plugins: [
                require('postcss-import')(),
                require('postcss-advanced-variables')(),
                require('postcss-map-get')(),
                require('postcss-nested')(),
                require('postcss-sort-media-queries')(),
                require('autoprefixer')(),
            ],
        }),
        json(),
        esbuild({
            // All options are optional
            include: 'src', // default, inferred from `loaders` option
            exclude: /node_modules/, // default
            sourceMap: false, // default
            minify: process.env.NODE_ENV === 'production',
            target: 'esnext', // default, or 'es20XX', 'esnext'
            jsx: 'transform', // default, or 'preserve'
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment',
            tsconfig: 'tsconfig.json', // default
            loaders: {
                '.json': 'json',
                '.js': 'jsx',
            },
        }),
        babel({
            exclude: 'node_modules/**',
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            compact: false,
            presets: [
                ['@babel/preset-react', {
                    runtime: 'automatic',
                }],
            ],
        }),
        nodeResolve({ browser: true }),
        commonjs(),
        // terser()
        
        sizes(/* { details: true } */),
    ],
    output: [
        { file: pkg.main, format: 'cjs' },
    ],
};
