import './style.css'
import * as THREE from 'three'

// 场景
const scene = new THREE.Scene()

// 对象
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

mesh.position.set(0.7, -0.6, 1)
mesh.scale.set(2, 0.5, 0.5)

scene.add(mesh)

/**
 * 创建一个坐标轴对象来帮助我们判断方向
 */
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// 尺寸
const sizes = {
    width: 800,
    height: 600
}

// 相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

camera.lookAt(mesh.position)

// 渲染器
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})

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

scene.add(group)
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)