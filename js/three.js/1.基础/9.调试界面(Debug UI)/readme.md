# 调试界面

每个项目的一个重要方面就是使调试变得容易，并调整你的代码。使你和项目中的其他参与者能够修改尽可能多的参数。

因此我们需要一个调试界面。虽然可以使用 HTML/CSS/JS 创建自己的调试用户界面，但已经有多个库：

- dat.GUI
- control-panel
- ControlKit
- Uil
- Tweakpane
- Guify
- Oui

不过这些中有一些已经多年没有维护了，这里我们选用最流行的 dat.GUI，不过即便是 dat.GUI，也已经很久没更新了，但是我们有一个兼容 dat.GUI 的东西：lil-gui

```js
import * as dat from 'lil-gui';
const gui = new dat.GUI();
```

仅仅需要两行代码，我们就可以在页面右上角看到 Debug UI 了，不过它现在是一个空的调试器。

有不同类型的元素可以添加到面板中:

- Range — 最小值和最大值的数字
- Color — 适用于不同格式的颜色
- Text — 简单的文本
- Checkbox — 用于布尔值(true 或 false)
- Select — 从值列表中选择一个选项
- Button — 触发功能
- Folder — 如果有太多元素，可以用文件夹来组织面板

## 添加元素

要向面板添加元素，必须使用 `gui.add(...)`。第一个参数是一个对象，第二个参数是要调整的对象的属性。您需要在创建相关对象之后设置它:

```js
// 这样设置只有一个输入框
gui.add(mesh.position, 'y');

// 指定最小值、最大值、精度的两种方法，这样设置后会出现一个滑块
gui.add(mesh.position, 'y', -3, 3, 0.01);
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01);

// 添加name可以改变标签
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
```

GUI 会自动检测我们要设置的属性的类型，比如 visible 和 wireframe，就会检测为布尔值

```js
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');
```

## 颜色

处理颜色比较困难，需要单独拿出来讲。首先颜色需要使用 `addColor(...)` 而不是 `add(...)` ，这是因为 GUI 无法知道您是否需要根据属性的类型来调整文本、数字或颜色。

其次，你需要创建一个具有颜色属性的中间对象，并在材质中使用这个属性。

```js
const parameters = {
  color: 0xff0000,
};

// 如果此处的color和上面的不同，材质颜色用的将是这个，但GUI中显示的是上面的，然后使用GUI操作后颜色一样
const material = new THREE.MeshBasicMaterial({ color: parameters.color });

// 我们必须使用 onChange(...) 方法和 material.color.set(parameters.color) 来更新颜色
gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color);
});
```

## 函数
要触发一个函数，我们必须将该函数添加到对象中，就像颜色值一样。我们可以使用前面创建的参数对象添加一个旋转属性，其中包含将使立方体产生动画效果的函数:
```js
const parameters = {
    color: 0xff0000,
    spin: () =>
    {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    }
}
```
然后我们可以把它添加到GUI中：
```js
gui.add(parameters, 'spin')
```

## 小贴士
建议在过程中随时添加GUI参数，如果你想到最后再添加，那么你可能最终根本什么都没添加。