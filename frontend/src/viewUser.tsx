
  // GET USER
  // reference: https://blog.logrocket.com/useeffect-react-hook-complete-guide/ 
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      // get from the backend
      const currentUserID = userID!; // never undefined
      if (!currentUserID) return; // if no user id don't bother getting user
      const data: UserData = await getUser(currentUserID);
      // put the data on the page MAKE SURE DATA EXISTS, if no data then go to edit/add user
      if ((data.first_name || data.last_name)) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhone(data.phone);
        setEmail(data.email);
        setAddress(data.address);
      }
      else {
        // no data or 200 failure, set to edit/make user mode
        setIsEditing(true);
      }
    } catch (error) {
      setError("Failed to get user user.")
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchUser();
    }, [fetchUser]);


return (
<nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Day View</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/users">Profile</Link></li>
      </ul>
    </nav>

<form>
  <div style={{display: 'flex'}}>
    <h1>View Your Profile</h1>
    <div>
        <p>First Name: {first_name}</p>
    </div>
    <div>
        <p>Last Name: {last_name}</p>
    </div>
    <div>
      <p>Phone: {phone}</p>
  </div>
    <div>
        <p>Email: {email}</p>
    </div>
    <div>
        <p>Address: {address}</p>
    </div>
  <button type="submit" onClick={() => setIsEditing(true)}>
    Edit
    </button>
  </div>
  </form>
)