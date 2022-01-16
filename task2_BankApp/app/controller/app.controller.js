const fs = require("fs")
const ValiadtorController= require("./validator.controller")
const readFromJSON = () =>{
    let data
    try{
        data = JSON.parse(fs.readFileSync('./models/data.json'))
        if(!Array.isArray(data)) throw new Error()
    }
    catch(e){
        data = []
    }
    return data
}
const writeDataToJSON = (data) =>{
    try{
        fs.writeFileSync("./models/data.json", JSON.stringify(data))
    }
    catch(e){
        console.log(e.message)
    }
}
class Client{
    static showAll = (req, res) => {
        const data = readFromJSON()
        const isEmpty = data.length==0
        res.render("home", {pageTitle: "All Clients", data, isEmpty})
    }
    //get method
    static addClient = (req, res)=>{
       if(Object.keys(req.query).length != 0) {
            const data = readFromJSON()
            let user = req.query
            if(data.length == 0) user.accNum=5000
            else user.accNum = data[data.length-1].accNum +1
            data.push(user) 
            writeDataToJSON(data)
            res.redirect("/")
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
        //"" 0 +> false     12+=> true
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
        const data = readFromJSON()
        if(data.length == 0) user.accNum=5000
        else user.accNum = data[data.length-1].accNum +1
        data.push(user) 
        writeDataToJSON(data)
        res.redirect("/")
    }
    static searchClientByAccNum = (accNum, data)=>{
        let userIndex = data.findIndex(el=> el.accNum == accNum)
        return userIndex
    }
    static singleClient = (req,res) => {
        let isNotFound = false
        const accNum = req.params.accNum
        const data = readFromJSON()
        const userIndex = this.searchClientByAccNum(accNum, data)
        if(userIndex==-1) isNotFound=true
        res.render("single", {
            pageTitle: "Clients Details", 
            user:data[userIndex], 
            isNotFound
        })
    }

    static editClient = (req,res)=>{
        let isNotFound = false
        const accNum = req.params.accNum
        const data = readFromJSON()
        const userIndex = this.searchClientByAccNum(accNum, data)
        if(userIndex==-1) isNotFound=true
        res.render("edit", {
            pageTitle:"Edit Client Details", 
            user:data[userIndex], 
            isNotFound
        })
    }
    static editClientLogic  = (req,res) => {
        const accNum=req.params.accNum
        const data = readFromJSON()
        const userIndex = this.searchClientByAccNum(accNum,data)
        data[userIndex]={accNum,...req.body}
        data.splice(userIndex,1,data[userIndex])
        writeDataToJSON(data)
        res.redirect('/')

    }

    static deleteClient = (req,res)=>{
        const accNum = req.params.accNum
        const data = readFromJSON()
        const userIndex = this.searchClientByAccNum(accNum, data)
        if(userIndex !=-1){
            data.splice(userIndex, 1 )
            writeDataToJSON(data)
            res.redirect("/")    
        }
        else res.redirect('/err')
    }

      static transAction=(req,res)=>{
        const accNum =req.params.accNum
        res.render('transaction')
      }
      static transActionLogic=(req,res)=>{
        const accNum =req.params.accNum
        let data= readFromJSON()
        const transactionValue = req.body.value
        const userIndex=this.searchClientByAccNum(accNum,data)
        data[userIndex]={accNum,...transactionValue}
        //let data[userIndex].added=transactionValue
        //data.push(userIndex)
        writeDataToJSON(data)
        res.redirect("/single/:accNum")
    
        
      }
      static showAllTransactions = (req, res) => {
        const data = readFromJSON()
        res.render("single", {pageTitle: "Clients Details", data})
    }
      /*static transactionWithdraw=(req,res)=>{
        res.render("transactionWithdraw")
      }
      static transactionWithdrawLogic=(req,res)=>{
        const accNum=req.params.accNum
        let data=readFromJSON()
        const userIndex=this.searchClientByAccNum(accNum,data)
        const transactionValue=req.body.value
        data.push(userIndex)
       writeDataToJSON(data)
        res.redirect("/single/:accNum")
      }*/

    }

module.exports = Client