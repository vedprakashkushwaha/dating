import React,{Component} from 'react';
import axios from "axios";

export default class Registration extends Component{
    constructor()
    {
        super()
    }


   
    uploadData = async () => {
 
       let email = document.getElementById("email").value;
    
       let fName = document.getElementById("file").value;

      
    
     
        if (fName !== "") {
         
          fName = fName.replace(/.*[\\]/, "");
  
          const data = new FormData();
          data.append("file", document.getElementById("file").files[0]);
  
          var dirPath = email + "/";
  
          await axios
            .post("http://localhost:8000/upload", data, {
              headers: { path: dirPath}
            })
            .then(res => {
              console.log(res.statusText);
            });
        }
    };
   




    render()
    {
        return(
            <div className="formDiv">
              <center>
              <br/>
              <br/> <br/> <br/>
              <div className="myForm">              
                <form action="http://localhost:8000/upload-texts"method="POST">
                  <table>
                  <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>

            

                  <tr> <td>First Name</td>        <td>&nbsp;</td>            <td><input type="text" name="fname" id="fname" required/></td>         </tr>
                  <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>



                  <tr> <td>Last Name</td>        <td>&nbsp;</td>            <td><input type="text" name="lname" id="lname"required /></td>         </tr>
                  <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>

                  
            
                  <tr> <td>Email Id</td>        <td>&nbsp;</td>            <td><input type="email" name="email" id="email" required /></td>         </tr>
                  <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>



                  <tr> <td>Password</td>        <td>&nbsp;</td>            <td><input type="password" name="pass"  id="pass" required /></td>         </tr>
                  <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>

                  
                  
                  <tr> <td>Re-Password</td>        <td>&nbsp;</td>            <td><input type="password" name="rpass" id="rpass" required /></td>          </tr>
                  <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>

                  
                  <tr> <td>Gender</td>        <td>&nbsp;</td>            <td><input type="radio" name="sex" value="male" id="sex"checked/> <label>Male</label> </td>         </tr>
                  <tr> <td>&nbsp;</td>        <td>&nbsp;</td>            <td><input type="radio" name="sex" value="female" id="sex"/> <label>Female</label> </td>         </tr>

                  <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>
                  <tr> <td>Age</td>        <td>&nbsp;</td>            <td><input type="text" name="age" id="age" required /></td>          </tr>
                  <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>
            
                 <tr> <td>Photo</td>        <td>&nbsp;</td>            <td><input type="file" name="file" id="file" required/></td>          </tr>
                 <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>



                 <tr> <td> <input type="reset"/> </td><td>&nbsp;</td><td><button onClick={async () => {await this.uploadData();}} >Submit</button>    </td></tr>
                 <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>





             

                 </table>
                 </form>
                </div>
                <br/><br/>
              </center>
              
            </div>

        );
    }
}