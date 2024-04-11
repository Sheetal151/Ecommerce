
const Product=require("./models/product");
const { productSchema } = require("./schema");
const { reviewSchema } = require("./schema");

const validateProduct = (req,res,next)=>{
    const {name, img, price , desc} = req.body;
    const {error} = productSchema.validate({name,img,price,desc});
    
    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    next();
}

const validateReview = (req,res,next)=>{

    const {rating, comment} = req.body;
    const {error} = reviewSchema.validate({rating,comment});

    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    next();
}
  const isLoggedIn=(req,res,next) =>{
    
    if(req.xhr && !req.isAuthenticated()){
      //return res.redirect('/login')
      return res.status(401).send('unauthorised');

       //return  res.error({msg: 'you need to login first'})
    }
    if(!req.isAuthenticated()){
        req.flash('error','You need to login first');
        return res.redirect('/login')
    }
    next();
  }

  const isSeller = (req,res,next) =>{
    let{id}=req.params;
    if(!req.user.role){
        req.flash('error','You dont have the permissions');
        return res.redirect('/products')
        
    } else if(req.user.role!== "seller"){
        req.flash('error','You dont have the permissions');
        return res.redirect(`/products/${id}`)
    }
    next();
  }

    const isProductAuther = async(req, res,next)=>{
      let{id}=req.params;
      let product =  await Product.findById(id);
      console.log(product.author, 'author');
      console.log(req.user , 'user');
      if(!product.author.equals(req.user._id)){
        req.flash('error', 'you are not the owner of this product');
        return res.redirect(`/product/${id}`)
      }
     next() ;

  }

module.exports = {validateProduct ,validateReview  , isLoggedIn, isSeller,isProductAuther} ;