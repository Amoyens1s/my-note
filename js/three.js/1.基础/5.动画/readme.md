# 动画
实现动画效果我们需要`requestAnimationFrame`，这个是浏览器原生API，但是这个并不是在每一帧上运行我们的代码，而是执行您在下一帧中提供的函数。使用递归，我们可以实现想要的效果：
```js
const tick = () =>
{
    console.log('tick')

    window.requestAnimationFrame(tick)
}

tick()
```

## 不同刷新率动画速度不同
我们有多种解决方法

### Date
```js
let time = Date.now()
const tick = () => {
    /**
     * 不同刷新率的显示器中，requestAnimationFrame速度也不一样
     * 为了让不同刷新率有相同效果，我们需要利用计算时间差
     */
    const currentTime = Date.now()
    // 刷新率越高，deltaTime越小，144hz在6-7左右，60hz在16-17左右
    const deltaTime = currentTime - time
    time = currentTime

    // Update objects
    mesh.rotation.y += 0.001 * deltaTime

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
```

### Clock
实例化一个Clock变量，并使用内置的getElapsedTime()等方法。该方法将返回自时钟创建以来已经过去多少秒。
```js
const clock = new THREE.Clock()

const tick = () => {
    mesh.rotation.y = clock.getElapsedTime()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
```
另一个可用的方法是`getDelta(...)`，但你不应该使用它，除非你知道时钟类代码中到底发生了什么。使用它可能会搞乱你的动画，你会得到不想要的结果。

### gsap lib
有时你想以一种非常特殊的方式为你的场景制作动画，这就需要使用另一个库。有大量的动画库，GSAP是一个非常著名的库。

有很多使用GSAP的方法，我们可以用一整个课程来介绍，但这不是本课程的目标。我们将简单地创建一个Tween来测试一下。如果你已经知道如何使用GSAP，它与Three.js的工作原理相同。

注释与前面的动画有关的代码，但保留与渲染有关的tick函数。然后你可以用gsap.to(...)创建我们所说的tween（一个从A到B的动画）。

GSAP有一个内置的requestAnimationFrame，所以你不需要自己更新动画，但如果你想看到立方体移动，你仍然需要在每一帧上不断做场景的渲染。
```js
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

const tick = () =>
{
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
```

### 选择合适的解决方案
至于在本地JS和动画库之间的选择，这是你想实现什么的问题。如果你要创建一个永远旋转的旋转木马，你不需要任何库来实现。但如果你想制作动画，比如说，制作一把剑的摆动，你可能更愿意使用一个库。