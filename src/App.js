import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState('');

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setError('');
      // Call the backend API with the JSON input
      const res = await axios.post('http://localhost:5000/api/process', parsedJson);
      setResponse(res.data);
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedFilters([...selectedFilters, value]);
    } else {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
    }
  };

  const applyFilters = () => {
    let filtered = response;
    if (selectedFilters.includes('Alphabets')) {
      filtered = filtered.replace(/[^A-Za-z]/g, '');
    }
    if (selectedFilters.includes('Numbers')) {
      filtered = filtered.match(/\d+/g)?.join(',') || '';
    }
    setFilteredResponse(filtered);
  };

  return (
    <div>
      <h1>Your Roll Number Here</h1>
      <div>
        <textarea
          rows="4"
          cols="50"
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter JSON here'
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <h3>Select Filters:</h3>
          <div>
            <label>
              <input
                type="checkbox"
                value="Alphabets"
                onChange={handleFilterChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                value="Numbers"
                onChange={handleFilterChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                value="Highest lowercase alphabet"
                onChange={handleFilterChange}
              />
              Highest lowercase alphabet
            </label>
          </div>
          <button onClick={applyFilters}>Apply Filters</button>
          <div>
            <h3>Filtered Response:</h3>
            <p>{filteredResponse}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
