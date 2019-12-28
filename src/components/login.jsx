import React,{Component} from 'react';
//import axios from "axios";
import Cookies from "universal-cookie";
export default class Login extends Component{
    constructor()
    {
        super()
    }
    

    loginCheck = async () => {
      
      let pass = document.getElementById("pass").value;
      let email = document.getElementById("uname").value;
      
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(email) == false) 
        {
            alert('Invalid Email Address');
            return false;
        }

        const url="http://localhost:8000/login?uname="+email+"&pass="+pass;
        const response = await fetch(url);
        const data = await response.json();
        if(data['results']==true)
        {
          
          const cookies = new Cookies();
          cookies.set('uname', email, { path: '/'});
        }
        else
        {
          alert("invalid credecial");

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
                <form method="POST" action="http://localhost:8000/login1">
                  <table>
                  <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>
                  <tr> <td>Email Id</td>        <td>&nbsp;</td>            <td><input type="email" name="uname" id="uname"/></td>         </tr>

                 <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>


                 <tr> <td>Password</td>           <td>&nbsp;</td>          <td><input type="password" name="pass" id="pass"/></td>         </tr>
                
                 <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>

                 <tr> <td> <input type="reset"/> </td>           <td>&nbsp;</td>          <td>    <button onClick={async () => {await this.loginCheck();}} >Login</button>       </td>         </tr>
                 
                 <tr> <td>&nbsp;</td> <td>&nbsp;</td>  <td>&nbsp;</td>   </tr>

                 <tr> <td colSpan="3">Not Register? <a href="/?register" > Create an account </a></td>      </tr>


                 </table>
                 </form>
                </div>
              </center>
              
            </div>

        );
    }
}