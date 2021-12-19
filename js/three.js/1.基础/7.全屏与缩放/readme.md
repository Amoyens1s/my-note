# 全屏与缩放

通常为了沉浸式的体验，我们需要将其全屏

## 调整视窗

```css
body {
  margin: 0;
  padding: 0;
}

.webgl {
  position: fixed;
  left: 0;
  top: 0;
  /* 部分系统or浏览器，可能会有蓝线 */
  outline: none;
}

html,
body {
  /* 禁用任何类型的滚动 */
  overflow: hidden;
}
```

## 缩放

如果缩放浏览器你应该已经发现了，我们的画布并没有撑满可显示区域，现在我们需要解决这个问题。

要调整画布的大小，我们首先需要知道窗口什么时候调整大小。为此，您可以监听窗口上的调整大小事件。

```js
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  // 当您更改相机属性时，比如 aspect，您还需要使用 camera.updateProjectionMatrix ()更新投影矩阵。我们稍后将讨论矩阵
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  // 最后，我们必须更新渲染器，更新渲染器会自动更新画布的宽度和高度:
  renderer.setSize(sizes.width, sizes.height);
});
```

## 处理像素比

像素比率对应于软件部分的一个像素单位在屏幕上有多少物理像素。

### 一些历史

曾经所有屏幕的像素比都是 1，一切都很正常。但是当你仔细观察屏幕时，你可以看到这些像素，这限制了图像的精确度和字体的细度。

苹果看到了机会，开始制造像素比为 2 的屏幕，称为视网膜。现在，许多厂商开始生产像素比为 2 甚至是 3 或者更高的设备。

虽然这对图像质量来说是一件好事，但是像素比为 2 意味着渲染的像素增加了 4 倍。像素比为 3 意味着渲染的像素增加了 9 倍。

你猜怎么着? 最高的像素比通常出现在最弱的设备上————手机，手机上的像素比有的甚至达到了 5。

### 处理像素比

要获得屏幕像素比率，可以使用 `window.devicePixelRatio`，要更新渲染器的像素比率，只需调用 `renderer.setPixelRatio (...)`

你可能会想简单地把设备像素比发送到这个方法，但是你最终会在高像素比的设备上面临性能问题。

像素比大于 2 主要是营销手段。你的眼睛几乎看不到 2 和 3 之间的区别，但是它会造成性能问题，更快地耗尽电量。你能做的就是把像素比限制在 2 及以下。为此，可以使用 Math.min () :

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

我们也需要把它复制一份到 resize 事件监听中，因为用户可能涉及到多个屏幕的切换，这也会触发 resize。

```js
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
```

## 全屏

既然我们已经让画布以正确的像素比率获得了所有可用的空间，现在是时候支持全屏了。

首先，我们需要决定什么行动将触发全屏模式，你可以使用`F11`来调用浏览器的全屏，但是我们将手动实现一个双击全屏。

当双击发生时，我们将切换全屏模式ーー这意味着如果窗口不在全屏模式，双击将启用全屏模式，如果窗口已经在全屏模式，双击将退出全屏模式。

```js
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
```

很不幸的是，这段代码对 safari 不起作用，为了支持 safari，我们需要一些前缀支持，至少截止到2021.12.19，它还是需要前缀的：

```js
window.addEventListener('dblclick', () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});
```

现在，在所有现代浏览器上，一切都应该正常工作。