# google calendar sync home and work busy times
A google apps script that will sync busy blocks from your personal calendar to your work calendar

I use this to make sure that my work calendar gets automatically blocked by events that I put on my personal calendar.

This script will take events from your personal calendar and create a corresponding 'busy' event on your work calendar.   By default, it will use the event title 'Booked by personal calendar event (automated)' which can be changed in the google_calendar_sync_home_and_work_busy_times.gs script.

To use this script, go to script.google.com and:
  * Create a new project.  
  * Add 'google_calendar_sync_home_and_work_busy_times.gs' as a file.
  * Edit the script to include your two email addresses.
  * Under Triggers', add a new trigger and make it run the function 'syncPersonalCalendarToWorkBusyEvents' every 30 minutes
  * You will also need to authorize the script to have access to the two calendars.

