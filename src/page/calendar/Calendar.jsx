import { useState } from "react";
import FullCalendar from "@fullcalendar/react"; 
import dayGridPlugin from "@fullcalendar/daygrid"; 
import { Paper, Stack } from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Cookies from "js-cookie";
import "./calendar.css";
import { useEffect } from "react";
import axios from "axios";

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}

const Calendar = () => {
  const [weekendsVisible, setweekendsVisible] = useState(true);
  const [currentEvents, setcurrentEvents] = useState([]);
  const[schedulerData,setSchedulerData]=useState([])
  const[loading,setLoading]=useState(true);
  let newData=[];
  useEffect(()=>{
    const api="http://localhost:8080/getSchedule"
    const token=Cookies.get('jwtToken')
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const fetchTask=async()=>{
      try{
        const response= await axios.get(api,config)
        if(response.status==200){
          console.log("Response recived Sucesfully!!!")
          // console.log(response.data);
          newData=response.data;
           newData=newData.map((data)=>{ return {
            id:data.scheduleId.toString(),
            title:data.projectId+" "+data.userIdOfInstaller,
            start:data.scheduleDate.toString(),
            end:data.scheduleDate.toString(),
          }});
          initialEvents.concat(newData)
          console.log(response.data)
          setSchedulerData(newData)
        }
      }catch(E){
        console.log("Error Sending Request"+E)
      }
    }
    fetchTask()
    return ()=>{
      setSchedulerData(newData)
    }
    
  },[])
  const handleWeekendsToggle = () => {
    setweekendsVisible(!weekendsVisible);
  };

  let eventGuid = 0;
  function createEventId() {
    return String(eventGuid++);
  }

  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your task");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo) => {
    // if (
    //   confirm(
    //     `Are you sure you want to delete the task '${clickInfo.event.title}'`
    //   )
    // ) {
    //   clickInfo.event.remove();
    // }
    alert(clickInfo.event.title)
  };

  const handleEvents = (events) => {
    setcurrentEvents(events);
  };
  const initialEvents = [
    {
      id: "1",
      title: "Task 1",
      start: "2023-10-23",
      end: "2023-10-23",
    },
    {
      id: "2",
      title: "Task 2",
      start: "2023-10-24",
      end: "2023-10-24",
    }
  ];

  return (
    <Stack direction={"row"}>
      <Paper className="demo-app-sidebar">
         
       
       
          <h2 style={{ textAlign: "center" }}>All Tasks ({currentEvents.length})</h2>
          <ul>{currentEvents.map(renderSidebarEvent)}</ul>
         
      </Paper>

      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          initialView="dayGridMonth"
          editable={false}
          selectable={false}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
         events={schedulerData}
           initialEvents={schedulerData} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
        />
      </div>
    </Stack>
  );
};

export default Calendar;
