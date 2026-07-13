import React,{useState} from "react";
function AddExpense(props){
    const date = new Date().toLocaleString();
    const [items , setItems] = useState({
        title:"",
        category:"",
        amount:"",
        expense_date: "",
});
const [isAdd , setIsAdd] = useState(false);

  function handleChange(event){
    const {name , value} = event.target;
    if ((name === "title" || name === "category") && !/^[A-Za-z ]*$/.test(value)) {
        return;
    }

    setItems(prevItems => ({
        ...prevItems,
        [name]: value
    }));
}
          
     
  async  function handleClick(event){
         event.preventDefault()
          if (
    !items.title ||
    !items.category ||
    !items.amount ||
    !items.expense_date
  ) {
    alert("Please fill all fields");
    
    return;
  }

        props.onAdd({
            ...items,
            id: Date.now()

     } );
    
        await fetch(("http://localhost:3000/data"),{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(items)
            
        })

    
       

        setItems(
            {
         title:"",
        category:"",
        amount:"",
         expense_date:"",
            }
        )
        
         setIsAdd(false);
         
        
    }
    
return(
    <div>
        {isAdd ?(
    <form>
            <label htmlFor="title">title</label>
            <input onChange={handleChange} type="title" id="title" name="title" value={items.title}  pattern="[A-Za-z]+" maxLength={50} title="only letters and spacial allowed!" placeholder="add title. e.g burger," required/>
            <label htmlFor="category">category</label>
            <input onChange={handleChange} type="text" id="category" name="category" value={items.category}  pattern="[A-Za-z]+" maxLength={50} title="only letters and spacial allowed!" placeholder="add category e,g food," required/>
            <label htmlFor="amount">amount</label>
            <input onChange={handleChange} type="number" id="amount" name="amount" value={items.amount} min={0} placeholder=" in Rs e.g 500rs" required/>
            <label htmlFor="expense_date">expense date</label>
            <input onChange={handleChange} type="date" name="expense_date" id="expense_date" required />
          
           <button type="submit" onClick={(event)=>{handleClick(event)}} >save</button>
        </form>
        ):(<form>
              <button onClick={() => setIsAdd(true)} >+Add</button>
        </form>)}
    
    </div>
);
}

export default AddExpense;