var mongoose=require( 'mongoose' );
const ImageSchema=new mongoose.Schema({
    images:
    { 
       type: [String],
        required: true 
       },
})
const image=new mongoose.model('image',ImageSchema);
module.exports=image;