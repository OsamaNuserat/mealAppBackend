import mongoose, {Schema,Types,model} from 'mongoose';
const categorySchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
    },
   
    image:{
        type:Object,
        required:true,
    },
    description:{ 
        type:String,
        required:true,
    },
    price : {
        type:Number,
        required:true,

    },
    quantity:{ 
        type:Number,
        required:true,
    },
    type : {
        type:String,
        required:true,
        enum: ['italian','chinese','arab'],
    }
},
{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
categorySchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'categoryId'
})
const categoryModel = mongoose.models.Category ||  model('Category', categorySchema); 
export default categoryModel;