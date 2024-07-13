const cluster = require('cluster')
const express = require('express')
const os = require('os')

const totalCPUs =  os.cpus().length;

console.log(totalCPUs)

if (cluster.isMaster) {
    // Create a worker process for each CPU core
    for (let i = 0; i < totalCPUs; i++) {
      cluster.fork();
    }
  
    // Listen for when a worker exits and replace it
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    // Worker processes create an express server
    const app = express()
    const PORT = 8000

    app.get('/',(req,res)=>{
        return res.json({
            message:`Hello from express server ${process.pid}`
        })
    })

    app.listen(PORT,()=>console.log(`server started at port : ${PORT}`))
  }