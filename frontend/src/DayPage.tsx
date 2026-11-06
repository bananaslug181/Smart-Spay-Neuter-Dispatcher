import { useNavigate } from 'react-router-dom'

const DayView = () => {
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
                    <h1>Day View</h1>
                </header>

                <h2>Schedule Appointment</h2>


            </body>
        </html>
    )
}

export default DayView