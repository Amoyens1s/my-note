import { readdirSync } from "fs";
function listFile(dir){
	return readdirSync(dir);
}
 
const res = listFile("./plugins");
res.map(async file => {
  let {Plugin} = await import(`./plugins/${file}/main.js`);
  const plugin = new Plugin;
  plugin.load();
})