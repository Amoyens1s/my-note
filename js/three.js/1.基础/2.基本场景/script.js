// 创建一个场景
const scene = new THREE.Scene()

/**
 * 创建一个几何对象
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)

/**
 * 添加一个材质
 * 可以用0xff0000, '#ff0000', 'red'等等
 */
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

/**
 * 创建一个网格，并传入几何体和材质
 * 网格是由顶点、边、面等组成的物体。其他物体有线段、骨骼、粒子，等等
 */
const mesh = new THREE.Mesh(geometry, material)

/**
 * 把网格添加到场景中
 */
scene.add(mesh)

const size = {
  width: 800,
  height: 600
}

/**
 * 创建一个透视相机
 * 透视相机是最常见的相机，除此之外还有许多种类的相机
 * 
 * 透视相机有四个参数：
 * 第一个参数是fov，为竖直方向的视角角度
 * 第二个参数是宽高比，宽/高
 * 第三个参数为近截面距离
 * 第四个参数为远截面距离
 */
const camera = new THREE.PerspectiveCamera(75, size.width/size.height)

/**
 * 添加的东西默认位置是0,0,0,所以相机在立方体里面了，我们在页面上无法看到我们的立方体
 * 我们需要移动下我们的相机
 * 
 * 改变一个对象可以用position、rotation、scale，我们这里只需要移动相机的位置，所以只需要position
 * 
 * position接受x,y,z三个参数，在threejs中
 * x为向右
 * y为向上
 * z为从屏幕向外
 */
camera.position.z = 3

/**
 * 把相机添加到场景中
 */
scene.add(camera)

/**
 * 获取画布
 */
const canvas = document.querySelector('.webgl')

/**
 * 创建渲染
 * 这里我们用WebGLRender，除此之外还有css渲染器和svg渲染器
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas 
})

/**
 * 我们并没有给canvas添加尺寸，这导致我们渲染器的尺寸是错误的
 * 我们可以通过给渲染器setSize来改变尺寸，同时它会把canvas的尺寸改变
 */
renderer.setSize(size.width, size.height)

/**
 * 到目前为止我们有了渲染器，场景，红色立方体，相机，但是他们是独立的
 * 我们需要把场景和相机添加给渲染器
 */
renderer.render(scene, camera)
