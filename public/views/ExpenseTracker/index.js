const show=document.getElementsByClassName('mydownload')

function addNewExpense(e){
    e.preventDefault()
    const expenseDetails={
        expenseamount : e.target.expenseamount.value,
        description : e.target.description.value,
        category : e.target.category.value
    }    
    const token=localStorage.getItem('token')
    axios.post("http://localhost:4000/expense/addexpense",expenseDetails,{headers:{"Authorization":token}})
    .then(response=>{        
        if(response.status === 201){
            addNewExpensetoUI(response.data.expense)
        }
    }).catch(err=>{
        showError(err)
    })

}

window.addEventListener("DOMContentLoaded",()=>{  
    const token  = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumusermessage()
        showLeaderboard()          
    }
    axios.get("http://localhost:4000/expense/getexpenses",{headers:{"Authorization":token}})
    .then(response =>{        
        response.data.expenses.forEach(expense=>{
            addNewExpensetoUI(expense)
        })        
    }).catch(err => {
        showError(err)
    })
})

function getExpenses(page){    
    axios.get("http://localhost:4000/expense/getexpenses")
    .then(response=>{
        response.data.expenses.forEach(expense=>{
            addNewExpensetoUI(expense)            
        })            
    })
}

function addNewExpensetoUI(expense){
    const parentElement=document.getElementById('listofExpenses')
    const expenseElemId=`expense-${expense.id}`;
    parentElement.innerHTML +=`<li id=${expenseElemId}>
    ${expense.expenseamount} - ${expense.category} - ${expense.description}
    <button id="del-button" onClick='deleteExpense(event,${expense.id})'>Delete Expense</button>
    </li>`
}

function deleteExpense(e,expenseid){   
    const token = localStorage.getItem('token') 
    axios.delete(`http://localhost:4000/expense/deleteexpense/${expenseid}`,{headers: {"Authorization" : token}})
    .then(()=>{        
        removeExpensefromUI(expenseid)
    })
    .catch((err=>{
        showError(err)
    }))
}

function removeExpensefromUI(expenseid){
    const expenseElemId=`expense-${expenseid}`
    document.getElementById(expenseElemId).remove()
}

function showError(err){
    document.body.innerHTML+=`<div style="color:red;">${err}</div>`
}

function showPremiumusermessage(){
    document.getElementById('rzp-button').style.visibility="hidden";
    document.getElementById('message').innerHTML="you are a premium user";  
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

document.getElementById('rzp-button').onclick = async function(e){
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/purchase/premiummembership',{headers:{"Authorization":token}})
    console.log(response)
    var options=
    {
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        // handler use for success payment
        "handler":async function(response){
           const res = await axios.post('http://localhost:4000/purchase/updatetransactionstatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
            },{headers:{"Authorization":token}})           
            alert('You are a premium user Now')           
            document.getElementById('rzp-button').style.visibility="hidden";
            document.getElementById('message').innerHTML="you are a premium user";
            localStorage.setItem('token',res.data.token)
            showLeaderboard()         
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment failed',function(response){
        console.log(response)
        alert('something went wrong')
    })
}

function showLeaderboard(){
    const inputElement=document.createElement("input")
    inputElement.type="button"
    inputElement.value="Show Leaderboard"
    inputElement.onclick=async()=>{
        const token=localStorage.getItem('token')
        const page =1;
        const userLeaderBoardArray = await axios.get(`http://localhost:4000/premium/showLeaderBoard`,{headers:{"Authorization":token}})
        console.log(userLeaderBoardArray)
        var LeaderboardElem=document.getElementById("leaderboard")
        LeaderboardElem.innerHTML +='<h1>Leader Board</h1>'
        userLeaderBoardArray.data.
        forEach((userDetails)=>{
            LeaderboardElem.innerHTML +=`<li>Name-${userDetails.name} TOtal Expense-${userDetails.total_cost || 0}`
        })       
    }
    document.getElementById("message").appendChild(inputElement)    
}

function download(){
    const token=localStorage.getItem('token');
    axios.get('http://localhost:4000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        console.log(response)
        if(response.status === 200){
            var a = document.createElement("a");
            a.href = response.data.fileURl;
            a.download = 'myexpense.csv';
            a.click();
            showFileURl(response.data.fileURl)
        } else {
            throw new Error(response.data.message)               
        }
    })
    .catch((err) => {
        document.body.innerHTML+=`<div style="color:red;">${err}</div>`
    });
}

function showFileURl(filelink){
    document.body.innerHTML +=`<a >${filelink}</a><br><a style="color:red">IF YOU WANT PREVIOUS  FILE COPY THE  URL</a>`}