#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Step 1: Initialize Vite project without prompting for project name
console.log('Initializing Vite + Tailwind project...');
execSync('npm create vite@latest . -- --template react', { stdio: 'inherit' });

// Step 2: Install Tailwind CSS and required dependencies
console.log('Installing Tailwind CSS...');
execSync('npm install -D tailwindcss postcss autoprefixer', { stdio: 'inherit' });
execSync('npx tailwindcss init -p', { stdio: 'inherit' });

// Step 3: Configure Tailwind
console.log('Configuring Tailwind...');
const tailwindConfigContent = `
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
fs.writeFileSync('tailwind.config.js', tailwindConfigContent);

// Step 4: Update src/index.css with Tailwind imports
const indexCssPath = path.join('src', 'index.css');
fs.writeFileSync(indexCssPath, `
@tailwind base;
@tailwind components;
@tailwind utilities;
`);

// Step 5: Modify App.jsx and remove App.css
console.log('Customizing App.jsx and cleaning up unnecessary files...');
const appJsxPath = path.join('src', 'App.jsx');
const appJsxContent = `
import React from 'react';

function App() {
  return (
    <>
      
    </>
  );
}

export default App;
`;
fs.writeFileSync(appJsxPath, appJsxContent);

// Remove src/App.css
const appCssPath = path.join('src', 'App.css');
if (fs.existsSync(appCssPath)) {
  fs.unlinkSync(appCssPath);
}

// Step 6: Create components folder
console.log('Creating components folder...');
const componentsDir = path.join('src', 'components');
fs.mkdirSync(componentsDir, { recursive: true });

// Step 7: Ask for the number of components to create using readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the number of components to create: ', (number) => {
  const numberOfComponents = parseInt(number, 10);

  // Step 8: Create the new component files with boilerplate code
  const createComponent = (i) => {
    if (i < numberOfComponents) {
      rl.question(`Enter the name for component ${i + 1}: `, (componentName) => {
        const capitalizedComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1); // Capitalize the first letter

        const componentContent = `
const ${capitalizedComponentName} = () => {
  return (
    <div>
      
    </div>
  );
}

export default ${capitalizedComponentName};
`;
        const componentPath = path.join(componentsDir, `${capitalizedComponentName}.jsx`);
        fs.writeFileSync(componentPath, componentContent.trim());

        // Recursive call to create the next component
        createComponent(i + 1);
      });
    } else {
      // Finalize setup after all components are created
      console.log('Finalizing setup...');
      execSync('npm install', { stdio: 'inherit' });

      console.log('Vite + Tailwind CSS project setup is complete with custom configurations!');
      rl.close();
    }
  };

  // Start creating components
  createComponent(0);
});
