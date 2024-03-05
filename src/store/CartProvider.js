import { useReducer } from "react";
import CartContext from "./cart-context";
 
const defaultCartState = {
  items: [],
  totalAmount: 0,
};

// cartReducer is managing state as well as action like addItemToCart which is a handler function or remove item from cart.
//reducer is more descriptive of the user intent like here than manuallly updating the state using setState as in useState
// reducer takes a state and an action. the action type is passed through dispatchhandler.
//the dispatch also takes the id of the object on which
// on which action is to be performed like here on item
//the reducer function can even be put in a separate component
//the state has a default state
// /the state logiv lives elsewhere
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if(action.type==='Remove'){
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    //here id is the id key of the item to be removed
    //from there we get the index of item on which action is to be performed as below here it is existingItem
    const existingItem = state.items[existingCartItemIndex];

    const updatedTotalAmount=state.totalAmount - existingItem.price;
    let updatedItems;
    if(existingItem.amount===1){
      //.filter() gives a new array
      //here we remove the current item by filtering with the id obtained from action id that compltely removes the item whose amount is 1
      updatedItems=state.items.filter(item => item.id !== action.id)
    }else{
      //this updatedItem simply changes the quantity of existingItem by 1
      const updatedItem={...existingItem, amount:existingItem.amount-1};
      updatedItems=[...state.items];
      // here we get the final state of updatedItems of the initial state updatedItems with reduced amount by 1
      updatedItems[existingCartItemIndex]=updatedItem;

    }
    return{
      items:updatedItems,
      totalAmount:updatedTotalAmount
    }

  }
  
  if(action.type==='CLEAR'){
    return defaultCartState;
  }

//this is the fallack is case we dont have any action
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );
    //cart provider is everything
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };
  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "Remove", id: id });
  };

  const clearCartHandler=()=>{
    dispatchCartAction({type:'CLEAR'})
  }

  //cartContext is doing all thing updating the items and total Amount and it is a super component that keeps updated value and
  // accesible to cross component
  //some components write to the context and some read from the context
  //like here headercartbutton is reading numberOfCart items from cartCtx and mealitem form is writing or adding to the cart.
  //the state update logic lives elsewhere

  //will be dynamic in future
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart:clearCartHandler
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};
export default CartProvider;
