const { redirect } = require('express/lib/response')
const dbConnection = require('../../models/mongoDb')
const ValiadtorController= require("./validator.controller")
class Client{
    static showAll = (req, res) => {
        dbConnection((err,client,db)=>{
            db.collection('data').find().toArray((error,result)=>{
                if(err) return redirect('/err')
                const data = result
                const isEmpty = data.length==0
                client.close()
                res.render("home", {pageTitle: "All Clients", data, isEmpty})
            })

        })
    }
    //get method
    static addClient = (req, res)=>{
       if(Object.keys(req.query).length != 0) {
            let user = req.query
            dbConnection((err,client,db)=>{
                db.collection().insertOne(user,(error,result)=>{
                    if(err) return redirect('/err')
                    const data=result
                    if(data.length == 0) user.accNum=5000
                    else user.accNum = data[data.length-1].accNum +1
                    client.close()
                    res.redirect('/')
                })
            })
        }
        res.render("add", {pageTitle:"Add New Client"})
    }
    //post method
    static addClientPost = (req, res)=>{
        const user = {accNum:"",name:"", address:"", phone:"", intialBalance:""}
        res.render("addPost", {pageTitle:"add new Client(POST)", user, errors:{}})
    }
    static addClientLogic = (req,res)=>{
        let user = req.body
        let errors ={}
        if(!ValiadtorController.isEmptyString(user.name)) 
            errors.name="name is required"
        if(!ValiadtorController.isValidPhone(user.phone)) 
            errors.phone="phone number is required"
        if(Object.keys(errors).length>0) 
            return res.render('addPost', {
                pageTitle:"add new Client",
                errors,
                user
            })
            dbConnection((err,client,db)=>{
                db.collection().insertOne(user,(error,result)=>{
                    if(err) return redirect('/err')
                    const data=result
                    if(data.length == 0) user.accNum=5000
                    else user.accNum = data[data.length-1].accNum +1
                    client.close()
                    res.redirect('/')
                })
            })
    }
    static searchClientByAccNum = (accNum, data)=>{
        let userIndex = data.findIndex(el=> el.accNum == accNum)
        return userIndex
    }
    static singleClient = (req,res) => {
        let isNotFound = false
        const accNum = req.params.accNum
        dbConnection((error,client,db)=>{
            db.collection('data').findOne({_id: new ObjectID(accNum)},
            (error,result)=>{
                if(error) return redirect('/err')
                const data=result
                client.close()
                res.render("single", {
                    pageTitle: "Clients Details", 
                    user:data, 
                    isNotFound
                })

            })
    })
}
    static editClient = (req,res)=>{
        let isNotFound = false
        const accNum = req.params.accNum
        dbConnection((error,client,db)=>{
            db.collection('data').findOne({_id: new ObjectId(accNum)},(error,result)=>{
                if(err) return redirect('/err')
                const data=result
                client.close()
                res.render("edit", {
                    pageTitle:"Edit Client Details", 
                    user:data, 
                    isNotFound
                })

            })
        })
    }
    static editClientLogic  = (req,res) => {
        const accNum=req.params.accNum
        const data = req.body
        dbConnection((error,client,db)=>{
            db.collection('data').replaceOne({_id: new ObjectId(accNum)},data,(error,result)=>{
                if(error) return redirect('/err')
                client.close()
                res.redirect('/')
 
            })
        })
    }

    static deleteClient = (req,res)=>{
        const accNum = req.params.accNum
        dbConnection((error,client,db)=>{
            db.collection('data').deleteOne({_id: new ObjectId(accNum)},(error,result)=>{
                if(error) return redirect('/err')
                client.close()
                res.redirect('/')
 
            })
        })
    }

      static transActionAdd=(req,res)=>{
        const accNum =req.params.accNum
        res.render('transactionadd')
      }
      static transActionAddLogic=(req,res)=>{
        const accNum=req.params.accNum
        const transactionValue = req.body.value
        dbConnection((error,client,db)=>{
            db.collection('data').findOne({_id: new ObjectId(accNum)},(error,result)=>{
                if(error) return redirect('/err')
                const data=result
                client.close()
                res.redirect("/single/:accNum")
 
            })
        })
      }
      static transactionWithdraw=(req,res)=>{
        res.render("transactionWithdraw")
      }
      static transactionWithdrawLogic=(req,res)=>{
        const transactionValue = req.body.value
        const accNum=req.params.accNum
        dbConnection((error,client,db)=>{
            db.collection('data').findOne({_id: new ObjectId(accNum)},(error,result)=>{
                if(error) return redirect('/err')
                const data=result
                client.close()
                res.redirect("/single/:accNum")
 
            })
        })

    }
}
module.exports = Client