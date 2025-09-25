/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Custom Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    
    // Add custom aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
      '@components': require('path').resolve(__dirname, './src/components'),
      '@lib': require('path').resolve(__dirname, './src/lib'),
      '@utils': require('path').resolve(__dirname, './src/utils'),
      '@styles': require('path').resolve(__dirname, './src/styles'),
      '@types': require('path').resolve(__dirname, './src/types'),
    };
    
    // Add custom plugins
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId),
      })
    );
    
    // Add custom loaders for specific file types
    config.module.rules.push(
      // SVG as React components
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      // Raw loader for certain text files
      {
        test: /\.(txt|md)$/,
        use: 'raw-loader',
      },
      // Custom CSS handling (if needed beyond Next.js defaults)
      {
        test: /\.module\.(scss|sass)$/,
        use: [
          defaultLoaders.babel,
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 3,
              modules: {
                localIdentName: dev
                  ? '[path][name]__[local]--[hash:base64:5]'
                  : '[hash:base64:8]',
              },
            },
          },
        ],
      }
    );
    
    // Optimize bundle size
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common components chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate large libraries
            react: {
              test: /[\\\/]node_modules[\\\/](react|react-dom|scheduler)[\\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 30,
            },
            tailwind: {
              test: /[\\\/]node_modules[\\\/](tailwindcss)[\\\/]/,
              name: 'tailwind',
              chunks: 'all',
              priority: 25,
            },
          },
        },
        minimize: true,
      };
    }
    
    // Add fallbacks for Node.js modules (useful for client-side usage)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: false,
        process: false,
      };
    }
    
    // Custom webpack plugins for development
    if (dev) {
      // Add source map support
      config.devtool = 'cheap-module-source-map';
      
      // Add bundle analyzer in development (optional)
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: './analyze.html',
          })
        );
      }
    }
    
    // Handle Web Workers
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: { 
        loader: 'worker-loader',
        options: {
          filename: 'static/[hash].worker.js',
          publicPath: '/_next/',
        }
      },
    });
    
    // Ignore certain problematic modules
    config.externals = [
      ...config.externals || [],
      // Add any modules you want to exclude from the bundle
    ];
    
    // Custom performance hints
    config.performance = {
      ...config.performance,
      hints: dev ? false : 'warning',
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    };
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
    COLLEGE_SCORECARD_API_KEY: process.env.COLLEGE_SCORECARD_API_KEY,
    CAREERONESTOP_API_KEY: process.env.CAREERONESTOP_API_KEY,
    CAREERONESTOP_USER_ID: process.env.CAREERONESTOP_USER_ID,
    OLLAMA_API_URL: process.env.OLLAMA_API_URL || 'http://localhost:11434',
    BUILD_TIME: new Date().toISOString(),
  },
  
  // Custom headers for API security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      // Add any redirects here
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },
  
  // Rewrites for API proxying
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        // Add API proxy rewrites if needed
        // {
        //   source: '/external-api/:path*',
        //   destination: 'https://external-api.com/:path*',
        // },
      ],
    };
  },
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      // Add any external image domains you'll be using
      'scholarship-images.example.com',
      'college-logos.example.com',
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Experimental features
  experimental: {
    // Enable modern JavaScript output
    esmExternals: true,
    // Enable SWC plugins if needed
    swcPlugins: [],
    // Optimize CSS
    optimizeCss: true,
    // Enable server components (if using App Router)
    // serverComponents: true,
  },
  
  // TypeScript configuration
  typescript: {
    // Set to true if you want to ignore TypeScript errors during build
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Set to true if you want to ignore ESLint errors during build
    ignoreDuringBuilds: false,
    dirs: ['src', 'pages', 'components', 'lib', 'utils'],
  },
  
  // Output configuration
  output: 'standalone',
  
  // Trailing slash configuration
  trailingSlash: false,
  
  // Compression
  compress: true,
  
  // PoweredByHeader
  poweredByHeader: false,
  
  // Generate ETags
  generateEtags: true,
  
  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Base path (if deploying to a subdirectory)
  // basePath: '/subdirectory',
  
  // Asset prefix (for CDN)
  // assetPrefix: 'https://cdn.example.com',
  
  // Development indicators
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  
  // Server runtime configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: process.env.SERVER_SECRET,
  },
  
  // Public runtime configuration
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/public',
  },
};

module.exports = nextConfig;