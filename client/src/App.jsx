import React, {Component} from 'react';
import './App.css';
import WelcomeBody from './WelcomeBody';
import Login from './Login';
import Signup from './Signup';
import axios from 'axios';
import Homepage from './Homepage';
import { 
  BrowserRouter as Router, 
  Route,
  Link } from 'react-router-dom';
import AppDetail from './AppDetail';
import AddApp from './AddApp';
import AddNote from './AddNote';

class App extends Component {

  state = {
    token: '',
    user: null,
    errorMessage: '',
    lockedResult: ''
  }

  checkForLocalToken = () => {
    // Look in localStorage for a token
    let token = localStorage.getItem('mernToken')
    if (!token || token === 'undefined') {
      // if no token, remove all evidence of mernToken from localStorage and state 
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      // if found a token, verify it on the backen 
      axios.post('/auth/me/from/token', {token})
        .then( response => {
          if (response.data.type === 'error') {
            localStorage.removeItem('mernToken') 
            this.setState({
              token: '',
              user: null, 
              errorMessage: response.data.message
            })
          } else {
            // if verified, store it back in localStorage and state 
            localStorage.setItem('mernToken', response.data.token)
            this.setState({
              token: response.data.token,
              user: response.data.user
            })
          }
        })
    }
  }

  componentDidMount = () => {
    this.checkForLocalToken()
  }

  liftToken = ({token, user}) => {
    this.setState({
      token,
      user
    })
  }

  logout = () => {
    localStorage.removeItem('mernToken')
    this.setState({
      token: '',
      user: null
    })
  }


  render (){   
    let navContents;
    if(this.state.user) {
      navContents = (
        <div className="nav-wrapper"> 
          <button onClick={this.logout}>Logout</button> <br />
          <p>{this.state.lockedResult}</p>
        </div>
      )
    } else {
      navContents = (
      <div className="nav-wrapper"> 
      <Signup liftToken={this.liftToken} />
      <Login liftToken={this.liftToken} />
      <WelcomeBody />
      </div>
    )
  }
  return (
  <Router>
    <div className="App">
      <header>
        <h1>Welcome to JobTrackers! </h1>
        <nav>
          <Link to='/'>Home Page</Link>{ ' | ' }
          <Link to='/AddApp'>Add A New Job</Link>{ ' | ' }
        </nav>
      </header>
      <div className="content-box">
        {navContents}
        <Route exact path='/' render={ (props) => <Homepage {...props} token={this.state.token} />  } />
        <Route exact path='/app/:id' component={AppDetail} />
        <Route exact path='/AddApp' render={ () => <AddApp token={this.state.token} />  } />
        <Route exact path='/app/:id/note' component={AddNote}  />
      </div>
    </div>
  </Router>
  )
  }
}



export default App;
