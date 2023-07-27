async function forgotpassword(e) {
    try{
    e.preventDefault();
    const userDetails={
        email:e.target.email.value
    }
    const token = localStorage.getItem('token');
  
    console.log(userDetails)
    axios.post('http://localhost:4000/password/forgotpassword',userDetails, {headers: {"Authorization": token}}).then(response => {
        console.log(response)    
    if(response.status === 200){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
        console.log(response)
    })
    .catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
} catch(err){
    document.body.innerHTML+=`<div style="color:red;">${err}</div>`
}
}