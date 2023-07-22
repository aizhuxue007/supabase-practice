import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const SUPABASE_URL = "https://vgigltsnmhcxllawoozp.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaWdsdHNubWhjeGxsYXdvb3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4NzA3OTYsImV4cCI6MjAwNTQ0Njc5Nn0.wmh_PVPtPxEuxYwGbmeN-gRWhXUTGR9Koh_9f5PN3Kk";

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

function App() {
  const [countries, setCountries] = useState([]);
  const [newCountryName, setNewCountryName] = useState("");

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
  }, [countries]);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    // select gets all from table
    setCountries(data);
  }

  async function deleteCountry(id) {
    // delete country
    console.log(id)
    try {
      const { data, error } = await supabase.from("countries")
        .delete()
        .eq("id", id);
      getCountries();
      console.log(data)
    } catch (error) {
      console.error("Error deleting country: ", error)
    }
  }

  async function addCountry(countryName) {
    // insert object to countries database.
    const { data, error } = await supabase.from("countries").insert([
      { name: countryName }
    ]);

    if (error) {
      console.error("Error inserting country: ", error.message);
    } else {
      console.log("Country inserted successfully: ", data)
      // Refreshes the app after inserting new country.
      getCountries();
    }
  }

  const handleFormSubmit = (event) => {
    // remember to prevent default which refreshes the page
    event.preventDefault();
    addCountry(newCountryName);
    setNewCountryName("");
  }

  

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input 
          type="text"
          value={newCountryName}
          onChange={(e) => setNewCountryName(e.target.value)}
          placeholder="Enter a country name"
        />
        <button>Add Country</button>
      </form>
      <ul>
        {countries.map((country) => (
          <li key={country.name}>
            {country.name}
            <button onClick={() => deleteCountry(country.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
