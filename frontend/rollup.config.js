// This file is used by Rollup to bundle the code into a single JavaScript file.
export default {
    input: 'src/index.js',
    output: {
        dir: 'dist',
        format: 'es',
        manualChunks: {
            vendor: ['lodash', 'react'], // Group lodash and react into a vendor chunk
            utils: ['src/utils/functionA.js', 'src/utils/functionB.js'], // Group specific utility functions
        },
    },
};
