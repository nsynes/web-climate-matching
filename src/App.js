import React from 'react';
import Map from './components/LeafletMap';
import './App.css';

class App extends React.Component {

    render() {
        return (
            <div className="App">
              <Map />
            </div>
          );
    }

}

export default App;
