var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { readdirSync } from "fs";
function listFile(dir) {
  return readdirSync(dir);
}
const res = listFile("./plugins");
res.map((file) => __async(this, null, function* () {
  let { Plugin } = yield import(`./plugins/${file}/main.js`);
  console.log(Plugin);
  const plugin = new Plugin();
  plugin.load();
}));
console.log(res);
