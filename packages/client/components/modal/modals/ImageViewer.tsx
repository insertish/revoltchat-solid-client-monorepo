import type { PropGenerator } from '../types';

/**
 * Modal for viewing images
 */
const ImageViewer: PropGenerator<'image_viewer'> = (props) => {
  return {
    _children(props) {
      return <h1>hi!</h1>;
    },
  };
};

export default ImageViewer;
