module.exports = {
  rootDir: 'frontend',  // Set the root directory to 'frontend'
  moduleDirectories: [
    'node_modules',  // Resolve modules from node_modules
    'src',           // Resolve imports from src folder
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/jest.mock.js",  // Mock CSS imports
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/jest.mock.js"  // Mock image imports
  },
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",  // Use babel-jest to transform JSX/JS files
  },
  transformIgnorePatterns: [
    "/node_modules/(?!firebase|react-toastify)",  // Allow transforming certain node_modules
  ],
};
