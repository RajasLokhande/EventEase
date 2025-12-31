// --- Global Configuration ---
const API_BASE_URL = 'http://localhost:8080/api'; // Point to your Spring Boot Server

// --- Global State ---
let currentUser = null; // Stores the logged-in user object (Attendee or Organizer)
let currentEventId = '';
let currentEventDate = '';
let events = []; // Will be populated from Backend

// --- HELPER: Navigation ---
window.showSection = (id, data = null) => {
    // 1. Hide all sections
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');

    // 2. Show the target section
    document.getElementById(id).style.display = (['organizerDashboard', 'eventsPage'].includes(id)) ? 'grid' : 'flex';

    // 3. Page specific logic
    if (id === 'eventsPage') {
        const firstName = currentUser ? currentUser.firstName : 'Guest';
        document.getElementById('attendeeWelcomeNameSidebar').innerText = firstName;
        document.getElementById('attendeeWelcomeNameHeader').innerText = `Welcome, ${firstName}!`;
        loadEvents();
    } else if (id === 'organizerDashboard') {
        const name = currentUser ? currentUser.name : 'Organizer';
        document.getElementById('organizerWelcomeHeader').innerText = `Welcome, ${name}!`;
        updateOrganizerStats();
        loadOrganizerEvents();
    } else if (id === 'eventDetailPage' && data) {
        loadEventDetails(data);
    } else if (id === 'feedbackPage') {
        setRating(0);
        // Call the new function when opening the page
        loadBookedEventsForFeedback();
    }
};

// --- HELPER: Age Calculation (Frontend Logic) ---
window.calculateAge = () => {
    const dob = document.getElementById('dob').value;
    const ageInput = document.getElementById('age');
    ageInput.value = '';
    if (!dob) return;
    const [birth, today] = [new Date(dob), new Date()];
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    ageInput.value = age > 0 ? age : '';
};

// ============================================================
//  BACKEND INTEGRATION FUNCTIONS
// ============================================================

// --- Load Booked Events for Feedback Dropdown ---
window.loadBookedEventsForFeedback = async () => {
    const select = document.getElementById('feedbackEventSelect');
    if (!currentUser) return;

    select.innerHTML = '<option value="">Checking your bookings...</option>';

    try {
        const response = await fetch(`${API_BASE_URL}/bookings/user/${currentUser.id}`);

        if (!response.ok) throw new Error("Could not fetch bookings");

        const bookings = await response.json();

        select.innerHTML = '<option value="" disabled selected>-- Select an Event --</option>';

        if (bookings.length === 0) {
            select.innerHTML += '<option value="" disabled>You haven\'t booked any events yet.</option>';
            return;
        }

        bookings.forEach(booking => {
            const eventDetails = events.find(e => e.id == booking.eventId);
            if (eventDetails) {
                select.innerHTML += `<option value="${eventDetails.id}">${eventDetails.name} (Date: ${new Date(eventDetails.date).toLocaleDateString()})</option>`;
            }
        });

    } catch (error) {
        console.error("Error loading user bookings:", error);
        select.innerHTML = '<option value="">Error loading events</option>';
    }
};

// --- Submit Feedback ---
const submitFeedback = async () => {
    if (!currentUser) return alert("Please login first.");

    const selectedEventId = document.getElementById('feedbackEventSelect').value;
    const rating = document.getElementById('feedbackRating').value;

    if (!selectedEventId) return alert('Please select an event from the list.');
    if (!rating) return alert('Please select a star rating!');

    const feedbackData = {
        attendeeId: currentUser.id,
        eventId: selectedEventId,
        rating: rating,
        comments: document.getElementById('feedbackComments').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/feedbacks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData)
        });

        if (response.ok) {
            alert('Feedback Submitted Successfully!');
            document.getElementById('feedbackComments').value = '';
            setRating(0);
            showSection('eventsPage');
        } else {
            alert('Failed to submit feedback.');
        }
    } catch (error) {
        console.error(error);
        alert('Server Error.');
    }
};

// ************************************************************
// [POST] Endpoint: /api/auth/attendee/register
// Purpose: Register a new attendee
// ************************************************************
const registerAttendee = async () => {
    const data = {
        email: document.getElementById('email').value,
        firstName: document.getElementById('fname').value,
        lastName: document.getElementById('lname').value,
        phone: document.getElementById('phone').value,
        age: document.getElementById('age').value,
        password: document.getElementById('password').value
        // Backend can calculate age from DOB if sent, or send DOB directly
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/attendee/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Registration Successful! Please Login.');
            showSection('attendeeLogin');
        } else {
            alert('Registration Failed. Email or ID might be taken.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server error during registration.');
    }
};

// ************************************************************
// [POST] Endpoint: /api/auth/attendee/login
// Purpose: Authenticate Attendee and get User Details
// ************************************************************
const loginAttendee = async () => {
    const email = document.getElementById('attendeeEmail').value;
    const password = document.getElementById('attendeePassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/attendee/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            currentUser = await response.json(); // Backend returns User Object (id, name, etc.)
            showSection('eventsPage');
        } else {
            alert('Invalid Email or Password');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Cannot connect to login server.');
    }
};

// ************************************************************
// [POST] Endpoint: /api/auth/organizer/register
// Purpose: Register a new Organizer
// ************************************************************
const registerOrganizer = async () => {
    const data = {
        email: document.getElementById('orgEmailRegister').value,
        name: document.getElementById('orgNameRegister').value,
        phone: document.getElementById('orgPhoneRegister').value,
        password: document.getElementById('orgPassRegister').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/organizer/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Organizer Registration Successful!');
            showSection('organizerLogin');
        } else {
            alert('Registration Failed.');
        }
    } catch (error) {
        console.error(error);
        alert('Server Error.');
    }
};

window.deleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) {
        return;
    }

    try {
        // NOTE: You need to add the DELETE endpoint to your Java Controller (see Part 2 below)
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Event deleted successfully!");
            loadOrganizerEvents(); // Refresh the table
        } else {
            alert("Failed to delete event.");
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Server error.");
    }
};

window.editEvent = (id) => {
    // 1. Find the event data from the global 'events' array
    const event = events.find(e => e.id == id);
    if (!event) return;

    // 2. Fill the form fields with existing data
    document.getElementById('eventId').value = event.id; // Crucial: This tells Backend to UPDATE, not CREATE
    document.getElementById('eventName').value = event.name;
    document.getElementById('duration').value = event.duration;
    document.getElementById('venueAddress').value = event.venueAddress;
    document.getElementById('venueCapacity').value = event.venueCapacity || '';
    document.getElementById('ticketPrice').value = event.ticketPrice;

    // Date formatting (HTML date input needs YYYY-MM-DD)
    if(event.date) {
        const d = new Date(event.date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        document.getElementById('eventDate').value = `${yyyy}-${mm}-${dd}`;
    }

    // 3. Change the Button Text to "Update Event" so the user knows
    const btn = document.getElementById('createEventBtn');
    btn.innerText = "Update Event";
    btn.onclick = createNewEvent; // Re-bind the function if needed

    // 4. Show the form
    showSection('createEvent');
};

// ************************************************************
// [POST] Endpoint: /api/auth/organizer/login
// Purpose: Authenticate Organizer
// ************************************************************
const loginOrganizer = async () => {
    const email = document.getElementById('orgEmail').value;
    const password = document.getElementById('orgPass').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/organizer/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            currentUser = await response.json();
            showSection('organizerDashboard');
        } else {
            alert('Invalid Organizer Credentials');
        }
    } catch (error) {
        console.error(error);
        alert('Login Error.');
    }
};

// ************************************************************
// [GET] Endpoint: /api/events
// Purpose: Load all available events from database
// ************************************************************
window.loadEvents = async () => {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '<p style="grid-column:1/-1; text-align:center">Loading Events...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        events = await response.json(); // Store in global variable

        eventList.innerHTML = '';
        events.forEach(event => {
            const dateString = new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            eventList.innerHTML += `
            <div class="event-card">
                <div>
                    <h4>${event.name}</h4>
                    <div class="event-detail-line"><span class="material-icons">location_on</span> ${event.venueAddress}</div>
                    <div class="event-detail-line"><span class="material-icons">calendar_today</span> ${dateString}</div>
                    <div class="event-detail-line"><span class="material-icons">schedule</span> ${event.duration}</div>
                </div>
                <div>
                    <div class="price">$${event.ticketPrice}</div>
                    <button class="btn-view-book" onclick="showSection('eventDetailPage', '${event.id}')">View & Book</button>
                </div>
            </div>`;
        });

        if (events.length === 0) {
            eventList.innerHTML = "<p style='grid-column:1/-1; text-align:center'>No events found.</p>";
        }
    } catch (error) {
        console.error(error);
        eventList.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:red'>Failed to connect to backend.</p>";
    }
};

// ************************************************************
// [POST] Endpoint: /api/events
// Purpose: Create a new event (Organizer Only)
// ************************************************************
const createNewEvent = async () => {
    const eventData = {
        id: document.getElementById('eventId').value || null, // Allow backend to generate if null
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        duration: document.getElementById('duration').value,
        budget: document.getElementById('budget').value,
        venueName: document.getElementById('venueId').value || null,
        venueAddress: document.getElementById('venueAddress').value,
        venueCapacity: document.getElementById('venueCapacity').value,
        ticketPrice: document.getElementById('ticketPrice').value.replace('$', ''),
        organizerId: currentUser ? currentUser.id : null // Link event to organizer
    };

    try {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });

        if (response.ok) {
            alert('Event Created Successfully!');
            document.querySelectorAll('#createEvent input').forEach(i => i.value = '');
            showSection('organizerDashboard');
        } else {
            alert('Failed to create event.');
        }
    } catch (error) {
        console.error(error);
    }
};

// ************************************************************
// [POST] Endpoint: /api/bookings
// Purpose: Book a ticket
// ************************************************************
window.confirmTicketBooking = async (eventName) => {
    const bookingData = {
        eventId: currentEventId,
        attendeeId: currentUser ? currentUser.id : 'GUEST',
        bookingDate: new Date().toISOString()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            // Success Case
            document.getElementById('bookedEventName').innerText = eventName;
            document.getElementById('bookedEventDate').innerText = 'Event Date: ' + new Date(currentEventDate).toLocaleDateString();
            showSection('ticketConfirmPage');
        } else {
            // --- FIX IS HERE ---
            // 1. Read the specific error message sent by the Java Backend
            const errorMessage = await response.text();

            // 2. Alert the specific message (e.g., "You have already booked this event!")
            alert(errorMessage);
        }
    } catch (error) {
        console.error(error);
        alert('Booking System Error: Could not reach server.');
    }
};

// ************************************************************
// [GET] Endpoint: /api/organizers/{id}/stats
// Purpose: Get dashboard stats (FETCH REAL DATA)
// ************************************************************
window.updateOrganizerStats = async () => {
    if (!currentUser) return;

    try {
        // 1. Fetch real stats from the new Backend Endpoint
        const response = await fetch(`${API_BASE_URL}/organizers/${currentUser.id}/stats`);

        if (response.ok) {
            const stats = await response.json();

            // 2. Update the Dashboard Cards with Real Numbers
            document.getElementById('totalEvents').innerText = stats.totalEvents;
            document.getElementById('totalAttendees').innerText = stats.totalAttendees;
            document.getElementById('totalFeedbacks').innerText = stats.totalFeedbacks;
        } else {
            console.warn("Failed to fetch stats");
        }
    } catch (error) {
        console.error("Error updating stats:", error);
    }
};

// --- Updated Loader Function ---
window.loadOrganizerEvents = async () => {
    const tableBody = document.getElementById('organizerEventTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center">Loading...</td></tr>';

    try {
        const response = await fetch(`${API_BASE_URL}/events`);

        // 1. Update the Global Variable with real data
        events = await response.json();

        // 2. CRITICAL: Update Stats NOW
        await updateOrganizerStats();

        tableBody.innerHTML = '';

        if (events.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center">No events found.</td></tr>';
            return;
        }

        // 3. Render the Table
        events.forEach(event => {
            const dateString = new Date(event.date).toLocaleDateString();
            tableBody.innerHTML += `
                <tr>
                    <td>${event.id}</td>
                    <td>${event.name}</td>
                    <td>${dateString}</td>
                    <td>$${event.ticketPrice}</td>
                    <td>
                        <button class="btn-edit" onclick="editEvent('${event.id}')">Edit</button>
                        <button class="btn-delete" onclick="deleteEvent('${event.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error loading events:", error);
        tableBody.innerHTML = '<tr><td colspan="5" style="color:red; text-align:center">Failed to load data.</td></tr>';
    }
};

window.openCreateEventPage = () => {
    // 1. Clear all inputs
    document.querySelectorAll('#createEvent input').forEach(i => i.value = '');

    // 2. Reset Button Text to "Create" (in case it was set to "Update")
    const btn = document.getElementById('createEventBtn');
    if (btn) {
        btn.innerText = "Create Event";
    }

    // 3. Show the section
    showSection('createEvent');
};

// --- Helper for Details ---
window.loadEventDetails = (eventId) => {
    // FIX 1: Use '==' instead of '===' to match String ID with Number ID
    const event = events.find(e => e.id == eventId);

    if (!event) {
        console.error("Event not found for ID:", eventId);
        return;
    }

    currentEventId = event.id;
    currentEventDate = event.date;

    // Update Title
    document.getElementById('detailEventTitle').innerText = event.name;

    // FIX 2: Target '.detail-text span' instead of just 'span'
    // This ensures we update the VALUE, not the ICON.
    document.getElementById('detailVenue').querySelector('.detail-text span').innerText = event.venueAddress;
    document.getElementById('detailDate').querySelector('.detail-text span').innerText = new Date(event.date).toLocaleDateString();
    document.getElementById('detailDuration').querySelector('.detail-text span').innerText = event.duration;

    // Handle Capacity (Optional check in case it's missing)
    const capacitySpan = document.getElementById('detailCapacity').querySelector('.detail-text span');
    if (capacitySpan) capacitySpan.innerText = event.venueCapacity || 'N/A';

    // Price has a specific class .price-tag, so this one was actually okay, but good to double-check
    document.getElementById('detailPrice').querySelector('.price-tag').innerText = `$${event.ticketPrice}`;

    document.getElementById('detailId').querySelector('.detail-text span').innerText = event.id;

    // Update the Book Button
    document.getElementById('bookTicketBtn').onclick = () => confirmTicketBooking(event.name);
};

window.setRating = (rating) => {
    document.getElementById('feedbackRating').value = rating;
    document.querySelectorAll('#feedbackStars .material-icons').forEach((star, index) => {
        star.innerText = index < rating ? 'star' : 'star_border';
    });
};

// --- Event Listeners (Binding Buttons to Functions) ---
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');

    document.getElementById('attendeeRegisterBtn').addEventListener('click', registerAttendee);
    document.getElementById('attendeeLoginBtn').addEventListener('click', loginAttendee);
    document.getElementById('organizerRegisterBtn').addEventListener('click', registerOrganizer);
    document.getElementById('organizerLoginBtn').addEventListener('click', loginOrganizer);
    document.getElementById('createEventBtn').addEventListener('click', createNewEvent);
    document.getElementById('submitFeedbackBtn').addEventListener('click', submitFeedback);
});