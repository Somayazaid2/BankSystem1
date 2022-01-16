const readDataFromStorage = () => {
    let data
    try{
        data = JSON.parse(localStorage.getItem('users'))
        if(!Array.isArray(data)) throw new Error('data isn\'t array')
    }
    catch(exp){
        data=[]
    }
    return data
}
const setDataToStorage = (myData) => {
    if(!Array.isArray(myData)) myData=[]
    myData = JSON.stringify(myData)
    localStorage.setItem('users', myData)
}
const content= document.querySelector("#content")
const addUser = document.querySelector('#addUser')
const single = document.querySelector("#single")
const userMainHeads = [
    { name:"accountNum",dataStore:"value",  default:null, isDefault:true},
    { name:"name", dataStore:"value",default:null, isDefault:false},
    { name:"address", dataStore:"value",default:null, isDefault:false},
    { name:"phone", dataStore:"value",default:null, isDefault:false},
    { name:"intialBalance", dataStore:"value",default:null, isDefault:false},
]
if(addUser){
    addUser.addEventListener("submit", function(e){
        e.preventDefault()
        const usersData=readDataFromStorage()
        const accountNum=5000
        let newAccountNum=usersData.length
        if(newAccountNum!==0){
          newAccountNum=newAccountNum-1
          id=usersData[newAccountNum].accountNum
        }else{
          newAccountNum=newAccountNum
          id=4999
        }
        const user = {transaction:[]}
        userMainHeads.forEach(head => {
            if(head.isDefault) user[head.name]=id+1
            else user[head.name]=this.elements[head.name][head.dataStore]
        });
        usersData.push(user)
        this.reset()
        setDataToStorage(usersData)
        window.location.replace("index.html")
    })
}
const createMyOwnElement = (element, parent, classes="", textContent="",attributes=[])=>{
    const el = document.createElement(element)
    parent.appendChild(el)
    if(classes!="") el.classList = classes
    if(textContent!="") el.textContent = textContent
    attributes.forEach(attribute=>{
        el.setAttribute(attribute.attName, attribute.attrVal)
    })
    return el
}
drawItems = () =>{
    content.innerHTML=""
    const usersData=readDataFromStorage()
    if(usersData.length==0){
        const tr = createMyOwnElement('tr',content, "alert alert-danger text-center")
        createMyOwnElement('td', tr,"", "No Users Yet", [{attName:"colspan", attrVal:7}] )
    }
    else{
     usersData.forEach((user, i)=>{
      const tr = createMyOwnElement('tr',content)
      userMainHeads.forEach( head=> createMyOwnElement('td', tr,"",user[head.name]) )
      const td = createMyOwnElement('td',tr)
      const delBtn = createMyOwnElement('button', td, "btn btn-danger mx-3", "delete")
      delBtn.addEventListener('click', (e)=> deleteUser(usersData, user.accountNum))
      const editBtn = createMyOwnElement('button', td, "btn btn-warning mx-3", "Edit")
      editBtn.addEventListener('click', (e)=> edit(i))
      const showBtn = createMyOwnElement('button', td, "btn btn-primary mx-3", "Show")
      showBtn.addEventListener("click", (e)=> show(user))
      const transActionBtn = createMyOwnElement('button', td, "btn btn-success mx-3", "Transaction")
      transActionBtn.addEventListener("click", (e)=> transaction(i))
    })
    }
}

if(content) drawItems()
deleteUser= (usersData, accountNum, tr) =>{
    newData = usersData.filter(u=> u.accountNum != accountNum)
    setDataToStorage(newData)
     drawItems()
}

show=(user)=>{
localStorage.setItem("user", JSON.stringify(user))
window.location.replace("single.html")
}
edit=(index)=>{
    localStorage.setItem('editIndex', index)
    window.location.replace("edit.html")
}
transaction=(addWithdraw)=>{
    localStorage.setItem('transactionIndex',addWithdraw)
    window.location.replace("transaction.html")
}
if(single){
    try
    {
        let user = JSON.parse(localStorage.getItem("user"))
        if(!user) throw new Error()
    const tr = createMyOwnElement('tr',single)
    userMainHeads.forEach( head=> createMyOwnElement('td', tr,"",user[head.name]) )
    const td = createMyOwnElement('td',tr)
    /*const delBtn = createMyOwnElement('button', td, "btn btn-danger mx-3", "delete")
    delBtn.addEventListener('click', ()=> deleteUser(usersData, user.accountNum))*/
    /*const editBtn = createMyOwnElement('button', td, "btn btn-warning mx-3", "Edit")
    editBtn.addEventListener('click', (e)=> edit(user))*/
    /*const showBtn = createMyOwnElement('button', td, "btn btn-primary mx-3", "Show")
    showBtn.addEventListener("click", (e)=> show(user))*/
    const transActionBtn = createMyOwnElement('button', td, "btn btn-success mx-3", "Transaction")
    transActionBtn.addEventListener("click", (e)=> transaction())
    }
    catch(e){
        const tr = createMyOwnElement('tr',single, "alert alert-danger text-center")
        createMyOwnElement('td', tr,"", "No Users Yet", [{attName:"colspan", attrVal:7}] )
    }
}
const editForm= document.querySelector("#editForm")
if(editForm){
    const usersData=readDataFromStorage()
    let id = localStorage.getItem('editIndex')
    let user = usersData[id]
    userMainHeads.forEach(head => {
     editForm.elements[head.name][head.dataStore]=user[head.name]
    });
    editForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        userMainHeads.forEach(head => {
            if(!head.isDefault)
            usersData[id][head.name]=editForm.elements[head.name][head.dataStore]
        });
       setDataToStorage(usersData)
       window.location.replace("index.html")
    })
}
const clientTranactions=[
  {name:"transactionValue",dataStore:"value",  default:null, isDefault:true},
  {name:"addWithdraw",dataStore:"value",  default:null, isDefault:true},
]

transactionForm= document.querySelector("#transactionInYourAccount")
if(transactionForm){
    transactionForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        const usersData=readDataFromStorage()
        let clients=[]
        clientTranactions.forEach(custm => {
        if(custm.isDefault) clients[custm.name]=transactionForm.elements[custm.name][custm.dataStore]
        });
       usersData.push(clients[transaction])
       setDataToStorage(usersData)
       window.location.replace("single.html")
    })
}
const singleTrans=document.querySelector('#singleTrans')
if(singleTrans){
    try
    {
        let clients = JSON.parse(localStorage.getItem("clients"))
        if(!clients) throw new Error()
    const tr = createMyOwnElement('tr',singleTrans)
    clientTranactions.forEach( custm=> createMyOwnElement('td', tr,"",clients[custm.name]) )
    const td = createMyOwnElement('td',tr)
    }
    catch(e){
        const tr = createMyOwnElement('tr',singleTrans, "alert alert-danger text-center")
        createMyOwnElement('td', tr,"", "No transactions Yet", [{attName:"colspan", attrVal:2}] )
    }
}
/*
transactionForm= document.querySelector("#transactionInYourAccount")
if(transactionForm){
    const usersData=readDataFromStorage()
    let accountNum = localStorage.getItem('editIndex')
    let clients = usersData[accountNum]
    transactionForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        const usersData=readDataFromStorage()
        let clients={}
        clientTranactions.forEach(custm => {
          if(custm.isDefault) clients[custm.name]=transactionForm.elements[custm.name][custm.dataStore]
        });
       setDataToStorage(usersData)
       window.location.replace("single.html")
    })
}
const singleTrans=document.querySelector('#singleTrans')
if(singleTrans){
    try
    {
        let clients = JSON.parse(localStorage.getItem("addWithdraw"))
        if(!clients) throw new Error()
    const tr = createMyOwnElement('tr',clients)
    clientTranactions.forEach( custm=> createMyOwnElement('td', tr,"",clientTranactions[custm.name]) )
    const td = createMyOwnElement('td',tr)
    }
    catch(e){
        const tr = createMyOwnElement('tr',singleTrans, "alert alert-danger text-center")
        createMyOwnElement('td', tr,"", "No transactions Yet", [{attName:"colspan", attrVal:2}] )
    }
}
*/
