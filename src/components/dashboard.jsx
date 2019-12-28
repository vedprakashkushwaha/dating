import React, {
    Component
} from 'react';
import Cookies from "universal-cookie";

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
        alert("like")
       // var url = "http://localhost:8000/api.like?uname="+cookies.get('uname') + "&target="+email;
        //const respose = await fetch(url);
    };

    super = async (email) => {
        const cookies = new Cookies();
        alert("super");
        //var url = "http://localhost:8000/api.super?uname="+cookies.get('uname') + "&target="+email;
        ///const respose = await fetch(url);
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
                <img src={url}/>
                    
                </div>
                <div className = "btn-group">
                    <button className = "btn"  onClick = { async () => { await this.block(this.state.imageData[i]['email']);}}> Block </button>
                    <button className="btn" onClick = { async () => { await this.like(this.state.imageData[i]['email']);}}>Like</button > 
                    < button className = "btn"  onClick = { async () => { await this.super(this.state.imageData[i]['email']);}}> Super Like </button>
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
        window.location.href = "http://localhost:3000/";
    };
    render() {
        return ( 
            <div>
                <br/>
                <button class = "logout"onClick = { async () => { await this.logout();}} > Logout </button> <br/> <br/>
            
                <div className = "main-container" >
                    <center>
                        <div className = "dashboard-container">



                           {/* <div className = "image-card">
                                <div className = "image-instance"> 

                                </div> 
                                <div className = "btn-group">
                                    <button className = "btn"> Block </button><button className="btn">Like</button > < button className = "btn" > Super Like </button> 
                                </div> 
                            </div> */}

                            {this.state.cards}
                            
                        </div> 
                    </center> 
                </div>
                
            </div>
        );
    }
}