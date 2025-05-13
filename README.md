# Table Tamer

### Team Members

* Eric Rutledge
* Jeffry Marquez
* Julian French - Frontend
* Nick Pagel - Backend/Database

---------
### Backend: how to run the server & connect to the database
### 🍎 Mac Users
1. Navigate to backend directory
2. Run `python3 -m venv env`
3. Run `source env/bin/activate`
    * Command prompt should now start with "(env)"
4. Not always necessary
    * Run `python3 -m pip install --upgrade pip`
5. Run `python3 setup_env_mac.py`
6. Run `pip install -r requirements.txt`
7. Run `cd ..` then `uvicorn backend.main:app --reload`
8. OR to use the fastapi server run `fastapi dev backend/main.py`

### 🪟 Windows Users
1. Navigate to backend directory
2. Run `cd backend`
3. Run `source .venv/Scripts/activate`
4. Run `pip install -r requirements.txt`
5. Run `cd..` then `uvicorn backend.main:app --reload`

---------
### When you're ready to kill backend server processes
1. `Ctrl + c`
2. `Deactivate` - should no longer see "(env)" in command prompt
---------
### Frontend: how to run the server
* Mac & Windows should be the same
1. Navigate to frontend directory
2. Run `npm i` to install all dependencies: Only needed if
    * Specified in merge request instructions
    * It's the first time you're spinning up this local server
3. Run `npm run dev`
4. Copy & paste localhost URL provided into your browser's URL bar
    * Most likely http://localhost:5173/

---------
## Backend Documentation

---------
### Backend/Models Documentation
* customers.py
    * customer_id - Int (PK)
    * customer_name - String
    * email - String
    * phone - String
    * password_hash - String
    * created_at - DateTime
    * customer_pic - String
    * language - String
* dining_history.py
    * history_id - Int (PK)
    * cusomter - Int (FK)
    * reservation_id - Int (FK)
    * visit_date - Date
* dining_tables.py
    * table_id - Int (PK)
    * capacity - Int
* notifications.py
    * notification_id - Int (PK)
    * customer_id - Int (FK)
    * reservation_id - Int (FK)
    * notification_type - String
    * sent_at - DateTime
* reservations.py
    * reservation_id - Int (PK)
    * customer_id - Int (FK)
    * slot_id - Int (FK)
    * reservation_date - Date
    * status - String
    * time_slot - Time (FK)
    * customer_name - String (FK)
* staff.py
    * staff_id - Int (PK)
    * staff_name - String
    * email - String
    * staff_role - String
    * password_hash - String
    * phone - String
    * staff_pic - String
    * language - String
* time_slots.py
    * slot_id - Int (PK)
    * time_slot - Time
    * is_available - Boolean

---------
### Backend/Routes Documentation
* customers.py
    * Creates a new customer
    * Read all customers
    * Get a specific customer by ID
    * Update a customer
    * Delete a customer
    * Check if a customer has a reservation
* dining_history.py
    * Creates a new dining history entry
    * Read all dining history entries
    * Get a specific dining history entry by ID
    * Update a dining history entry by ID
    * Delete a dining history entry by ID
* dining_tables.py
    * Create a new dining table
    * Read all dining tables
    * Get a specific dining table by ID
    * Update a dining table by ID
    * Delete a dining table by ID
* notifications.py
    * Create a new notification
    * Get all notifications
    * Get notification by ID
    * Update notification by ID
    * Delete notification by ID
* reservations.py
    * Create a new reservation
    * Read all reservations
    * Get a specific reservation by ID
    * Update a reservation by ID
    * Delete a reservation by ID
    * Get all of the reservations for a single customer using customer ID
* staff.py
    * Create a new staff member
    * Read all staff members
    * Get a specific staff member by ID
    * Update a staff member by ID
    * Delete a staff member by ID
* time_slots.py
    * Create a new time slot
    * Read all time slots
    * Get a specific time slot by ID
    * Update a specific time slot by ID
    * Delete a specific time slot by ID

---------
### config.py
* Contains the Database URL
* Creates the shared metadata for the routes & main.py

---------
### dependencies.py
* This sets up the database to be shared and used throughout the application.

---------
### main.py
* Adds logging configuration to look for issues in the code.
* Add the origins that are used in the application
* Sets up the CORS middleware in order to access some of the endpoints.
* Sets up the database to startup and shutdown.
* Pulls the routes all together from their individual /routes files.

---------
## Frontend Documentation

---------
### Frontend/public
* Static storage for direct public file access

---------
### Frontend/src
* admin/
    * AdminReservationsPage.tsx
        * Admin view of reservations
* assets/
    * Dynamic storage for indirect file access: Imported through React
* footer/
    * CustomerBottomBarContent.tsx
        * Content displayed within MobileBottomBar.tsx for page navigation
    * MobileBottomBar.tsx
        * Dynamic bottom bar based on user role (staff/customer)
    * ReservationLinkIcon.tsx
        * Dynamic icon for bottom bar Reservation button
    * StaffBottomBarContent.tsx
        * Content displayed within MobileBottomBar.tsx for staff page navigation
* login/
    * LoginContent.tsx
        * Login form for customers
    * LoginPage.tsx
        * Login Page
    * SignupContent.tsx
        * Sign up form for customers
    * StaffLogin.tsx
        * Login form for staff
* loyalty/
    * LoyaltyPage.tsx
        * ### Not Implemented
* profile/
    * ChangePassword.tsx
        * Changes the password of the current account
    * EditInfoSection.tsx
        * Contains the change password form
    * ProfilePage.tsx
        * Displays all user information and allows editing data
* reservations/
    * ReservationItem.tsx
        * Displays information on a single reservation and allows editing and deleting the reservation
    * ReservationPage.tsx
        * Displays all the users confirmed reservations
* timeslots/
    * TimeSlotButton.tsx
        * Prompts reservation confirmation using ReservationItem information
    * TimeSlotsContainer.tsx
        * Maps array of TimeSlotButton's in a horizontal scroll display
* app.tsx
    * Route handler
* AuthContext.tsx
    * Login/Logout handler
* HomePage.tsx
    * The default page when using the app (Reservation creation)
* main.tsx
    * Route level app provider
* MakeReservationContent
    * Handles the creation of reservations
    * Input: Date (day, month, year), Guests, Time (HH:MM)
    * Output: Scheduled reservation
* MobileHeader.tsx
    * Page header, dynamically displays page name
    * Burger opens side menu
* PageLayout.tsx
    * Universaal layout
    * Dynamically adjusts appearence and layout