// Originally from:  https://medium.com/@willroman/auto-block-time-on-your-work-google-calendar-for-your-personal-events-2a752ae91dab#:~:text=Your%20work%20calendar%20will%20now,hide%20any%20additional%20event%20details.
// Host this script on your Work Google drive account. (Host it on the account you want to sync to, not from)
// script.google.com is the place to put this

function syncPersonalCalendarToWorkBusyEvents() {

  var personal_calendar_id = "personal_calendar@gmail.com";     // CHANGE - id of the personal calendar to pull events from
  var work_calendar_id     = "work_calendar@gmail.com";         // CHANGE - id of the work calendar to put busy events on
  var bookedEventTitle     = 'Booked by personal calendar event (automated)'  // CHANGE this to any event title desired

  var today = new Date();
  var enddate = new Date();
  enddate.setDate(today.getDate()+30); // how many days in advance to monitor and block off time

  var personalCalendar = CalendarApp.getCalendarById(personal_calendar_id);
  var personalEvents   = personalCalendar.getEvents(today, enddate);
  var workCalendar     = CalendarApp.getCalendarById(work_calendar_id);
  var workEvents       = workCalendar.getEvents(today, enddate);

  // make sure this is a string that won't get accidentally used in an event description, otherwise things will get deleted accidentally 
  var uniqueStringForDescription = 'Automatically created by the Home/Work calendar busy sync program' 
  
  // remove auto generated work events that are no longer matching the personal calendar
  for (var wc_index in workEvents)
  {
    var matchesAPersonalCalendarEvent = false;
    var workEvent = workEvents[wc_index];
    
    if (workEvent.getDescription() != uniqueStringForDescription) {
      continue;  // not an auto generated event
    } 

    for (var pe_index in personalEvents) // if the secondary event has already been blocked in the primary calendar, ignore it
      {
        var personalEvent = personalEvents[pe_index]
        if ( (workEvent.getStartTime().getTime() == personalEvent.getStartTime().getTime()) &     
             (workEvent.getEndTime().getTime()   == personalEvent.getEndTime().getTime()) )
        {
           matchesAPersonalCalendarEvent = true;
           break;
        }
      }
    
    if (matchesAPersonalCalendarEvent == false) {
      // console.log("Deleting event: " + workEvent.getTitle());
      workEvent.deleteEvent();
    }
  }
 
  // Add busy events that are not yet on the work calendar
  for (var pe_index in personalEvents)
  {
    var alreadExists = false;
    var personalEvent = personalEvents[pe_index];
    
    for (var wc_index in workEvents) // if the secondary event has already been blocked in the primary calendar, ignore it
      {
        var workEvent = workEvents[wc_index]
        if ( (workEvent.getStartTime().getTime() == personalEvent.getStartTime().getTime()) &     
             (workEvent.getEndTime().getTime()   == personalEvent.getEndTime().getTime()) )
        {
           // console.log("Found primary event match: " + workEvent.getTitle());
           alreadExists = true;
           break;
        }
      }
    
    // console.log("Found secondary event: " + personalEvent.getTitle() + " Date: " + personalEvent.getStartTime());
    if (alreadExists == true) continue;
    
    // console.log("Syncing event: " + personalEvent.getTitle());
    var d = personalEvent.getStartTime();
    var dayOfTheWeekNum = d.getDay();

    if (personalEvent.isAllDayEvent()) continue;
    
    if (dayOfTheWeekNum >=1 && dayOfTheWeekNum <= 5) // skip weekends. Delete this if you want to include weekends
    {
      // change the Booked text to whatever you would like your merged event titles to be
      var newEvent = workCalendar.createEvent(bookedEventTitle, 
                                              personalEvent.getStartTime(), 
                                              personalEvent.getEndTime(), 
                                              { description: uniqueStringForDescription }); 
      
      // alternative version below that copies the exact secondary event information into the primary calendar event
      // var newEvent = workCalendar.createEvent(personalEvent.getTitle(), 
      //                                         personalEvent.getStartTime(), 
      //                                         personalEvent.getEndTime(), 
      //                                         { location: personalEvent.getLocation(), 
      //                                           description: uniqueStringForDescription });  

      // console.log("New event created: " + newEvent.getTitle());

      newEvent.removeAllReminders(); // so you don't get double notifications. Delete this if you want to keep the default reminders for your newly created primary calendar events
    }
  }
}
