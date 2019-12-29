import React, {
  Component
} from 'react';
import Cookies from "universal-cookie";




import './style/style.css';

import Header from './header'
import Footer from './footer'
import Login from './login'
import DashBoard from './dashboard'

import LoadingPage from './loadingPage'
import Registraction from './registration';

const header = <Header/> ;
const footer = <Footer/> ;
const login = <Login/>
const registraction = <Registraction/>
const loadingPage=<LoadingPage/>
const dashboard=<DashBoard/>

  class LayoutFile extends Component {
    constructor() {
      super();

      this.state = {
        loadComponent: login,
        loading:0
      };
  
    }

   
    
  
    async checkLogin() {

      const cookies = new Cookies();
      //if(cookies.get('uname') == undefined)
      if(localStorage.getItem('token') == undefined || localStorage.getItem('token') == null ||localStorage.getItem('token') == false)
      {
        return false;
      }
      else
      {
        return true;
      }
      

    }
    
    async componentWillMount() {


      const v = await this.checkLogin();


      if (document.URL == "http://localhost:3000/?register") 
      {
        await this.setState({
          loadComponent: registraction,
          loading:1
        });
      
      } else if (v) {

        await this.setState({
          loadComponent: dashboard
        });
       
        
      } else {
        await this.setState({
          loadComponent: login
        });
      }


      // const cookies = new Cookies();
      // cookies.set('uname', 'ved prakash', {
      //   path: '/'
      // });
      // cookies.set('password', '123456789', {
      //   path: '/'
      // });

      // console.log("uname: " + cookies.get('uname'));
      // console.log("password: " + cookies.get('password'));


    }


    render() {
      if (this.state.loading === 1) {
        return(
          <div>
              {header}
              <div className="mainContainer">
                {this.state.loadComponent}  
              </div>
              {footer}
            </div>
        );
     
      }
      
      else
      {
          return(

            <div>
              {header}
              <div className="mainContainer">
                {this.state.loadComponent}  
              </div>
              {footer}
            </div>

          );
        }
    }

  }

export default LayoutFile;