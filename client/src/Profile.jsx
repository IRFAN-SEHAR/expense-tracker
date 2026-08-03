import React , {useState} from "react";
import { API_URL } from "./config"
function Profile(props){
    const [profilePic , setProfilePic] = useState(null);
    function handleChange(e){
        const file = e.target.files[0]
        if(file){
            setProfilePic(URL.createObjectURL(file))
             const formData = new FormData();

    formData.append("profile" , file);
    fetch(`${API_URL}/upload-profile`, {
        method:"PUT",
        body:formData,
        credentials:"include",
    })
    .then((res)=>console.log("upload successfull by react!!"))
    .catch((error) => {
    console.error("Error uploading in React!!", error);
});
        }

    }
   const imageSrc =
    profilePic ||
    (
  props.user?.profile_picture
    ? props.user.profile_picture.startsWith("http")
      ? props.user.profile_picture
      : `${API_URL}${props.user.profile_picture}`
    : "https://placehold.co/150");  
    //  console.log(props.user.profile_picture);
console.log(imageSrc);
 return(
   <div className="profile-card">
    <img className="profile-avatar" src={imageSrc} alt="profile pic" />
    <p className="profile-label">select profile picture</p>
    <input className="profile-upload" type="file" accept="image/*" onChange={handleChange} />

   </div>
 )   
}
export default Profile;
