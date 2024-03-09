//import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { resolve } from 'url';
import * as path from 'path';

// === variables 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);     

export default {
      entry: './src/resource/js/checkImportFile.js',
      mode: 'development',
      output: {
        filename: 'reloadImport.js',
        path: path.resolve(__dirname, '../src/public/js')
      },
      watch: true,
      resolve: {
        fallback: {
          util: 'util',
          path: 'path-browserify',
          constants: 'constants-browserify',
          stream: 'stream-browserify',
          fs: ['fs-extra'],// Hoặc có thể đặt false nếu bạn không muốn sử dụng polyfill cho 'fs',
          querystring: 'querystring-es3',
          net: 'node-libs-browser/mock/net',
          crypto: 'crypto-browserify',
          zlib: 'browserify-zlib',
          http: 'stream-http',
          async_hooks: 'async_hooks',
        }
      },

};

