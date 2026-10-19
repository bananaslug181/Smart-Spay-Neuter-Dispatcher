import { useNavigate } from 'react-router-dom'

const CalendarView = () => {
    const navigate = useNavigate()

    return (
        <html>
            <head>
                <title>Smart Spay/Neuter Dispatcher</title>
                <script src="{{ url_for('static', filename='script.js')}}"></script>
                <link type="text/css" rel="stylesheet" href="{{url_for('static', filename = 'style.css')}}"/>
            </head>
            <body>

                <header>
                    <h1>Calendar View</h1>
                </header>

                <nav>
                    <a href="day.html">Day</a>
                    <a href="calendar.html">Calendar</a>
                    <a href="profile.html">Profile</a>
                </nav>

            </body>
        </html>
    )
}

export default CalendarView