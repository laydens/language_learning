const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    // ... other configurations ...
    plugins: [
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
        }),
    ],
};
