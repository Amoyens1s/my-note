# 纹理 Textures

对你的红色立方体感到厌倦了吗? 是时候添加一些纹理了。

但首先，什么是纹理，我们真正能用它们做什么？

## 什么是纹理

正如你可能知道的，纹理是覆盖在几何图形表面的图像。许多类型的纹理可以对几何体的外观产生不同的影响。这不仅仅是颜色的问题。

纹理有不同的类型：

- Color 颜色(或反照率)纹理是最简单的纹理。它只会采取像素的纹理和应用到几何图形。
- Alpha 阿尔法纹理是一个灰度图像，白色可见，黑色不可见。
- Height 高度纹理的高度是一个灰度图像，将移动顶点创建一些浮雕。如果你想看到它，你需要添加细分。
- Normal 普通的纹理会添加一些小的细节。它不会移动顶点，但是它会引诱光线认为人脸的方向是不同的。正常的纹理对于添加具有良好性能的细节非常有用，因为您不需要对几何体进行细分。
- Ambient occlusion 环境遮挡纹理是一个灰度图像，可以在表面的裂缝处伪造阴影。虽然它在物理上并不准确，但它确实有助于创造对比。
- Metalness 金属纹理是一个灰度图像，将指定哪些部分是金属(白色)和非金属(黑色)。这些信息将有助于创建反射。
- Roughness 粗糙度是一个与金属相对的灰度图像，它指定哪个部分是粗糙的(白色) ，哪个部分是光滑的(黑色)。这个信息将有助于驱散光。地毯是非常崎岖的，你不会看到光反射在它上面，而水的表面是非常平滑的，你可以看到光反射在它上面。在这里，木头是统一的，因为有一个明确的大衣上。

这些纹理(特别是金属性和粗糙度)遵循我们所谓的 PBR 原则。代表基于物理的渲染（Physically Based Rendering）。它重新组合了许多倾向于遵循现实生活方向的技术，以获得实际的结果。虽然还有许多其他技术，但 PBR 正在成为实际渲染的标准，许多软件、引擎和库都在使用它。

## 如何加载纹理

### 获取图像的 URL

要加载纹理，我们需要图像文件的 URL。因为我们正在使用 Webpack，所以有两种方法可以得到它。

你可以把图片纹理放在/src/文件夹中，然后像导入 JavaScript 依赖项一样导入它:

```js
import imageSource from './image.png';
```

或者你也可以把图片放到/static/文件夹中，只需将图片的路径(不包括/static)添加到 URL 中就可以访问它:

```js
const imageSource = '/image.png';
```

请注意，这个/static/文件夹只有在 Webpack 模板的配置下才能正常工作。

### 加载图片

#### 原生 JavaScript

首先，你必须创建一个 Image 实例，监听加载事件，然后更改它的 src 属性来开始加载图像:

```js
const image = new Image();
image.onload = () => {
  console.log('image loaded');
};
image.src = '/textures/door/color.jpg';
```

我们不能直接使用这张图片。我们需要首先从这张图片创建一个纹理。这是因为 WebGL 需要一个非常特殊的格式，可以被 GPU 访问，还因为一些变化将被应用到纹理，如 mipmapping，但我们稍后会看到更多关于这一点。

```js
const image = new Image();
image.addEventListener('load', () => {
  const texture = new THREE.Texture(image);
});
image.src = '/textures/door/color.jpg';
```

我们现在需要做的是在材质中使用纹理。不幸的是，纹理变量已经在一个函数中声明，我们不能在这个函数之外访问它。如果不知道为什么，请去学习 JavaScript 基础：作用域和闭包。

我们可以在函数内部创建网格，但是有一个更好的解决方案，包括在函数外部创建纹理，然后在加载图像后通过设置纹理 needsUpdate 属性为 true 来更新它:

```js
const image = new Image();
const texture = new THREE.Texture(image);
image.addEventListener('load', () => {
  texture.needsUpdate = true;
});
image.src = '/textures/door/color.jpg';
```

在这样做的同时，您可以立即使用纹理变量，图像将是透明的，直到它被加载。要应用纹理，用 map 替换颜色属性，并使用纹理作为值:

```js
const material = new THREE.MeshBasicMaterial({ map: texture });
```

#### 使用 TextureLoader

原生 JavaScript 技术并不复杂，但是对于 TextureLoader 有一种更直接的方法:

```js
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/door/color.jpg');
```

在内部，Three.js 会像之前一样加载图像，并在纹理准备好后更新它。只需要一个 TextureLoader 实例，就可以加载任意多的纹理。你可以在 load 函数中传入三个回调函数作为参数:

1. `load` 图片成功加载
2. `progress` 加载过程中，加载多个纹理的时候会出现
3. `error` 加载出错

```js
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  '/textures/door/color.jpg',
  () => {
    console.log('loading finished');
  },
  () => {
    console.log('loading progressing');
  },
  () => {
    console.log('loading error');
  }
);
```

#### 使用 LoadingManager
如果您需要加载多个图像，并希望共享事件，比如在加载所有图像时收到通知，那么可以使用 LoadingManager。

创建 LoadingManager 类的一个实例并将其传递给 TextureLoader:
```js
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
```

你也可以自己添加监听函数：
```js
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
```

现在，你可以开始加载所有你需要的图片了：
```js
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
```