import React, {useState , useEffect} from "react";
function ShowExpense(props){
  const [isEditing , setIsEditing] = useState(false);
  const [selectDate, setSelectDate] =useState();
const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];


  // const [title , setTitle] =useState(props.title);
  // const [category , setCategory] = useState(props.category);
  // const [amount , setAmount] = useState(props.amount);
  // const [expenseDate , setExpenseDate] = useState(props.expenseDate);

  const [expense , setExpense] = useState({
    title: props.title,
    category: props.category,
    amount: props.amount,
    expenseDate: props.expenseDate,
  })
  function handleChanges(e){
    
const {name , value} = e.target
 if ((name === "title" || name === "category") && !/^[A-Za-z ]*$/.test(value)) {
        return;
    }
setExpense(prev=>{
  return({
    ...prev,
    [name] : value
 })
});

  }
   function handleClicks(event){
    event.preventDefault();
          if (
    !expense.title ||
    !expense.category ||
    !expense.amount ||
    !expense.expenseDate
  ) {
    alert("Please fill all fields");
    return;
  }
  props.onUpdate(props.id , expense);setIsEditing(false)
   }

  
    return(
        <div>
        <select>
  {months.map((month, index) => (
    <option key={index} value={index}>
      {month}
    </option>
  ))}
</select>
          {isEditing ? (
            <form >
               <label htmlFor="title">title</label>
            <input   value={expense.title}  onChange={handleChanges} type="title" id="title" name="title" pattern="[A-Za-z]+" maxLength={50} title="only letters and spacial allowed!" placeholder="add title. e.g burger," required/>
            <label htmlFor="category">category</label>
            <input  value={expense.category} onChange={handleChanges} type="category"  id="category" name="category" pattern="[A-Za-z]+" maxLength={50} title="only letters and spacial allowed!" placeholder="add category e,g food," required/>
            <label htmlFor="amount">amount</label>
            <input value={expense.amount}  onChange={handleChanges} min={0} type="number" id="amount" name="amount" placeholder=" in Rs e.g 500rs" required/>
            <label htmlFor="expenseDate">expense date</label>
            <input value={expense.expenseDate} onChange={handleChanges}  type="date" name="expenseDate" id="expenseDate" required />
            <button type="submit" onClick={handleClicks}>save</button>
            </form>
          ):(
            <>
             <p>{props.title}</p>
              <p>{props.category}</p>
                <p>{props.amount}</p>
                  <p>{props.expenseDate}</p>
                  <button onClick={()=>props.onDelete(props.id)}>delete</button>
                  <button onClick={()=>setIsEditing(true)} >update</button>
                  </>
          )}
           
            </div>
    )
};
export default ShowExpense;