import { useContext, useEffect, useState } from "react";
import CartContext from "../../store/cart-context";
import CartIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css";

const HeaderCartButton = (props) => {
  const cartCtx = useContext(CartContext);

  const {items}=cartCtx;

  const numberOfCartItems = items.reduce((curNumber, item) => {
    return curNumber + item.amount;
  }, 0);
  
  const [btnIsHighlighted,setbtnIsHighlighted]=useState(false);

  const btnClasses=`${classes.button} ${btnIsHighlighted ? classes.bump: ''}`
  //dependency for the effect function. the effect is rerendered every time the dependency changes

  useEffect(()=>{
    if(items.length===0){
      return;
    }
    setbtnIsHighlighted(true);
    //we dont want the button effect to remain  highlighted
    const timer=setTimeout(()=>{
      setbtnIsHighlighted(false);
    },300)
    //clean the timer side effect
    return()=>{
      clearTimeout(timer);
    }
  },[items])

  return (
    <button onClick={props.onClick} className={btnClasses}>
      <span className={classes.icon}>
        <CartIcon />
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
};
export default HeaderCartButton;
