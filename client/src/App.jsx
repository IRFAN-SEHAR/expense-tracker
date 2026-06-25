import React , {useState , useEffect} from "react";

import "./App.css";
import AddExpense from "./AddExpense";
import CalculateExpense from "./CalculateExpense";
import ShowExpense from "./ShowExpense";
import Header from "./Header";
import Footer from "./Footer";
function App(){
  const [item , setItem] = useState([]);
function addItems(newItem){
  setItem(prevItem =>{
    return(
      [...prevItem , newItem]
    )
  });
  

}
function del(id){
  setItem(prevItem=>{
    return(
      item.filter((x)=>x.id !==id)           
    )
  });
};
function update(id , updateNote){
  setItem(prev=>
    prev.map(note=>
      note.id ==id
      ? {...note , ...updateNote}
      : note
    )
  

  )
}
  return(
    <div>
       <Header/>
      <AddExpense onAdd={addItems}/>
     
      {item.map((e , index)=>(
          <ShowExpense
          key={index}
          id={e.id}
          title={e.title}
          category={e.category}
          amount={e.amount}
          expenseDate={e.expenseDate}
          onDelete={del}
          onUpdate={update}
          />
      ))}
      <CalculateExpense />
    
     
      <Footer/>
    </div>
  )
};
 export default App;