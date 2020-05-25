# Eventify (Group Project)

After pulling project, cd into the project root\
<!-- `cd eventify`\ -->
`npm i`\
`docker-compose up`

Wait until MySQL docker logs say:\
[Server] Running on port:  3000

Access the app using chrome at http://localhost:80/
also able to access at http://34.83.14.253/

To Login:
```
    UserName: johndoe
    Password: password1
```
5 sample events have been preloaded
These sample events don't have categories added to them.

Comments:
    
1. Login Screen:

We can authenticate the login with the user in the database
Display errors if the password or username is wrong
User information is saved into a session which we later use to authenticate and send email

2. Maps Screen
From the maps screen the user can:
    Filter all existing events by Name
    Filter all existing events by category

View Event Details through:
    Clicking on markers
    Clicking on event names in the sidebar

Create New Events 
    Click on the map to add location
        The onclick event will auto populate the address in the correct field

    Fill out form
    Add categories attached
    Add resources attached

    Cancel to return to view events

    Create the event

Attend Events

3. Profile Screen

If user is logged in
    user can modify and update their profile details

The username is not editable

Only the logged in user can modify their profile

4. My Events Screen

Once you create an event on the Maps screen, you can view the event information on there

You also have the option of deleting the event
    If the event is deleted, it will send an email to the user as they set their email on the register screen when creating the account


5. User create (sign up) screen
    If user does not have an account, they can sign up really quickly to get started
    Names cannot have numbers
    Email must be a proper email format 
    If Username already exists, cannot create duplicated account
    Passwords must match
    Password is encrypted in the database

6. User can log out by clicking log out top right corner. 




