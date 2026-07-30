import React , {useState} from "react";
function Profile(){
    const [profilePic , setProfilePic] = useState(null);
    function handleChange(e){
        const file = e.target.files[0]
        if(file){
            setProfilePic(URL.createObjectURL(file))
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