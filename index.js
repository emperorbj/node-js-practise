// let firstName = 'opatola';
// let surname = 'bolaji';
// let job = 'CEO of infinity Tech';

// console.log(`I am ${firstName} ${surname} am a ${job}`)


// USING A NODE MODULE FOR FILE SYSTEM (FS)

// const fileSystem = require('fs');
// READING FROM A FILE
// const read = fileSystem.readFileSync('docs.txt', 'utf-8');
// console.log(read)
// // WRITING INTO A FILE
// let date = new Date()
// const textIn = `You are welcome to this hub. \n ${read} as of ${date}`
// fileSystem.writeFileSync('docs.txt', textIn)
// console.log('hurray file written successfully 🎉🎉🌹');

// WRITING OR READING FILES ASYNCHRONOUSLY

// fileSystem.readFile('read.txt','utf-8', (err,data1) => (
//     fileSystem.readFile(`${data1}.txt`,'utf-8', (err,data2)=>{
//         if(err) return console.log('error loading file❌❌')
//         console.log(data2)
//         fileSystem.writeFile('write.txt',`${data1}\n ${data2}`, 'utf-8', (err)=>{
//             console.log('FILE WRITTEN SUCCESLLY🎈✨🎉🎉')
//         })
//     })
// ))

// USING THE HTTP MODULE TO RENDER A SERVER

// const http = require('http');
// ROUTING
// const url = require('url');
// const server = http.createServer((request,response)=>{
//     console.log(request.url)
//     // routing with query parameters
//     const path = request.url
//     if(path === '/about'){
//         response.end('This is where you can find all about me🍕🍔🍟')
//     } else if(path === '/product'){
//         response.end('WE GOT PRODUCTS HERE🧨✨🎎🎟🎠🛒')
//     } else{
//         response.writeHead(404,{
//             'content-type' : 'text/html'
//         });
//         response.end('<h1>error 404 found</h1>')
//     };
// })
// server.listen(8000, '127.0.0.1', ()=>{
//     console.log('you are listening to port 8000')
// })

// BUILDING A SIMPLE API ASYNCHRONOUSLY

// const url = require('url')


// const server2 = http.createServer((request,response)=>{
//     const path = request.url
//     if(path === '/product'){
//         //reading json file 
//         fs.readFile('data.json','utf-8',(err,data3)=>{
//             //parsing json into javascript
//             const productData = JSON.parse(data3)
//             console.log(productData)
//             response.writeHead(200,{'content-type':'application/json'})
//             response.end(data3)
//         })
//         // response.end('API')
//     }
// })

// server2.listen(8000,'127.0.0.1', ()=>{
//     console.log('server 2 running')
// })



// BUILDING A SIMPLE API BY READING FILES SYNCHRONOUSLY

const fs = require('fs')
const http = require('http')
const os = require('os')
const port = 8000;
const hostName = '127.0.0.1'
const file = fs.readFileSync('./data.json','utf-8')
const url = require('url')


// // console.log(os.loadavg())
const server3 = http.createServer((request,response)=>{
    
    let parsedUrl = url.parse(request.url, true);
    // CORS Protocols
    response.setHeader("Access-control-Allow-Origin", "*");
    // Making a get request
    if(parsedUrl.pathname == '/products' && request.method == 'GET' && parsedUrl.query.id===undefined){
        response.writeHead(200,{'content-type':'application/json'})
        response.end(file)
        console.log(parsedUrl)
    }
        //Making a get request with an id query parameter
else if(parsedUrl.pathname == '/products' && request.method == 'GET' && parsedUrl.query.id!=undefined){
        let productFile = JSON.parse(file)
        let product = productFile.find((product)=>{
            return product.id==parsedUrl.query.id;
        })

        if(product!=undefined)
        {
            response.writeHead(200,{'content-type':'application/json'})
            response.end(JSON.stringify(product))
        }

    else{
            response.writeHead(404,{'content-type':'text/html'})
            response.end('<h1>404 ERROR PAGE NOT FOUND</h1>')
        }
}

else if(request.method="put" && parsedUrl.pathname=="/products")
    {
        let id = parsedUrl.query.id;
        let product = '';
        request.on('data',(chunk)=>
        {
            product+=chunk;
        })

        request.on('end',()=>{
            let productsArray = JSON.parse(file);
            let productOBJ = JSON.parse(product);

            let index = productsArray.findIndex((product)=>{
                return product.id==parsedUrl.query.id
            })

            if(index!== -1)
            {
                productsArray[index]=productOBJ;

                fs.writeFile('./data.json', JSON.stringify(productsArray),(err)=>
                {
                    if(err==null)
                    {
                        response.end(JSON.stringify({"message":"product successfully updated"}))
                    }
                    else
                    {
                        response.end(JSON.stringify({"message":"product could not update"}))
                    }
                })
            }

            else
            {
                response.end(JSON.stringify({"message":"some problems"}))
            }
        })
    }
    else if(request.method=='POST' && parsedUrl.pathname=='/products'){
        let postProduct = '';
        request.on('data',(chunk)=>{
            postProduct+=chunk
        })
        request.on('end',()=>{
            console.log(postProduct)
            let productsArray=JSON.parse(file)
            let newProduct = JSON.parse(postProduct)

            productsArray.push(newProduct)

            fs.writeFile('./data.json', JSON.stringify(productsArray),(err)=>
            {
                if(err==null)
                {
                    response.end(JSON.stringify({"message":"New Product Created"}))
                }

            })
        })
        
        response.end('post request working')

    }

        else if(request.method="DELETE" && parsedUrl.pathname=="/products")
    {
        let ID = parsedUrl.query.id;
        //CONVERTS FILE FROM STRING TO JSON
        let productsArray = JSON.parse(file)
        // FINDS THE INDEX OF THE ARRAY OF PRODUCTS ACCORDIND TO THE id THAT 
        // MATCHES THE ID IN THE QUERY PARAMETERS AND STORES IT IN "INDEX"
        let index = productsArray.findIndex((product)=>
        {
            return product.id == ID

        })
        // THIS REMOVES ANY ELEMENT IN THE PRODUCT ARRAY WITH THE INDEX SPECIFIED
        productsArray.splice(index,1);
        // THIS OVERWRITES EXISTING "data.json" file WITH A NEW ONE THAT HAS A PRODUCT DELETED ACCORDING TO THEIR INDEX AND ID
        fs.writeFile('./data.json', JSON.stringify(productsArray),(err)=>
        {
            if(err==null)
            {
                response.end(JSON.stringify({"message":"product successfully deleted"}))
            }
            else
            {
                response.end(JSON.stringify({"message":"product could not deleted"}))
            }
        })
    }


})
server3.listen(port,hostName,()=>{
    console.log(`you are currently running on ${hostName}, port:${port}`)
})
