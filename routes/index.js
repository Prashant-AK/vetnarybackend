var express = require('express');
var router = express.Router();
const jwt =require('jsonwebtoken')
const bcrypt=require('bcrypt')
const auth = require("../middlewares/jwt");
const User =require('../models/UserModel')
const Doctor=require('../models/DoctorModel')

router.post("/register", async (req, res) => {
  try {
    const { fullName, fatherName, email, password, aadhar_number,dob,mobile_number,address,location,no_animal_holding } = req.body;
    if (!(email && password && fullName && fatherName)) {
      res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName, 
      fatherName,
      aadhar_number,
      dob,
      mobile_number,
      address,
      location,
      email: email.toLowerCase(),
      password: encryptedPassword,
      no_animal_holding
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }

});


router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});



router.post('/create-doctor',async (req,res)=>{
  const {fullName,email,address,mobno}=req.body;
  try{
  const oldUser = await Doctor.findOne({ email });

  if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }
  const doc = await Doctor.create({
    fullName, 
    address,
    email: email.toLowerCase(),
    mobno,
  });

  res.status(200).send(doc)
  }
  catch(error){
    console.log(error)
  }
})

// get doctor list from the database and also check the user should be login
router.get('/doctor',auth,async (req,res)=>{
try{
  const data= await Doctor.find()

  res.status(200).send(data)
}catch(error){
  console.log(error)
}
  
})


module.exports = router;
