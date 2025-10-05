module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,       // set true if you have a .env.example for validation
        allowUndefined: true,
      },
    ],
  ],
};
