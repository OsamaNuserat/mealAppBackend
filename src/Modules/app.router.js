
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import CategoryRouter from "./Category/category.router.js";
import CartRouter from "./Cart/Cart.router.js";
import OrderRouter from "./Order/Order.router.js";
import ReviewRouter from './Review/Review.router.js';
import cors from 'cors';
import path from 'path'; 
import {fileURLToPath} from 'url';
 const __dirname = path.dirname(fileURLToPath(import.meta.url));
 const fullPath=path.join(__dirname,'../upload');

const initApp=(app,express)=>{
    
    app.use(express.json());
    app.use(cors())
    app.get('/',(req,res)=>{
        return res.json({message:"welcome to my app"})
    })
    app.use('/upload',express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use('/category',CategoryRouter);
    app.use('/cart',CartRouter);
    app.use('/order',OrderRouter)
    app.use('/review',ReviewRouter)
    app.use('*', (req,res)=>{
        return res.json({messaga:"page not found"});
    })

    //global error handler
    app.use(globalErrorHandel)

}

export default initApp;