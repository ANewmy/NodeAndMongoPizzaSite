
var app=angular.module("cartApp",[]);
app.controller('cartCtrl', function($scope,$http,$window){
    // Q1) add two more pizza objects 
    $http({
  method: 'GET',
  url: '/menu'
}).then(function successCallback(response) {
	console.log('get response: ',response)
    $scope.pizzas=response.data
  }, function errorCallback(response) {
    $scope.pizzas=[]
  });
   
   // $scope.phone=""
   // $scope.email=""
    $scope.msg="Items in cart"
    // add two variables: cart, and total for web page cart.html
 	$scope.cart=JSON.parse(localStorage.getItem("cart"))
    if($scope.cart==null)
    {
        $scope.cart=[]
        $scope.total=0.0
        $scope.numItems=0
    }
    else
    {
        $scope.numItems=$scope.cart.reduce((total, item) => total + item.quantity,0)
        //update totalPrice in Q5
    }


//Q2: addToCart() function
$scope.addToCart=function(item){
	console.log('testing')
    let index=$scope.cart.findIndex(x=>x.pizzaName==item.pizzaName)
    if(index==-1)//-1 means item is not in the cart
    {
        item.quantity=1
        //item has 4 properties: name, price, image, and quantity
        $scope.cart.push(item)
    }
    else
        $scope.cart[index].quantity+=1

    $scope.numItems+=1

    localStorage.setItem("cart", JSON.stringify($scope.cart))
    //store cart locally, so every wweb page can access it locally
}

//Q3: removeFromCart() function


//Q4: clearCart() function
$scope.clearCart=function(){
    //clear cart, numItems, and local storage
    $scope.cart.splice(0, $scope.numItems)
    $scope.numItems=0
    $scope.total=0
    localStorage.clear()
}

//Q5: calcTotalPrice() function


//checkout function: redirect to checkout.html	
$scope.checkout=function() {
    $window.location.href = '/checkout.html';
}

//placeOrder: send cart, phone and email to the server. 
$scope.placeOrder=function() {
    var checkoutData=[]

    checkoutData.push($scope.cart)
    checkoutData.push([{customerID:$scope.phone},{email:$scope.email}])
    console.log('checkout Data: ',checkoutData)
    $http({
        method: 'POST',
        url: '/placeOrder',
        data:checkoutData,
    }).then(function successCallback(response) {
        $scope.msg="Your order has been received! Thank you!"
        $scope.clearCart()
    }, function errorCallback(response) {
    	console.log('placeOrder().response.error: ',response)
        $scope.msg="Sorry, server problem, try again!"
    });
}  
})