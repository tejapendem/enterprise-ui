import SplineLoader from '@splinetool/loader';
const loader = new SplineLoader();
loader.load('https://prod.spline.design/DitrmZN8NNhKZyNJ/scene.splinecode', (splineScene) => {
  splineScene.traverse((child) => {
    if (child.isMesh) {
      console.log(child.name, child.type);
    }
  });
});
