import React , {useState , useEffect} from "react";
import axios from "axios";
import "./App.css";
import AddExpense from "./AddExpense";
import ShowExpense from "./ShowExpense";
import Header from "./Header";
import Footer from "./Footer";
import Register from "./Register";
import Login from "./Login";
function App(){
  const [item , setItem] = useState([]);
  const [total , setTotal]=useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const months = [
  "All","January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];
const years = [
  "2026","2025","2024","2023" , "2022" , "2021" , "2020"
]
function addItems(newItem){
  setItem(prevItem =>{  
    return(
      [...prevItem , newItem]
    )
  });
}
useEffect(()=>{


    getData();

},[selectedMonth , selectedYear]);
  async function getData() {
    try {
      const response = await fetch(`http://localhost:3000/data?month=${selectedMonth}&year=${selectedYear}`,
        {
            credentials: "include",
        }
      );
      const result = await response.json();
      setItem(result.expenses);
      setTotal(result.total);

      console.log(result.expenses);
      console.log(result.total)
    } catch (err) {
      console.error(err);
    }
  }




function del(id){
fetch(`http://localhost:3000/data/${id}`,{
  method:"DELETE",
credentials: "include"
})
.then(res=>res.json())
.then(()=>{
   setItem(prevItem=>{
    return(
      item.filter((x)=>x.id !==id)           
    )
  });
})
};

function update(id , updateNote){
  fetch((`http://localhost:3000/data/${id}`),{
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
    },
    credentials: "include",
    body:JSON.stringify(updateNote)
    
    
  })
  .then(res=>res.json())
  .then(()=>{
setItem(prev=>
    prev.map(note=>
      note.id ==id
      ? {...note , ...updateNote}
      : note
    )
  

  )
  })
}
  return(
    <div>
      <Login/>
      <Register />
       <Header/>
      <AddExpense onAdd={addItems}/>
             <select value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)}>
  {/* <option value="">All</option> */}
  {months.map((month, index) => (
    <option key={index} value={index}>
      {month}
    </option>
  ))}
</select>

<select value={selectedYear} onChange={(e)=>setSelectedYear(e.target.value)}>
  <option value="">All</option>
  {years.map((year , index)=>(
<option key={index} value={year}>
  {year}
</option>    
  ))}
</select>
<h2>Total Expense: Rs. {total ?? 0}</h2>
      {item.map((e , index)=>(
          <ShowExpense
          key={index}
          id={e.id}
          title={e.title}
          category={e.category}
          amount={e.amount}
          expense_date={new Date(e.expense_date).toLocaleDateString("en-CA")}
          onDelete={del}
          onUpdate={update}
          />
      ))}
      
     
      <Footer/>
    </div>
  )
};
 export default App;