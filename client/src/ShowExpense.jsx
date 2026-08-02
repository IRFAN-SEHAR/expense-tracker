import React, {useState , useEffect} from "react";
function ShowExpense(props){
  const [isEditing , setIsEditing] = useState(false);
  const [selectDate, setSelectDate] =useState();

  const [expense , setExpense] = useState({
    title: props.title,
    category: props.category,
    amount: props.amount,
    expense_date: props.expense_date,
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
    !expense.expense_date
  ) {
    alert("Please fill all fields");
    return;
  }
  props.onUpdate(props.id , expense);setIsEditing(false)
   }

  
    return(
      
        <div className={isEditing ? "expense-card editing" : "expense-card"}>

          {isEditing ? (
            <form className="expense-form">
               <label className="field-label" htmlFor="title">title</label>
            <input className="field-input"  value={expense.title}  onChange={handleChanges} type="title" id="title" name="title" pattern="[A-Za-z]+" maxLength={50} title="only letters and spacial allowed!" placeholder="add title. e.g burger," required/>
            <label className="field-label" htmlFor="category">category</label>
            <input className="field-input"  value={expense.category} onChange={handleChanges} type="category"  id="category" name="category" pattern="[A-Za-z]+" maxLength={50} title="only letters and spacial allowed!" placeholder="add category e,g food," required/>
            <label className="field-label" htmlFor="amount">amount</label>
            <input className="field-input" value={expense.amount}  onChange={handleChanges} min={0} type="number" id="amount" name="amount" placeholder=" in Rs e.g 500rs" required/>
            <label className="field-label" htmlFor="expense_date">expense date</label>
            <input className="field-input" value={expense.expense_date} onChange={handleChanges}  type="date" name="expense_date" id="expense_date" required />
            <button className="btn btn-primary btn-block" type="submit" onClick={handleClicks}>save</button>
            </form>
          ):(
            <>
             <p>{props.title}</p>
              <p>{props.category}</p>
                <p>{props.amount}</p>
                  <p>{props.expense_date}</p>
                  <button className="btn btn-danger btn-sm" onClick={()=>props.onDelete(props.id)}>delete</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setIsEditing(true)} >update</button>
                  </>
          )}
           
            </div>
    )
};
export default ShowExpense;
