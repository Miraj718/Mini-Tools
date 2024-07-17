import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import MainComponent from './components/MainComponent';
import Chat from './components/Chat'; // Import the Chat component

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<MainComponent />} />
          <Route path='/chat' element={<Chat />} /> {/* Add this route for the Chat component */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
