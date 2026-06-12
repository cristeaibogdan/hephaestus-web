import path from 'path';

/**
 * Provides predefined file paths for test resources (images and files),
 * organized by type and format for easy reuse.
 */
export const TEST_FILES = {
  images: {
    jpg: {
      landscape: path.join(__dirname, 'images/landscape.jpg'),
      tree: path.join(__dirname, 'images/tree.jpg'),
    },
    jpeg: {
      mountains: path.join(__dirname, 'images/mountains.jpeg')
    },
    bmp: {
      trail: path.join(__dirname, 'images/trail.bmp'),
    }
  },

  files: {
    txt: {
      empty: path.join(__dirname, 'files/empty.txt')
    }
  }  
};
