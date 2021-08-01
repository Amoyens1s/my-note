// 计算器项目
const betaCalc = {
  currentValue: 0,
  
  setValue(newValue) {
    this.currentValue = newValue;
    console.log(this.currentValue);
  },
  
  plus(addend) {
    this.setValue(this.currentValue + addend);
  },
  
  minus(subtrahend) {
    this.setValue(this.currentValue - subtrahend);
  },

  register(plugin) {
    const { name, exec } = plugin;
    this[name] = exec;
  }
};

// 使用计算器
betaCalc.setValue(3); // => 3
betaCalc.plus(3);     // => 6
betaCalc.minus(2);    // => 4

// 定义插件
const squaredPlugin = {
  name: 'squared',
  exec: function() {
    this.setValue(this.currentValue * this.currentValue)
  }
};

// 注册插件
betaCalc.register(squaredPlugin);

betaCalc.setValue(3); // => 3
betaCalc.plus(2);     // => 5
betaCalc.squared();   // => 25
betaCalc.squared();   // => 625