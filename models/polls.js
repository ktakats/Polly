var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var answerSchema = new Schema({
  option: {
    type: String
  },
  votes: {
    type: Number
  }
},{
  timestamps: true
});

var voterSchema=new Schema({
  ip: String
},{
  timestamps: true
});

var pollSchema=new Schema({
  question:{
    type: String,
    required: true
  },
  public: {
    type: Boolean,
    default: false
  },
  answers: [answerSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  voters: [voterSchema]
  },{
  timestamps: true
});



var Polls=mongoose.model('Poll', pollSchema);

module.exports=Polls;
