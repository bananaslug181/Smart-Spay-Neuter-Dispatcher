import { useNavigate } from 'react-router-dom'

const ProfileView = () => {
    const navigate = useNavigate()

    const userName = "Jessica"

    return (
            <html>
                <head>
                    <title>Smart Spay/Neuter Dispatcher</title>
                    <script src="{{ url_for('static', filename='script.js')}}"></script>
                    <link type="text/css" rel="stylesheet" href="{{url_for('static', filename = 'style.css')}}"/>
                </head>
            <body>

            <header>
                <h1>Profile View</h1>
            </header>

            <nav>
                <a href="day.html">Day</a>
                <a href="calendar.html">Calendar</a>
                <a href="profile.html">Profile</a>
            </nav>

            <h2>Schedule Appointment</h2>

            </body>
        </html>
    )
}

export default ProfileView