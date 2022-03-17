#! /bin/bash

cd ..
npm install
npm run build
forever restart ./dist/main.js