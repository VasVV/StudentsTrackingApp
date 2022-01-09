import logo from './logo.svg';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from './login';
import SignUp from './signup';
import Dashboard from './dashboard';
import DashboardStudent from './dashboardstudent';
import PasswordReset from './passwordreset';
import {useSelector, useDispatch} from 'react-redux';
import {signOutUser} from './firebase';
import Chat from './chat';

function App() {

  const currUser = useSelector(state => state.addremovecurruser);
  
  const dispatch = useDispatch();

  const handleLogOut = () => {
    signOutUser();
    dispatch({type: 'REMOVE_CURR_USER'})
  }


  return (
    <Router>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/sign-in"}>Тренинги Настасьи Вахтиной</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              {Object.entries(currUser).length === 0 ? 
              <>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-in"}>Войти</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Зарегистироваться</Link>
              </li>
              </>
              : 
              <>
              {currUser.admin ? 
              <li className="nav-item nav-start">
                <Link className="nav-link" to={"/dashboard"} >Список студентов</Link>
              </li>
              :
              <li className="nav-item nav-start">
                <Link className="nav-link" to={"/dashboard-student"} >Задания</Link>
              </li>
              } 
              <li className="nav-item nav-start">
                <Link className="nav-link" to={"/chat"}>Чат</Link>
              </li>
              <li className="nav-item nav-end">
                <Link className="nav-link" to={"/sign-in"} onClick={() => handleLogOut()}>Выйти</Link>
            </li>
            </>
            }
            </ul>
          </div>
        </div>
      </nav>

      
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path='/password-reset' component={PasswordReset} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/dashboard-student' component={DashboardStudent} />
            <Route path='/chat' component={Chat} />
          </Switch>
        
    </div></Router>
  );
}

export default App;
