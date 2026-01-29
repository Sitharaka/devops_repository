import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import TaskManagerTable from './Components/TaskManagerTable/TaskManagerTable';
import SignIn from './Components/Sign/SignIn';
import SignUp from './Components/Sign/SignUp';
import { AuthProvider } from './AuthContext';

function App() {
  return (
   <AuthProvider>
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<TaskManagerTable/>}></Route>
    <Route path="/SignIn" element={<SignIn/>}></Route>
    <Route path="/SignUp" element={<SignUp/>}></Route>
   </Routes>
   </BrowserRouter>
   </AuthProvider>
  );
}

export default App;
