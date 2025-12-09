import React from "react";

let amages = {};
const loadImages = async () => {
  const context = require.context('./', true, /\.png$/); 
  await Promise.all(context.keys().map((key) => {
    const parts = key.split('/');
    const fileName = parts[2].split('.')[0].replace(/-/g, '_');
    return import(`${key}`).then(module => {
      amages[fileName] = module.default;
    });
  }));
};

loadImages();

export default amages;
