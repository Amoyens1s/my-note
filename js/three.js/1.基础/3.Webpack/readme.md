# 为什么要用Webpack
使用`<script>`引入的three.js有很多限制，我们无法获得代码提示，如果想要开发，你需要记住许多的api，或者不断查阅文档，这对效率是一个很大的影响。另一方面，我们并没有用到three.js中的所有东西，但用标签引入时候全部引入了，导致我们最后的成品体积比较大。

使用构建工具可以解决这个问题，这里我们选用Webpack，它不仅是最热门的构建工具，而且能完美满足我们的需求。