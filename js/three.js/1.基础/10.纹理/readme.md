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

## UV展开
降维打击，把3D的网格展开成2维的平面，就是UV展开，就像打开一个折纸或糖果包装，使它平坦。每个顶点在一个平面(通常是正方形)上都有一个二维坐标。

纹理以不同的方式被拉伸或挤压来覆盖几何体，因此使用UV展开可以帮助我们方便地创建纹理，在许多游戏的资源包中可以看到的材质贴图就是这个东西。

我们可以通过`geometry.attributes.uv`看到UV坐标，如果你创建自己的几何图形，并想应用一个纹理，你必须指定UV坐标。如果你使用3D软件制作几何图形，你也需要。

## 纹理变换
让我们回到使用一个纹理的立方体，看看我们可以对这个纹理应用什么样的变换。

### 重复 Repeat
可以使用 repeat 属性重复纹理，这是一个 Vector2，意味着它具有 x 和 y 属性。
```js
const colorTexture = textureLoader.load('/textures/door/color.jpg')
colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
```
正如你所看到的，纹理是不重复的，但它是更小的，最后一个像素似乎拉伸。这是因为默认情况下纹理没有被设置为重复它自己。要更改这一点，必须使用 THREE.RepeatWrapping 常量更新 wrapS 和 wrapT 属性。

```js
// wrapS是X轴的包装
colorTexture.wrapS = THREE.RepeatWrapping
// wrapT是Y轴的包装
colorTexture.wrapT = THREE.RepeatWrapping
```
除此之外还有Mirrored包裹，会把重复的进行一个镜像：
```js
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping
```

### 偏移量 Offset
```js
colorTexture.offset.x = 0.5
colorTexture.offset.y = 0.5
```

### 旋转 Rotation
你可以使用旋转属性旋转纹理，这是一个简单的数字，对应于弧度的角度:
```js
colorTexture.rotation = Math.PI * 0.25 // 逆时针旋转45°
```
如果你删除偏移和重复属性，你会看到旋转发生在立方体面的左下角。

事实上，左下角就是UV坐标0,0，我们可以通过center属性来改变旋转的中心点：
```
colorTexture.rotation = Math.PI * 0.25
colorTexture.center.x = 0.5
colorTexture.center.y = 0.5
```
因为我们的立方体长宽高都是1，所以现在它的旋转点在正中心

### 过滤和 Mipmapping
如果我们倾斜看一个屏幕，会发现它比较模糊，这是因为过滤和 mipmapping。Mipmapping是一种技术，为了加快渲染速度和减少图像锯齿，贴图被处理成由一系列被预先计算和优化过的图片组成的文件，它会把我们的纹理每次长宽减半以创建一个更小的纹理，一直到得到一个1x1大小的纹理，然后所有尺寸的纹理都会被发送给GPU，GPU会选择最合适的。

JS 和 GPU 已经处理了所有这些问题，不过你可以设置使用什么样的过滤算法。有两种滤镜算法: 缩小滤镜和放大滤镜。

#### 缩小滤镜
当我们的纹理大于我们实际渲染的大小时候，就会使用缩小滤镜。

可以使用 minFilter 属性更改纹理的缩小滤镜。

一共有6个可用的值：
- THREE.NearestFilter 会非常的锋利
- THREE.LinearFilter
- THREE.NearestMipmapNearestFilter
- THREE.NearestMipmapLinearFilter
- THREE.LinearMipmapNearestFilter
- THREE.LinearMipmapLinearFilter

其中LinearMipmapLinearFilter是默认值

```js
colorTexture.minFilter = THREE.NearestFilter
```

#### 放大滤镜
当我们的纹理小于我们实际渲染的大小时候，就会使用放大滤镜。纹理将会变得模糊，不过如果效果不是太夸张，用户可能甚至不会注意到它。

可以使用 magFilter 属性更改纹理的放大筛选器。

一共有两个可用的值：
- THREE.NearestFilter 同样会使东西变得锋利，不过应该说是像素化，这在有些场合非常有用，比如说minecraft，具体的请看代码
- THREE.LinearFilter

其中LinearFilter是默认的

```js
colorTexture.magFilter = THREE.NearestFilter
```

不管是缩小滤镜还是放大滤镜，THREE.NearestFilter的性能开销是最低的，所以尽可能利用它以获得更高的性能。

对于缩小滤镜，如果正在使用THREE.NearestFilter，你将不再需要mipmaps，所以可以禁用它以略微减轻GPU的负担：
```js
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
```

## 纹理格式和优化
当准备纹理的时候，必须记住三个关键的东西：weight, size, data。

### Weight 重量
比如jpg通常压缩率要比png要高，那么我们可以说png更重，为用户提供更轻的纹理以提高各方面的性能。

### Size 尺寸
你使用的每个像素的纹理都必须存储在 GPU 上，不管图像的重量如何。和你的硬盘一样，GPU 也有存储限制。更糟糕的是，自动生成的 mipmapping 增加了需要存储的像素数量。

所以尽可能减小图片的尺寸，比如从1024x1024降低到512x512。

如果你还记得我们说过的关于 mipmapping 的内容，Three.js 会反复生成一个半小的纹理版本，直到它得到一个1x1的纹理。因此，你的纹理宽度和高度必须是2的幂。这是必需的，因此 Three.js 可以将纹理的大小除以2。

如果你使用的纹理的宽度或高度与2的幂不同，thre.js 会尝试把它拉伸到最近的2的幂，这可能会导致视觉效果不佳，并且你还会在控制台中得到一个警告。

### Data 数据
纹理是支持透明度的，但是jpg文件没有alpha通道，因此你可能更喜欢用png。不过我们有alpha map，后面会讲到。

如果使用的是普通纹理（normalTexture），你可能希望获得更精确的颜色通道，那么无损压缩的png更合适。

根据不同的需求做出不同的选择。

## 哪里可以找到纹理
有许多网站，但是并不是所有纹理都是免费的，比如www.poliigon.com

当然了，如果你有一些基础，那么用Photoshop这样的软件自己制作纹理是最好的选择，也不会遇到任何的版权问题。