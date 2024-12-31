// CalendarPage.jsx
import { useState, useEffect } from 'react'; // Updated import to include useEffect
import './Dashboard.css'; // or a separate calendar.css if desired
import Sidebar from '../components/Sidebar';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'; // Added import
import { format, parse, startOfWeek, getDay } from 'date-fns'; // Added startOfToday
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'; // Added drag and drop styles
import { Modal, Button } from 'react-bootstrap';
import enUS from 'date-fns/locale/en-US';

import axios from 'axios'; // Added axios for API calls


const locales = {
  'en-US': enUS
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date()),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

const CalendarPage = () => {
  const [view, setView] = useState('month');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timerDuration * 60);
  const [isBreak, setIsBreak] = useState(false);

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  };

  const timerDisplayStyle = {
    fontSize: '3rem',
    marginBottom: '20px',
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // Default color for other statuses

    switch (event.status) {
      case 'Completed':
        backgroundColor = '#28a745'; // Green
        break;
      case 'Expired':
        backgroundColor = '#dc3545'; // Red
        break;
      case 'Not Started':
        backgroundColor = '#6c757d'; // Gray
        break;
      case 'In Progress':
        backgroundColor = '#ffc107'; // Yellow
        break;
      default:
        backgroundColor = '#3174ad';
    }

    const style = {
      backgroundColor,
      borderRadius: '5px',
      color: 'white',
      border: 'none',
      display: 'block',
      paddingLeft: '10px',
    };
    return {
      style,
    };
  };
  useEffect(() => {
    fetchTasks();
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    let timerInterval;
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setRemainingTime((prevTime) => {
          // Check if task deadline is met
          if (selectedEvent && new Date() >= selectedEvent.end) {
            clearInterval(timerInterval);
            handleEndTimerEarly();
            alert('Timer ended: Task deadline has been reached!');
            return 0;
          }

          if (prevTime <= 1) {
            clearInterval(timerInterval);
            handleTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isTimerRunning, selectedEvent]);

  const handleStartTimer = () => {
    // Removed the status check to allow timer for any task
    setRemainingTime(timerDuration * 60);
    setIsTimerRunning(true);
  };

  const handleEndTimerEarly = () => {
    setIsTimerRunning(false);
    setRemainingTime(timerDuration * 60);
    setIsBreak(false);
  };

  // Modify handleTimerEnd to initiate break
  const handleTimerEnd = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(isBreak ? "Break Time Finished!" : "Focus Session Complete!", {
        body: isBreak ? "Ready to get back to work?" : "Great job! Time for a break!",
        icon: "/favicon.ico" // You can add your own icon path
      });
    }

    // Play a sound notification
    const audio = new Audio('/notification-sound.mp3'); // Add your sound file to public folder
    audio.play().catch(e => console.log('Audio play failed:', e));

    setIsTimerRunning(false);
    setIsBreak(!isBreak); // Toggle break state

    if (!isBreak) {
      // If focus session ended, show break timer
      setRemainingTime(breakDuration * 60);
    } else {
      // If break ended, reset to focus timer
      setRemainingTime(timerDuration * 60);
    }
  };

  // Add handler to start break timer
  const handleStartBreakTimer = () => {
    setRemainingTime(breakDuration * 60);
    setIsTimerRunning(true);
    setIsBreak(false);
  };

  const handleRestartTimer = () => {
    setRemainingTime(timerDuration * 60);
    setIsTimerRunning(true);
  };

  // Fetch tasks from backend and set events
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedEvents = Array.isArray(response.data.tasks)
        ? response.data.tasks.map((task) => ({
          id: task._id,
          title: task.title,
          start: new Date(task.startDate || task.dueDate),
          end: new Date(task.endDate || task.dueDate),
          allDay: false,
          status: task.status,
        }))
        : [];
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // Add the handleDragDropTask function
  const handleDragDropTask = async ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    try {
      // If the task is already completed, keep it completed
      if (event.status === 'Completed') {
        const updatedEvent = { ...event, start: new Date(start), end: new Date(end), allDay: droppedOnAllDaySlot };

        setEvents((prevEvents) =>
          prevEvents.map((evt) => (evt.id === event.id ? updatedEvent : evt))
        );

        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5001/api/tasks/${event.id}`, {
          startDate: updatedEvent.start.toISOString(),
          endDate: updatedEvent.end.toISOString(),
          status: 'Completed', // Maintain completed status
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return;
      }

      const now = new Date();
      let newStatus;

      // Check if the task period includes current time
      if (start <= now && end >= now) {
        newStatus = 'In Progress';
      } else if (end < now) {
        newStatus = 'Expired';
      } else if (start > now) {
        newStatus = 'Not Started';
      }

      const updatedEvent = {
        ...event,
        start: new Date(start),
        end: new Date(end),
        allDay: droppedOnAllDaySlot,
        status: newStatus
      };

      setEvents((prevEvents) =>
        prevEvents.map((evt) => (evt.id === event.id ? updatedEvent : evt))
      );

      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/tasks/${event.id}`, {
        startDate: updatedEvent.start.toISOString(),
        endDate: updatedEvent.end.toISOString(),
        status: updatedEvent.status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task schedule.');
    }
  };

  // Modify the handleMarkCompleted to also stop the timer if running
  const handleMarkCompleted = async () => {
    if (isTimerRunning) {
      handleEndTimerEarly();
    }
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5001/api/tasks/${selectedEvent.id}/status`, {
        status: 'Completed'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update the event's status in the state
      setEvents(events.map(evt => evt.id === selectedEvent.id ? { ...evt, status: 'Completed' } : evt));
      // Close the modal
      handleCloseModal();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to mark task as completed.');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="main-content" style={{ pointerEvents: isTimerRunning ? 'none' : 'auto' }}>
        <h1 className="mb-4">Calendar</h1>
        <div className="card-like">
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            defaultView={view}
            views={['month', 'week', 'day', 'agenda']}
            onView={(newView) => setView(newView)}
            onEventDrop={handleDragDropTask} // Added handler
            draggableAccessor={() => true} // Make all events draggable
            resizable
            onEventResize={handleDragDropTask} // Handle resize as drop
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter} // Add this line
            popup
          />
        </div>
        {/* Event Details Modal */}
        {selectedEvent && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedEvent.title}</Modal.Title>
              {selectedEvent.status !== 'Completed' && (
                <Button variant="success" onClick={handleMarkCompleted}>
                  ✓
                </Button>
              )}
            </Modal.Header>
            <Modal.Body>
              <p><strong>Status:</strong> {selectedEvent.status}</p>
              <p>
                <strong>Start:</strong> {selectedEvent.start.toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {selectedEvent.end.toLocaleString()}
              </p>
              {!isTimerRunning && !isBreak && (
                <>
                  <h5>Start Focus Timer</h5>
                  <>
                    <div>
                      <label>Focus Duration (minutes): </label>
                      <input
                        type="number"
                        value={timerDuration}
                        onChange={(e) => setTimerDuration(Number(e.target.value))}
                        min="1"
                      />
                    </div>
                    <Button onClick={handleStartTimer}>Start Timer</Button>
                  </>
                </>
              )}
              {isBreak && (
                // Start Break Timer
                <>
                  <h5>Break Time</h5>
                  <div>
                    <label>Break Duration (minutes): </label>
                    <input
                      type="number"
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <Button onClick={handleStartBreakTimer}>Start Break</Button>
                </>
              )}
              {isTimerRunning && (
                <>
                  <h5>{isBreak ? 'Break Time' : 'Focus Time'}</h5>
                  <div>
                    <progress value={remainingTime} max={isBreak ? breakDuration * 60 : timerDuration * 60}></progress>
                  </div>
                  <p>Time Remaining: {Math.floor(remainingTime / 60)}:{('0' + (remainingTime % 60)).slice(-2)}</p>
                  {!isBreak ? (
                    <Button variant="danger" onClick={handleEndTimerEarly}>End Timer</Button>
                  ) : (
                    <>
                      <Button variant="primary" onClick={handleRestartTimer}>Restart Focus Timer</Button>
                      <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    </>
                  )}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
      {/* Timer Overlay */}
      {isTimerRunning && (
        <div style={overlayStyle}>
          <h2>{isBreak ? 'Break Time' : 'Focus Time'}</h2>
          <div style={timerDisplayStyle}>
            {Math.floor(remainingTime / 60)}:{('0' + (remainingTime % 60)).slice(-2)}
          </div>
          <div>
            <Button
              variant="danger"
              onClick={handleEndTimerEarly}
              style={{ marginRight: '10px' }}
            >
              End Timer Early
            </Button>
          </div>
          <p style={{ marginTop: '20px' }}>
            {isBreak
              ? 'Take a break and relax!'
              : 'Stay focused on your task. All other features are disabled during focus time.'}
          </p>
        </div>
      )}
    </>
  );
};

export default CalendarPage;