import { BrowserRouter, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/salas/nova" component={NewRoom} />
    </BrowserRouter>
  );
}

export default App;
