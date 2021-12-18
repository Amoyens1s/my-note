# 相机

Three.js 有许多种相机，我们会一一介绍，但是通常我们只需要其中两个。

### Camera

Camera 是一个抽象类。你不应该直接使用它，但你可以继承它，以获得共同的属性和方法。以下一些类继承于 Camera 类。

### ArrayCamera

ArrayCamera 用于通过使用多个摄像机来多次渲染你的场景。每个相机将渲染画布的一个特定区域。你可以想象这看起来像老式的 FC 多人游戏，我们不得不把屏幕分开，或者使用多屏。

### StereoCamera

StereoCamera 用于通过两个摄像头来渲染场景，模仿眼睛，以创造我们所说的视差效果，引诱你的大脑认为有深度。你必须有足够的设备，如 VR 头盔或红蓝眼镜才能看到结果。

### CubeCamera 立体摄像机

CubeCamera 是用来获得面向每个方向（向前、向后、向左、向右、向上和向下）的渲染，以创建周围的渲染。你可以用它来创建一个用于反射的环境贴图或一个阴影贴图。这个用于创建 3D 环绕或者全景视图，我们将在后面讨论这些。

### OrthographicCamera 正射摄影机

OrthographicCamera 是用来创建没有透视的场景的正交渲染的。如果你制作一个像《帝国时代》这样的 RTS 游戏，它就很有用。无论元素与摄像机的距离如何，它们在屏幕上的尺寸都是一样的。

### PerspectiveCamera

PerspectiveCamera 是我们已经使用过的，它模拟了现实生活中带有透视的摄像机。

我们将重点讨论 OrthographicCamera 和 PerspectiveCamera。

## PerspectiveCamera

透视相机有四个参数，我们前面简单介绍过，这里将详细介绍：

### Field of view (FOV)

第一个参数叫视场，对应于你的相机视图的垂直振幅角度，单位是度。如果你使用一个小角度，你最终会得到一个长范围的效果，如果你使用一个广角，你最终会得到一个鱼眼效果，因为，最终，相机看到的东西会被拉伸或挤压以适应画布。

至于选择合适的视场，你必须进行尝试。我通常使用 45 和 75 之间的视场。

### Aspect ratio 纵横比

第二个参数叫做纵横比，对应于宽度除以高度。虽然你 可能认为这显然是画布宽度除以画布高度，Three.js 应该自己计算，但如果你开始以非常特殊的方式使用 Three.js，情况并不总是如此。但在我们的案例中，你可以简单地使用画布宽度和画布高度。

我建议将这些值保存在一个对象中，因为我们将多次需要它们。

### Near and far 近截面和远截面

第三个和第四个参数叫做近界面和远界面，对应于摄像机可以看到的距离。任何物体或物体的一部分如果比近截面更接近摄像机，或者比远截面更远离摄像机，都不会在渲染中显示出来。

你可以看到，就像在那些老的赛车游戏中，你可以看到远处的树木突然出现。

虽然你可能很想使用非常小和非常大的数值，比如 0.0001 和 999999，但你可能会出现一个叫做 z-fighting 的 bug，当两个或多个基元与相机的距离非常相似时，就会出现这种现象。尽量使用合理的值，只有在你需要的时候才增加这些值。在我们的案例中，我们可以使用 0.1 和 100。

## OrthographicCamera

OrthographicCamera 与 PerspectiveCamera 的不同之处在于它没有透视功能，也就是说，无论物体与相机的距离有多远，都会有相同的尺寸。

你必须提供摄像机在每个方向（左、右、上和下）能看到多远，而不是视场。然后你可以像我们为 PerspectiveCamera 所做的那样，提供近截面和远截面的值。

正如你所看到的，没有透视，而我们的立方体的边似乎是平行的。问题是，我们的立方体看起来并不是立方体。

这是由于我们提供的左、右、顶和底的值是 1 或-1，这意味着我们渲染的是一个正方形区域，但这个正方形区域将被拉伸以适应我们的矩形画布，而我们的画布并不是正方形。

我们需要使用画布比例（宽乘高）。让我们创建一个名为 aspectRatio 的变量（就像 PerspectiveCamera 一样），并在其中存储该比率。

```js
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  0.1,
  100
);
```

## 自定义控制

如果我们想要通过移动鼠标来移动相机，是时候监听 dom 事件了：

```js
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = - (event.clientY / sizes.height - 0.5)
});
```

最后，你可以通过乘以cursor.x和cursor.y来增加振幅，并使用lookAt(...)方法要求摄像机观察网格。
```js
const tick = () =>
{
    // ...

    // Update camera
    camera.position.x = cursor.x * 5
    camera.position.y = cursor.y * 5
    camera.lookAt(mesh.position)

    // ...
}
```

我们可以更进一步，通过使用Math.sin(...)和Math.cos(...)使摄像机围绕网格做完全的旋转。

sin和cos，当结合在一起并使用相同的角度时，使我们能够将东西放在一个圆上。要做一个完整的旋转，该角度的振幅必须是π的2倍（称为 "π"）。你要知道，一个完整的旋转被称为 "tau"，但我们在JavaScript中无法获得这个值，我们必须使用π来代替。

你可以在本地JavaScript中使用Math.PI访问π的近似值。

为了增加这个圆的半径，你可以简单地将Math.sin(...)和Math.cos(...)的结果相乘。
```js
const tick = () =>
{
    // ...

    // Update camera
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)

    // ...
}

tick()
```

虽然这是一个控制相机的良好开端，但Three.js已经集成了多个名为controls的类，以帮助你做同样的事情，甚至更多。

## 内置Controls
### DeviceOrientationControls 设备方向控制
如果你的设备、操作系统和浏览器允许，DeviceOrientationControls将自动检索设备方向，并相应地旋转相机。如果你有合适的设备，你可以用它来创建沉浸式宇宙或VR体验。

### FlyControls 飞行控制
FlyControls可以让你像在宇宙飞船上一样移动摄像机。你可以在所有3个轴上旋转，向前和向后移动。

### FirstPersonControls 第一人称控制
FirstPersonControls就像FlyControls一样，但有一个固定的上轴。你可以看到，就像一个飞鸟视图，鸟儿不能做桶状翻滚。虽然FirstPersonControls包含 "FirstPerson"，但它不像在FPS游戏中那样工作。

### PointerLockControls 指针锁定控件
PointerLockControls使用指针锁定的JavaScript API。这个API隐藏了光标，使其保持在中心位置，并在mousemove事件回调中持续发送运动。有了这个API，你就可以在浏览器中创建FPS游戏。虽然这个类听起来很有前途，如果你想创建那种交互，它只能在指针被锁定时处理摄像机的旋转。你必须自己处理摄像机的位置和游戏的物理学。

### OrbitControls 轨道控制
OrbitControls与各种建模软件中的控件非常相似，比如blender。你可以用鼠标左键围绕一个点旋转，用鼠标右键进行横向平移，用滚轮进行放大或缩小。

### TrackballControls 轨迹球控件
TrackballControls与OrbitControls一样，但在垂直角度方面没有限制。即使场景被颠倒了，你也可以继续旋转，用摄像机做旋转。

### TransformControls 变形控件
TransformControls与摄像机没有关系。你可以用它在一个物体上添加一个小工具来移动该物体。

### DragControls 拖动控件
就像TransformControls一样，DragControls与摄像机没有任何关系。你可以用它在面对摄像机的平面上通过拖放来移动物体。

我们将只使用OrbitControls，但可以随意测试其他类。
## OrbitControls
首先，我们需要使用OrbitControls类来实例化一个变量。虽然你可能认为你可以在这里使用THREE.OrbitControls，但不幸的是你错了。

OrbitControls类是那些在THREE变量中默认不能使用的类的一部分。这个决定有助于减少库的重量。而这正是我们的Webpack模板的作用所在。

OrbitControls类可能在THREE变量中不可用；它仍然位于依赖文件夹中。要导入它，你必须提供来自/node_modules/文件夹内的路径，即/three/examples/jsm/controls/OrbitControls.js。

现在你可以使用OrbitControls类（没有THREE.）来实例化一个变量，并确保在创建摄像机后进行。

为了使其发挥作用，你必须提供摄像机和页面中处理鼠标事件的元素作为参数。
```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const controls = new OrbitControls(camera, canvas)
```

### 阻尼
我们按左键会发现相机跟着我们的鼠标快速移动，如果想要CSGO中那种电影运镜的效果，我们需要添加阻尼。阻尼将通过添加某种加速度和摩擦力的公式来平滑动画。

要启用阻尼，将控件的enableDamping属性切换为true。

为了正常工作，控件还需要在每一帧上通过调用controls.update()进行更新。你可以在tick函数上完成这个工作。
```js
controls.enableDamping = true
// 数字越小，阻尼越大
controls.dampingFactor = 0.01
```
