import axios from 'axios'

axios('http://localhost:3000/cpu/usage').then((res) => {
  console.log(res.data)
}).catch(console.log);