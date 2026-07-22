import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AddExpense from "./AddExpense";
import ShowExpense from "./ShowExpense";
import Header from "./Header";
import Footer from "./Footer";
import Register from "./Register";
import Login from "./Login";

function App() {
  const [item, setItem] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("0");
  const [selectedYear, setSelectedYear] = useState("");

  // ---- Auth state ----
  const [user, setUser] = useState(null);       // null = logged out, object = logged in
  const [authChecked, setAuthChecked] = useState(false); // has the initial "am I logged in" check run yet
  const [showRegister, setShowRegister] = useState(false);

  const months = [
    "All", "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  const years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

  function addItems(newItem) {
    setItem(prevItem => [...prevItem, newItem]);
  }

  // On first load, check if a session already exists (e.g. user refreshed the page)
  useEffect(() => {
    checkSession();
  }, []);

  // Only fetch expense data once we know the user is logged in
  useEffect(() => {
    if (user) {
      getData();
    }
  }, [selectedMonth, selectedYear, user]);

  async function checkSession() {
    try {
      const response = await fetch("http://localhost:3000/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  async function getData() {
    try {
      const response = await fetch(
        `http://localhost:3000/data?month=${selectedMonth}&year=${selectedYear}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // session expired or was never valid — log the user out client-side too
          setUser(null);
        }
        setItem([]);
        setTotal(0);
        return;
      }

      const result = await response.json();
      setItem(result.expenses ?? []);
      setTotal(result.total ?? 0);
    } catch (err) {
      console.error(err);
      setItem([]);
      setTotal(0);
    }
  }

  function del(id) {
    fetch(`http://localhost:3000/data/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
      .then(res => res.json())
      .then(() => {
        setItem(prevItem => prevItem.filter((x) => x.id !== id));
      })
      .catch(err => console.error(err));
  }

  function update(id, updateNote) {
    fetch(`http://localhost:3000/data/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updateNote)
    })
      .then(res => res.json())
      .then(() => {
        setItem(prev =>
          prev.map(note =>
            note.id === Number(id)
              ? { ...note, ...updateNote }
              : note
          )
        );
      })
      .catch(err => console.error(err));
  }

  async function handleLogout() {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setItem([]);
      setTotal(0);
    }
  }

  // Called by Login.jsx after a successful login — expects the logged-in user object
  function handleLoginSuccess(loggedInUser) {
    setUser(loggedInUser);
  }

  // Wait until we know whether a session exists before rendering anything auth-dependent
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  // ---- Logged-out view ----
  if (!user) {
    return (
      <div>
        <Header />
        {showRegister ? (
          <>
            <Register onRegisterSuccess={() => setShowRegister(false)} />
            <p>
              Already have an account?{" "}
              <button onClick={() => setShowRegister(false)}>Log in</button>
            </p>
          </>
        ) : (
          <>
            <Login onLoginSuccess={handleLoginSuccess} />
            <p>
              Don't have an account?{" "}
              <button onClick={() => setShowRegister(true)}>Sign up</button>
            </p>
          </>
        )}
        <Footer />
      </div>
    );
  }

  // ---- Logged-in view ----
  return (
    <div>
      <Header />
      <button onClick={handleLogout}>Log out</button>
      <AddExpense onAdd={addItems} />

      <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        {months.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>

      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        <option value="">All</option>
        {years.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>

      <h2>Total Expense: Rs. {total ?? 0}</h2>

      {(item ?? []).map((e, index) => (
        <ShowExpense
          key={index}
          id={e.id}
          title={e.title}
          category={e.category}
          amount={e.amount}
          expense_date={new Date(e.expense_date).toLocaleDateString("en-CA")}
          onDelete={del}
          onUpdate={update}
        />
      ))}

      <Footer />
    </div>
  );
}

export default App;