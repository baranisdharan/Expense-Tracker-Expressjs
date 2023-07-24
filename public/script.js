async function saveToCrudCrud(event) {
    try {
        event.preventDefault();        
        let candyname = event.target.candyname.value
        let description = event.target.description.value;
        let sellingprice = event.target.sellingprice.value;
        let quantity = event.target.quantity.value;
        let products = {
            candyname,
            description,
            sellingprice,
            quantity
        };
        const response = await axios.post("http://localhost:4000/expense/add-expense", products);
        console.log(response.data);
        showExpenseDetailsOnScreen(response.data);
    } catch (err) {
        document.body.innerHTML = document.body.innerHTML + "<h4> Something went wrong </h4>";
        console.log(err);
    }
}

async function showExpenseDetailsOnScreen(products) {
    try {
        let parent = document.getElementById('list-of-items');
        let child = document.createElement('li');
        child.textContent = `${products.candyname}---${products.description}---${products.sellingprice}---${products.quantity}`;

        parent.appendChild(child);

        function createBuyButton(quantityToBuy) {
            let button = document.createElement('input');
            button.type = 'button';
            button.value = `Buy ${quantityToBuy}`;
            button.classList = "btn btn-danger ms-2 rounded-pill";
            button.onclick = async () => {
              if (products.quantity >= quantityToBuy) {
                products.quantity -= quantityToBuy;
                await updateProduct(products);
                child.textContent = `${products.candyname}---${products.description}---${products.sellingprice}---${products.quantity}`;
          
                
                BuyOne.remove();
                BuyTwo.remove();
                BuyThree.remove();
          
                
                BuyOne = createBuyButton(1);
                BuyTwo = createBuyButton(2);
                BuyThree = createBuyButton(3);
          
                child.appendChild(BuyOne);
                child.appendChild(BuyTwo);
                child.appendChild(BuyThree);
              }
            };
            return button;
          }
          

        let BuyOne = createBuyButton(1);
        let BuyTwo = createBuyButton(2);
        let BuyThree = createBuyButton(3);

        child.appendChild(BuyOne);
        child.appendChild(BuyTwo);
        child.appendChild(BuyThree);

        child.classList = "list-group-item fw-bold";
        parent.classList = "mb-3 mt-3 fs-4";
        form.reset();
    } catch (error) {
        console.log(error);
    }
}


async function updateProduct(products) {
    try {
        const productId = products.id;
        const response = await axios.put(`http://localhost:4000/expense/update-expense/${productId}`, products);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

window.addEventListener("DOMContentLoaded", async (e) => {
    try {
        let response = await axios.get("http://localhost:4000/expense/get-expense");
        for (let i = 0; i < response.data.length; i++) {
            showExpenseDetailsOnScreen(response.data[i]);
        }
    } catch (error) {
        console.log(error);
    }
});