import React , {useState} from "react";
function Profile(){
    const [profilePic , setProfilePic] = useState(null);
    function handleChange(e){
        const file = e.target.files[0]
        if(file){
            setProfilePic(URL.createObjectURL(file))
             const formData = new FormData();
    formData.append("profilePic" , file);
    fetch("http://localhost:3000/upload-profile", {
        method:"PUT",
        body:formData,
        credentials:"include",
    })
    .then((res)=>console.log("upload successfull by react!!"))
    .catch((res)=>console.error("error uploading in react!!" , error)
    )
        }

    }

   
 return(
   <div style={{ textAlign: "center", marginTop: "50px" }}>
    <img src={profilePic || "https://via.placeholder.com/150" } alt="profile pic"     style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid gray",
        }} />
    <p>select profile picture</p>
    <input type="file" accept="image/" onChange={handleChange} />
   </div>
 )   
}
export default Profile;