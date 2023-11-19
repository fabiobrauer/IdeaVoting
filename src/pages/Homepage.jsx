import PostComponent from '../assets/Components/post2'
import UserProfile from '../assets/Components/userProfile'
import LogoutButton from '../assets/Components/Logout'


function Homepage() {


  
  return (
    <>   
        <UserProfile></UserProfile>
        <LogoutButton></LogoutButton>
        <h1>This is Idea Voting</h1>
        <h2>put in any Idea and see if other people resonate</h2>
        <PostComponent></PostComponent>
    </>
  )
}

export default Homepage