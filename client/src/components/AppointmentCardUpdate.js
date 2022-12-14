//functional imports
import React, { useState, useContext, useEffect } from 'react'
import { LoggedUserContext } from './LoggedUserContext';

function AppointmentCardUpdate({ appointment, changeToggle, setErrors, doctorName }) {
  //setting state with the form and appointments
  const [form, setForm] = useState(appointment);
  const { setAppointments, appointments } = useContext(LoggedUserContext);

  //controlling the input and setting state for each change
  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setForm({ ...form, [name]: value });
  }
  
  // updating the server with the new information for the appointment and setting state with the updated appointment then change the toggle back to close
  function handleUpdateSubmit(e) {
    e.preventDefault()
    fetch(`/appointments/${appointment.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }).then((res) => {
      if (res.ok) {
        res.json().then((updatedAppointment) => {
          const updatedAppointments = appointments.map((app) => {
            if (app.id === updatedAppointment.id) {
              return updatedAppointment
            } else {
              return app
            }
          })
          setAppointments(updatedAppointments)
        })
      } else {
        res.json().then((err) => setErrors(err.errors));
      }
    });
    changeToggle()
  }

  // changes the toggle to make the form disappear
  function handleCancel() {
    changeToggle()
  }


  return (
    <>
      <div>{`Change the details of your appointment with ${doctorName}`}</div>
      <form onSubmit={handleUpdateSubmit}>
        <label>
          <span>Update the time:</span>
          <textarea
            style={{ minHeight: "10px", maxWidth: "40em" }}
            onChange={handleChange}
            name='time'
            value={form.time}
          ></textarea>
          <span>Update the location:</span>
          <textarea
            style={{ minHeight: "10px", maxWidth: "40em" }}
            onChange={handleChange}
            name='location'
            value={form.location}
          ></textarea>
          <span>Update the concern or provide more details:</span>
          <textarea
            style={{ minHeight: "10px", maxWidth: "40em" }}
            onChange={handleChange}
            name='concern'
            value={form.concern}
          ></textarea>
          <span>Update the diagnosis:</span>
          <textarea
            style={{ minHeight: "10px", maxWidth: "40em" }}
            onChange={handleChange}
            name='diagnosis'
            value={form.diagnosis}
          ></textarea>
        </label>
        <button className='btn'>Update Appointment</button>
        <button className='btn' onClick={handleCancel}>Cancel</button>
      </form>
    </>
  )
}

export default AppointmentCardUpdate;