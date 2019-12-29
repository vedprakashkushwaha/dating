import React, {
    Component
} from 'react';
import Cookies from "universal-cookie";
import Axios from 'axios';


export default class DashBoard extends Component {
    constructor() {
        super();

        this.state={cards:[]}
       
    }

    block = async (email) => {
        const cookies = new Cookies();
        var url = "http://localhost:8000/api.block?uname="+cookies.get('uname') + "&target="+email;
        const respose = await fetch(url);
    };

    like = async (email) => {
        const cookies = new Cookies();
        
        var url = "http://localhost:8000/api.like?uname="+cookies.get('uname') + "&target="+email;
        const respose = await fetch(url);
    };

    super = async (email,image) => {
        //alert(image)
        //alert(email)
        const cookies = new Cookies();
        var url = "http://localhost:8000/api.super?uname="+cookies.get('uname') + "&target="+email+"&image="+image;
        const respose = await fetch(url);
       
    };

    popUp = async (email,url,data) => {

        
        


        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];
        
        modal.style.display = "block";
     
        span.onclick = function() 
        {
            modal.style.display = "none";
        }

        window.onclick = function(event) 
        {
            if (event.target == modal) 
            {
                modal.style.display = "none";
            }
        } 
       

        var ur="http://localhost:8000/getImage?o="+data['email']+"/&i="+data['image'];

        document.getElementById("email").innerHTML= data['email'];
        
        document.getElementById("fname").innerHTML= data['name'];

        document.getElementById("like").innerHTML= data['likes'];

        document.getElementById("super").innerHTML= data['super'];

        document.getElementById("age").innerHTML= data['age'];
        
        document.getElementById("image").innerHTML= '<img id="img" src="'+ur+'"/>';

        document.getElementById("img").style.height = "200px";
       
        
    };







    async getNotification()
    {
        const cookies = new Cookies();
        
        var url = "http://localhost:8000/api.notification?uname="+cookies.get('uname');


        const respose = await fetch(url);

        const data = await respose.json();
       
        await this.setState({
            notification: data["results"]
          });   
    }
    async notificationHtml()
    {
        var like = this.state.notification['like'];
        var superLike = this.state.notification['super'];
        var l=[]
        var sl=[]
        for(let i=0;i<like.length;i++)
        {
            l.push(<tr><td>{like[i] } is like your photo</td></tr>);
        }

        await this.setState({likeHtml:l});

//       http://localhost:8000/getImage?o=nawajish@gmail.com/&i=CSM17008.jpg

//      {"who":"vinay@gmail.com","image":"CSM17014.jpg"}
        
        for(let i=0;i<superLike.length;i++)
        {
            
            var url = "http://localhost:8000/getImage?o="+superLike[i]['who']+"/&i="+superLike[i]['image'];
            
            sl.push(<tr>  <td> <img id="noteImg" src={url} /> </td> <td> is liked your photos</td></tr>);
        }
        await this.setState({superLike:sl});


    }
    notificationPopUp = async () => {

        await this.getNotification();
        await this.notificationHtml();
        document.getElementById("noteImg").style.height = "200px";
        //{"like":["vinay@gmail.com"],"super":[{"who":"vinay@gmail.com","image":"CSM17014.jpg"}]}
        //alert(JSON.stringify(this.state.notification))

        var modal = document.getElementById("myModal1");
        var span = document.getElementsByClassName("close1")[0];
        modal.style.display = "block";

        document.getElementById("super-likes").style.borderBottom = "3px solid #f05030";
        document.getElementById("super-likes").style.borderBottomLeftRadius = "20px";
        document.getElementById("super-likes").style.borderBottomRightRadius = "20px";
        document.getElementById("super-likes").style.fontSize = "25px";
        document.getElementById("super-likes").style.color = "#4f231a";
        document.getElementById("likes").style.borderBottom = "2px solid #f05030";
        document.getElementById("likes").style.borderBottomLeftRadius = "20px";
        document.getElementById("likes").style.borderBottomRightRadius = "20px";
        document.getElementById("likes").style.fontSize = "21px";
        document.getElementById("super-likes").style.color = "#4f231a";



        span.onclick = function() 
        {
            modal.style.display = "none";
        }

        window.onclick = function(event) 
        {
            if (event.target == modal) 
            {
                modal.style.display = "none";
            }
        } 
    };










    loadImage = async () => {
        
        const cookies = new Cookies();
        var url = "http://localhost:8000/api.loadImgDetail?uname=" + cookies.get('uname');

        const respose = await fetch(url);
        const data = await respose.json();
       
        await this.setState({
            imageData: data["results"]
        
          });
    }

    createCards = async () => {
        var cardHtml = [];

        for(let i=0;i<this.state.imageData.length;i++)
        {
            var url="http://localhost:8000/getImage?o="+this.state.imageData[i]['email']+"/&i="+this.state.imageData[i]['image'];
           
            cardHtml.push(
                <div className ="image-card">
        
                <div className = "image-instance">
                
                <img src={url}  id="myBtn"  onClick = { async () => { await this.popUp(this.state.imageData[i]['email'],url,this.state.imageData[i]);}  }/> 
                    
                </div>
                
                <div className = "btn-group">
                    <button className = "btn"  onClick = { async () => { await this.block(this.state.imageData[i]['email']);}}> Block </button>
                    <button className="btn" onClick = { async () => { await this.like(this.state.imageData[i]['email']);}}>Like</button > 
                    < button className = "btn"  onClick = { async () => { await this.super(this.state.imageData[i]['email'],this.state.imageData[i]['image']);}}> Super Like </button>
                </div>

            </div>
            )
        }
       await this.setState({
            cards:cardHtml
       });      
    }
    //http://localhost:8000/getImage?o=ved@gmail.com/&i=exception%20hierarchy.png
    async componentWillMount() {

        
        await this.loadImage();
        await this.createCards();

        
        //alert(JSON.stringify(this.state.imageData));
        

    }

    logout = async () => {


        const cookies = new Cookies();
        cookies.remove("uname");
        localStorage.removeItem('token');

        window.location.href = "http://localhost:3000/";
    };
    render() {
        return ( 
            <div>
                <br/>
               
                <button class = "logout" onClick = { async () => { await this.logout();}} style={{backgroundColor:"#f05030"}}> Logout </button>
                <button class = "notification" id="mybtn1"  onClick = { async () => { await this.notificationPopUp();}  }> Notification </button> 
                <br/> <br/>
                
            
                <div className = "main-container" >
                    <center>
                        <div className = "dashboard-container">

                            {this.state.cards}

                           

                            <div id="myModal" class="modal">
                                <div class="modal-content">
                                    <span class="close">&times;</span>

                                    
                                    <div id="image"></div>
                                          
                                    <table>

                                        <tr> 
                                            <td>Full Name</td> 
                                            <td>:</td>
                                            <td id="fname"></td>
                                        </tr>

                                        <tr> 
                                            <td>Age</td> 
                                            <td>:</td>
                                            <td id="age"></td>
                                        </tr>

                                    

                                        <tr> 
                                            <td>Email</td> 
                                            <td>:</td>
                                            <td id="email"></td>
                                        </tr>


                                        <tr> 
                                            <td>Likes</td> 
                                            <td>:</td>
                                            <td id="like"></td>
                                        </tr>

                                        <tr> 
                                            <td>Super Likes</td> 
                                            <td>:</td>
                                            <td id="super"></td>
                                        </tr>



                                        

                                    </table>
                                </div>
                            </div>






                            <div id="myModal1" class="modal1">
                                <div class="modal-content1">
                                    <span class="close1">&times;</span>
                                    <br/><br/>
                                    <div id="super-likes"><p>Super Likes</p></div>
                                    <div className="super-likes-body" id="super-likes-body">
                                    {this.state.superLike}
                                    </div>
                                    
                                    <div className="likes" id="likes"><p>Likes</p></div>
                                    <div className="likes-body" id="likes-body">
                                        <table>
                                            {this.state.likeHtml}
                                        </table>
                                    </div>

                                    
                                    
                                </div>
                            </div>

                            







                        </div> 
                    </center> 
                </div>
                
            </div>
        );
    }
}