/**
 * Shared webpack configuration utilities
 * These can be imported and used in next.config.js or other build processes
 */

const path = require('path');
const webpack = require('webpack');

/**
 * Custom webpack aliases for cleaner imports
 */
const aliases = {
  '@': path.resolve(__dirname, './src'),
  '@components': path.resolve(__dirname, './src/components'),
  '@lib': path.resolve(__dirname, './src/lib'),
  '@utils': path.resolve(__dirname, './src/utils'),
  '@styles': path.resolve(__dirname, './src/styles'),
  '@types': path.resolve(__dirname, './src/types'),
  '@hooks': path.resolve(__dirname, './src/hooks'),
  '@contexts': path.resolve(__dirname, './src/contexts'),
  '@services': path.resolve(__dirname, './src/services'),
  '@config': path.resolve(__dirname, './src/config'),
};

/**
 * Custom webpack plugins
 */
const customPlugins = (env = {}) => [
  // Define global constants
  new webpack.DefinePlugin({
    'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
    'process.env.VERSION': JSON.stringify(require('./package.json').version),
    '__DEV__': env.dev || false,
    '__PROD__': !env.dev || false,
  }),
  
  // Ignore specific modules
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/,
  }),
  
  // Provide global variables
  new webpack.ProvidePlugin({
    React: 'react',
  }),
];

/**
 * Custom optimization configuration
 */
const optimizationConfig = {
  production: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        default: false,
        vendors: false,
        // React and related
        react: {
          test: /[\\\/]node_modules[\\\/](react|react-dom|scheduler|prop-types)[\\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 40,
          enforce: true,
        },
        // UI libraries
        ui: {
          test: /[\\\/]node_modules[\\\/](tailwindcss|@radix-ui|lucide-react|clsx|class-variance-authority)[\\\/]/,
          name: 'ui',
          chunks: 'all',
          priority: 35,
        },
        // Utilities
        utilities: {
          test: /[\\\/]node_modules[\\\/](axios|date-fns|zod|swr)[\\\/]/,
          name: 'utilities',
          chunks: 'all',
          priority: 30,
        },
        // All other vendor code
        vendor: {
          test: /[\\\/]node_modules[\\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 20,
          reuseExistingChunk: true,
        },
        // Common chunks
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
    minimize: true,
    moduleIds: 'deterministic',
    sideEffects: false,
    usedExports: true,
  },
  development: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
};

/**
 * Custom module rules
 */
const customRules = {
  // TypeScript/JavaScript with SWC
  typescript: {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
              decorators: false,
              dynamicImport: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
            target: 'es2017',
          },
        },
      },
    ],
  },
  
  // CSS Modules
  cssModules: {
    test: /\.module\.(css|scss|sass)$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
          importLoaders: 2,
        },
      },
      'postcss-loader',
      'sass-loader',
    ],
  },
  
  // SVG as React components
  svg: {
    test: /\.svg$/,
    issuer: /\.[jt]sx?$/,
    use: ['@svgr/webpack'],
  },
  
  // Images
  images: {
    test: /\.(png|jpg|jpeg|gif|webp|avif|ico|bmp)$/i,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024, // 8kb
      },
    },
    generator: {
      filename: 'static/images/[name].[hash:8][ext]',
    },
  },
  
  // Fonts
  fonts: {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'static/fonts/[name].[hash:8][ext]',
    },
  },
  
  // Raw text files
  raw: {
    test: /\.(txt|md|csv)$/,
    use: 'raw-loader',
  },
  
  // JSON5
  json5: {
    test: /\.json5$/,
    loader: 'json5-loader',
    type: 'javascript/auto',
  },
  
  // Web Workers
  workers: {
    test: /\.worker\.(js|ts)$/,
    use: {
      loader: 'worker-loader',
      options: {
        filename: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    },
  },
};

/**
 * Performance hints configuration
 */
const performanceConfig = {
  production: {
    hints: 'warning',
    maxAssetSize: 512000, // 500 KB
    maxEntrypointSize: 512000, // 500 KB
    assetFilter: (assetFilename) => {
      return !/\.map$/.test(assetFilename);
    },
  },
  development: {
    hints: false,
  },
};

/**
 * Node.js polyfills/fallbacks for browser
 */
const nodeFallbacks = {
  fs: false,
  net: false,
  tls: false,
  crypto: false,
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer/'),
  process: require.resolve('process/browser'),
  path: require.resolve('path-browserify'),
  os: require.resolve('os-browserify/browser'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  assert: require.resolve('assert/'),
  url: require.resolve('url/'),
  util: require.resolve('util/'),
  zlib: require.resolve('browserify-zlib'),
  querystring: require.resolve('querystring-es3'),
  events: require.resolve('events/'),
};

/**
 * Export configurations
 */
module.exports = {
  aliases,
  customPlugins,
  optimizationConfig,
  customRules,
  performanceConfig,
  nodeFallbacks,
  
  // Helper function to merge configs
  mergeWebpackConfig: (config, options = {}) => {
    const { dev = false, isServer = false } = options;
    
    // Apply aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      ...aliases,
    };
    
    // Apply optimization
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        ...optimizationConfig.production,
      };
    }
    
    // Apply performance hints
    config.performance = {
      ...config.performance,
      ...(dev ? performanceConfig.development : performanceConfig.production),
    };
    
    // Apply fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...nodeFallbacks,
      };
    }
    
    return config;
  },
};