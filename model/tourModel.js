const mongoose = require("mongoose");
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true
  },
  slug:String,
  ratingsAverage:{
type:Number,
default:4.5,
min:[1, 'Rating must be above 1.0'],
max:[1, 'Rating must be below 5.0']
  },
  ratingsQuantity:{
type:Number,
default:0
  },
  rating: {
    type: Number,
    default:0
  },
  difficulty:{
      type:String,
     require:[true,'Please input the Difficulty']
  },
  description:{
type:String,
trim:true
  },
  MaxGroupSize:{
      type:Number,
      required:[true,' A Tour must have a group size,please your group size']
  },
  Duration:{
      type:Number,
    required:[true,'A Tour must have a duration,Please specify the duration']
  },
  secretTour:Boolean,
  price: {
    type: Number,
    required: true
  },
  priceDiscount: Number,
  imageCover:{//just the name of the image and read from the fileSystem and a reference stored in the DB
type:String,//image is stored i the fs and a ref is stored in the DB
required:[true, 'A tour must have a cover image']

  },
  images:[String],//an array of strings
createdAt:{
  type:Date,
  default:Date.now(),
  select:false
},
startDates:[Dates],
summary:{
  type:String,
  trim:true,
  required:[true,'A tour must have a summary ']
  //not on the website 
},

},{
  toJSON:{ virtuals:true},
  toObject:{virtuals:true}
});
//Virtual properties - can be derived  from one another thus not necessary to store in Db

tourSchema.virtual('durationWeeks').get(function(){
  return this.Duration/7
});

//b4 .save() and .create() but not insertMany()
tourSchema.pre('save',function(next){ //this is pointing to the currently saved Doc

  this.slug = slugify(this.name, {lower:true})
  next()
})

tourSchema.pre(/^find/,function(next){
  this.find({secretTour:{ $ne:true}})
  this.start = Date.now()
  next()
})

tourSchema.post(/^find/,function(docs,next){
  console.log(`QUery took ${Date.now()- this.start}  milliseconds}`)
  next()
})

tourSchema.pre('aggregate',function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
  console.log(this.pipeline())
  next()
})


const Tour = mongoose.model('Tour',tourSchema)
module.exports = Tour

//mongooses middleware types
// document- acts on currently processed middleware
// query
// aggregate
// model