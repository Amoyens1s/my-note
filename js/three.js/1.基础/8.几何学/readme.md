# 几何学
到目前为止，我们只使用 BoxGeometry 类来创建立方体。在本课中，我们将发现其他各种几何形状，但首先，我们需要理解几何学到底是什么。

## 什么是几何学
在 Three.js 中，几何图形由顶点和面组成。其中顶点是3D空间中的点坐标，面是将这些顶点连接起来创建曲面的三角形

我们使用几何图形来创建网格（meshes），但是您也可以使用几何图形来形成粒子（particles）。每个顶点(顶点的单数)将对应于一个粒子，但这是以后的课程。

除了坐标以外，我们还可以在顶点存储更多的数据，比如UV坐标、法线。

## 不同的内置几何体
Three js 有许多内置的几何图形。虽然您不需要准确地知道如何实例化每一个，但最好知道它们的存在。

我们将看到的所有内置几何图形都是从 `BufferGeometry` 类继承而来的。这个类有许多内置的方法，比如 `translate(...)`, `rotateX(...)`, `normalize()`等等，但是我们不打算在本课中使用它们。

- `BoxGeometry` 创建一个立方体。
- `PlaneGeometry` 创建一个矩形平面。
- `CircleGeometry` 圆形缓冲几何体，创建一个圆盘或圆盘的一部分(如饼图)，也是一个平面。
- `ConeGeometry` 创建一个圆锥体或圆锥体的一部分。你可以打开或关闭圆锥体的底部。
- `CylinderGeometry` 创建一个圆柱体。你可以打开或关闭圆柱体的两端，你可以改变圆柱体两端的半径。
- `RingGeometry` 环形几何学创建一个平面的环或平面圆的一部分。
- `TorusGeometry` 圆环缓冲几何体，制造一个有一定厚度(像甜甜圈一样)或一部分环的环。
- `TorusKnotGeometry` 圆环缓冲扭结几何体，创建某种结的几何形状。
- `DodecahedronGeometry` 十二面缓冲几何球体。你可以为一个圆球体添加细节。
- `OctahedronGeometry` 八面缓冲几何球体。你可以添加一个圆球的细节。
- `TetrahedronGeometry` 四面缓冲几何球体(如果不增加细节，它就不算是一个球体)。您可以添加一个圆形球体的细节。
- `IcosahedronGeometry` 二十面缓冲几何体，创建一个由大小大致相同的三角形组成的球体。
- `SphereGeometry` 球缓冲几何体，创建最流行的球体类型，其中面看起来像四边形(四边形只是两个三角形的组合)。
- `ShapeGeometry` 创建一个基于路径的形状。
- `TubeGeometry` 创建一个沿着路径的管子。
- `ExtrudeGeometry` 挤压缓冲几何体，挤压几何根据路径创建挤压。可以添加和控制斜面。
- `LatheGeometry` 车削缓冲几何体，像3D max中的车削曲面一样，可以制作花瓶或花瓶的一部分。
- `TextGeometry` 创建一个3d 文本。你必须提供JSON格式的字体格式。

## 立方体
我们已经创建了一个立方体，但是我们并没有过多地讨论参数。大多数几何图形都有参数，在使用之前您应该先查看文档。

BoxGeometry有六个参数

- `width`: 宽度: x 轴上的大小
- `height`: 高度: y 轴上的大小
- `depth`: 深度: z 轴上的大小
- `widthSegments`: x 轴上有多少个细分段
- `heightSegments`: y 轴上有多少个细分段
- `depthSegments`: z 轴上有多少个细分段

通过添加线框图，我们可以看到细分段和三角形：
```js
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
```

## 创建自己的集合体
有时候，我们需要创造我们自己的几何图形。如果几何图形非常复杂或具有精确的形状，最好使用3d 软件创建它，但如果几何图形不是太复杂，我们可以使用 BufferGeometry 自己创建它。

要创建自己的缓冲区几何图形，首先实例化一个空的 BufferGeometry，我们将创建一个简单的三角形:
```js
const geometry = new THREE.BufferGeometry()
```
要向 BufferGeometry 添加顶点，必须从 Float32Array 开始。Float32Array 是一个原生的 JavaScript 类型数组，你只能存储浮点数，并且数组的长度是固定的。要创建一个 Float32Array，你可以指定它的长度，然后填充它:
```js
const positionsArray = new Float32Array(9)

// First vertice
positionsArray[0] = 0
positionsArray[1] = 0
positionsArray[2] = 0

// Second vertice
positionsArray[3] = 0
positionsArray[4] = 1
positionsArray[5] = 0

// Third vertice
positionsArray[6] = 1
positionsArray[7] = 0
positionsArray[8] = 0
```
或者简单点，可以传递一个数组：
```js
const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])
```
如您所见，顶点的坐标是线性指定的。数组是一维坐标，其中指定第一个顶点的 x、 y 和 z，然后是第二个顶点的 x、 y 和 z，依此类推。

在我们把这个数组发送给`BufferGeometry`之前，我们需要把它转换为`BufferAttribue`：
```js
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
```
然后我们可以使用`setAttribute(...)`方法来将其添加到`BufferGeometry`中：
```js
geometry.setAttribute('position', positionsAttribute)
```
我们之所以选择 `position` 作为名称，是因为 Three.js 内部着色器会寻找这个值来定位顶点。我们将在着色器的课程中看到更多这方面的内容。

完整代码:
```js
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

// Create a Float32Array containing the vertices position (3 by 3)
const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)
```

我们可以创建一堆随机的三角形：
```js
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

// Create 50 triangles (450 values)
const count = 50
const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 4
}

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)
```

BufferGeometry有一个index属性，可以让多个面共享顶点从而减少数组体积，并获得更好的性能：
> `.index`:
允许顶点在多个三角面片间可以重用。这样的顶点被称为"已索引的三角面片（indexed triangles)。 每个三角面片都和三个顶点的索引相关。该 attribute 因此所存储的是每个三角面片的三个顶点的索引。 如果该 attribute 没有设置过，则 renderer 假设每三个连续的位置代表一个三角面片。 默认值是 null。