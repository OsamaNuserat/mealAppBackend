import mongoose, {Schema,Types,model} from 'mongoose';
const orderSchema = new Schema ({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
    
  },
  phonenumber : [ {

      type:String,
      required:true,
  }
  ],
    Products: [{
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    qty: { type: Number,default:1, required: true },
    price:{type:Number,required:true}
    }],
    paymentMethod:{ 
        type:String,
        default:"cash",
        enum:["cash","card"]
    },
    status : {
        type:String,
        default:'pending',
        enum:["pending","delivered","cancelled","approved","onWay"]
    },
    reasonReject:String,
    note:String,
},
{
    timestamps:true
})
const orderModel = mongoose.models.Order ||  model('Order', orderSchema); 
export default orderModel;