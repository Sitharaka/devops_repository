import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import TaskManagerTable from './Components/TaskManagerTable/TaskManagerTable';
import SignIn from './Components/Sign/SignIn';
import SignUp from './Components/Sign/SignUp';

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<TaskManagerTable/>}></Route>
    <Route path="/SignIn" element={<SignIn/>}></Route>
    <Route path="/SignUp" element={<SignUp/>}></Route>
   </Routes>
   </BrowserRouter>
  );
}

export default App;
