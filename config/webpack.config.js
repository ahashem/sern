const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const project = require('./project.config');

const __DEV__ = project.env === 'development';
const __TEST__ = project.env === 'test';
const __PROD__ = project.env === 'production';

const inProject = path.resolve.bind(path, project.basePath);
const inProjectSrc = file => inProject(project.srcDir, file);
const devTool = shouldSourceMap => {
  if (__DEV__) {
    return 'cheap-module-eval-source-map';
  }
  return shouldSourceMap ? 'source-map' : false;
};

const config = {
  entry: {
    main: [inProjectSrc(project.main)],
  },
  devtool: devTool(project.sourcemaps),
  output: {
    path: inProject(project.outDir),
    filename: __DEV__ ? '[name].js' : 'js/[name].[chunkhash:8].js',
    publicPath: project.publicPath,
  },
  resolve: {
    modules: [inProject(project.srcDir), 'node_modules'],
    extensions: ['*', '.js', '.jsx', '.json'],
  },
  externals: project.externals,
  module: {
    rules: [],
  },
  plugins: [
    new webpack.DefinePlugin(
      Object.assign(
        {
          'process.env': {
            NODE_ENV: JSON.stringify(project.env),
            PORT: JSON.stringify(project.server_port),
          },
          __DEV__,
          __TEST__,
          __PROD__,
        },
        project.globals
      )
    ),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk
        .mapModules(m => path.relative(m.context, m.request))
        .join('_');
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

// JavaScript
// ------------------------------------
config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      query: {
        babelrc: true,
        comments: false,
        cacheDirectory: true,
        presets: [require.resolve('babel-preset-react-app')],
        env: {
          production: {
            presets: [
              require.resolve('babel-preset-react-optimize'),
              require.resolve('babel-preset-react-app'),
            ],
          },
        },
      },
    },
  ],
});

// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
  filename: 'styles/[name].[contenthash:8].css',
  allChunks: true,
  disable: __DEV__,
});

config.module.rules.push({
  test: /\.(sass|scss|css)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: project.sourcemaps,
          minimize: {
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll: true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: project.sourcemaps,
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: project.sourcemaps,
          includePaths: [inProjectSrc('styles')],
        },
      },
    ],
  }),
});
config.plugins.push(extractStyles);

// Images
// ------------------------------------
config.module.rules.push({
  test: /\.(png|jpg|gif)$/,
  loader: 'url-loader',
  options: {
    limit: 8192,
    fallback: require.resolve('file-loader'),
    name: 'images/[name]_[hash:8].[ext]',
  },
});

// Fonts
// ------------------------------------
[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach(font => {
  const extension = font[0];
  const mimetype = font[1];

  config.module.rules.push({
    test: new RegExp(`\\.${extension}$`),
    loader: 'url-loader',
    options: {
      name: 'fonts/[name]_[hash:8].[ext]',
      limit: 10000,
      mimetype,
    },
  });
});

// HTML Template
// ------------------------------------
config.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: inProjectSrc('index.html'),
    inject: true,
    hash: false,
    minify: {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      html5: true,
      minifyCSS: true,
      removeComments: true,
      removeEmptyAttributes: true,
    },
  })
);

// Development Tools (like HMR)
// ------------------------------------
if (__DEV__) {
  config.entry.main.push(
    `webpack-hot-middleware/client.js?path=${config.output
      .publicPath}__webpack_hmr`
  );
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

// Bundle Splitting (for cache busting)
// ------------------------------------
if (!__TEST__ && __PROD__) {
  if (project.vendors && project.vendors.length) {
    // actually it is of no use, because we separately find vendor chunk
    config.entry.vendor = project.vendors;
  }
  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module, count) {
        const context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      },
    })
  );

  const bundles = [
    {
      name: 'vendor',
      minChunks: (module, count) => {
        const context = module.context;
        module.originalChunkNames = module.chunks.map(({name}) => name);
        return context && context.indexOf('node_modules') >= 0;
      },
    },
    {
      name: 'manifest',
      minChunks: Infinity,
    },
  ];

  bundles.forEach(bundle => {
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin(bundle));
  });
}

// Production Optimizations (for faster loading)
// ---------------------------------------------
if (__PROD__) {
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!config.devtool,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
    })
  );
}


module.exports = config;
