import React,{useState,useEffect} from "react";
function CalculateExpense(props){
    const [items , setItems]=([]);
    useEffect(()=>{
        getData();
    });
   async function  getData(){
    try {
        const response = await fetch(`http://localhost:3000/data`)
        const result = await response.json()
        setItems(result);
    } catch (error) {
        console.log(error);
    }
        
    }
return(
    <div>
        <p>Total of this month </p>
        <p>Total of this year</p>
    </div>
);
};

export default CalculateExpense;