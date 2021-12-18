# 对象变换
我们有四种属性可以对对象进行变换：
1. position
2. scale
3. rotation
4. quaternion

凡是继承自Object3D的类都有这四个属性，比如`PerspectiveCamera`, `Mesh`。

这些属性都会被编译成矩阵，然后由WebGL调用，GPU用它来对对象做出变换。我们不需要自己处理矩阵，只需要修改这些属性就行，Three.js帮我们处理了这些事情。

变换必须在渲染器渲染前设置，否则将不会生效。

## position
position继承自Vector3（3向矢量），Vector3有x、y、z三个属性以及许多有用的方法。

比如`mesh.position.length()`获取矢量的长度
还可以用`mesh.position.distanceTo(camera.position)`获取不同对象之间的距离
还可以用`mesh.position.normalize()`使其长度减少到1，但保留其方向
用`mesh.position.set(x, y, z)`可以同时设置三个方向的变换

## scale
scale也继承自Vector3，使其在指定方向伸缩。

## rotation和quaternion
rotate相对要复杂一些，我们有两种方法来进行旋转操作，一个是只用rotation，一个是结合quaternion。

### rotation
旋转属性也有x、y和z属性，但它不是一个Vector3，而是一个Euler。当你改变Euler的x、y、z属性时，你可以想象在轴的方向上把一根棍子穿过你的对象的中心，然后在这根棍子上旋转该对象。

```js
// 以y轴旋转180度
mesh.rotation.y = Math.PI
```

这很容易吗？是的，但是当你把这些旋转结合起来时，你可能会得到奇怪的结果。为什么呢？因为，在你旋转X轴的同时，你也改变了其他轴的方向。这可能会导致一些奇怪的行为，比如名为万向节锁定的行为，当一个轴没有更多的效果时，都是因为前面的轴。

我们可以通过使用`reorder(...)`方法来改变这个顺序 `object.rotation.reorder('yxz')`。

虽然Euler更容易理解，但这个顺序问题比较棘手。这就是为什么大多数引擎和3D软件使用另一种名为四元数（quaternion）的解决方案。

### quaternion
quaternion也表达了旋转，但以一种更数学化的方式，解决了顺序问题。

此处不会介绍四元数的工作原理，但请记住，当你改变旋转时，四元数会更新。这意味着你可以随心所欲地使用二者中的任何一个。

```js
const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );

const vector = new THREE.Vector3( 1, 0, 0 );
vector.applyQuaternion( quaternion );
```

## look at
Object3D实例有一个很好的方法，名为lookAt(...)，可以让你要求一个对象看某个东西。对象会自动将其-z轴向你提供的目标旋转。不需要复杂的数学计算。

你可以用它将摄像机旋转到一个物体上，将大炮的方向对准敌人，或者将角色的眼睛移到一个物体上。
```js
camera.lookAt(new THREE.Vector3(0, - 1, 0))
```

我们也可以使用任何现有的Vector3，如网格的位置，给相机添加lookat将会改变的相机位置
```js
camera.lookAt(mesh.position)
```

## 场景图
在某种程度上，你可能想要把东西分组。假设你正在建造一座有墙、门、窗、屋顶、灌木丛等的房子。

使用Group可以进行分组：
```js
const group = new THREE.Group()
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = - 1.5
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.position.x = 0
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube3.position.x = 1.5
group.add(cube3)
```