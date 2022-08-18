const renderTemplate = require('../../lib/renderTemplate');
const {Drug, User, userDrug} = require('../../db/models')
const router = require('express').Router();
const bcrypt = require('bcrypt');
const BasketDrugs = require('../views/BasketDrugs')
const Main = require('../views/Main');
const UserAccount = require('../views/UserAccount');
const { render } = require('react-dom');
 

router.get('/main', async (req, res) => {
   const newUser = req.session?.newUser;

   try{
   const drugs = await Drug.findAll({raw:true})
   console.log(drugs)
   renderTemplate(Main, {drugs, newUser}, res)
   }
   catch(err){
      console.log(err)
   }
   })

router.post('/drug', async (req, res) => {
   try {
      if (req.session.newUser){
         const {id} = req.body
         const userMail = req.session.newUser
         const theUser = await User.findOne({where:{mail:userMail}, raw:true})
         const theDrug = await Drug.findOne({where:{id}, raw:true})
         const newUserDrug = await userDrug.create({user_id: theUser.id, item_id:theDrug.id})
         // const newQuantity = theDrug.quantity -1
         // await theDrug.update({quantity:newQuantity}, { strict: true })
         // console.log(theDrug)
         // console.log(newQuantity)
         
         
         const successMess = "Товар добавлен в корзину"
         res.json({successMess})
      }else{
         const goRegisterMessage = 'добавлять товары в корзину могут только зарегестрированные пользователи'
         res.json({goRegisterMessage})
      }
   }
   catch(err){
      console.error(err)
   }
}).get('/drug', async (req, res) => {
   try {
      if (req.session.newUser){
         const newUser = req.session?.newUser;

         const theUser = await User.findAll({where: {mail: req.session.newUser}, include: Drug, raw:true})

         
         renderTemplate(BasketDrugs, {theUser, newUser}, res)

      }else{
         
         res.redirect('/login')
      }
   }
   catch(err){
      console.error(err)
   }
}).delete('/drug', async (req, res) => {
   const newUser = req.session?.newUser;
   const {id} = req.body
   const theUser = await User.findAll({where: {mail: req.session.newUser}, include: Drug, raw:true})
   const UserDrugToDelete = await userDrug.findOne({item_id:id})
   if (UserDrugToDelete){
      await UserDrugToDelete.destroy()
      message = {destroyed:true}
      res.json(message)
   }
   
   
})
  
  
   module.exports = router;
  