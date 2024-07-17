import React, { useState } from 'react';
import './detailform.css';
import Chat from './Chat'; // Assuming Chat component is in the same directory

export default function DetailForm({ onClick }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [oldClientData, setOldClientData] = useState(null); // State to hold old client data

  const validateForm = () => {
    let valid = true;

    // Validate name: less than 20 characters and only letters
    if (name.length > 20 || !/^[a-zA-Z]+$/.test(name)) {
      setNameError('Name must be less than 20 characters and only contain letters.');
      valid = false;
    } else {
      setNameError('');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    // Validate phone number: exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      valid = false;
    } else {
      setPhoneError('');
    }

    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const formData = {
        name: name,
        email: email,
        phone: phone,
      };

      try {
        // Check if client already exists
        const response = await fetch(`http://localhost:3000/visitors?email=${email}`);
        const existingClient = await response.json();

        if (existingClient.length > 0) {
          // Client exists, update existing data
          const client = existingClient[0];
          // Fetch old client's messages
          const messagesResponse = await fetch(`http://localhost:3000/visitors/${client.id}`);
          const clientMessages = await messagesResponse.json();
          formData.messages = clientMessages.messages; // Assuming messages are stored in 'messages' field

          setOldClientData(client); // Set old client data to state
        } else {
          // Client does not exist, create new entry
          formData.messages = [
            {
              id: '_' + Math.random().toString(36).substr(2, 9),
              user: 'Client',
              message: 'Chat started',
              timestamp: new Date().toISOString(),
            }
          ];
        }

        // Perform action with formData, e.g., update or create entry

        onClick(); // Trigger close or another action after form submission
      } catch (err) {
        console.error('Error submitting data:', err);
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Your Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {nameError && <div className="error">{nameError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {emailError && <div className="error">{emailError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter Your Phone Number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {phoneError && <div className="error">{phoneError}</div>}
        </div>
        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>

      {/* Conditionally render Chat component if old client data is available */}
      {oldClientData && (
        <Chat
          oldClientData={oldClientData}
        />
      )}
    </div>
  );
}
