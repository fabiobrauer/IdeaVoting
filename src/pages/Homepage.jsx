import PostComponent from '../assets/Components/post2'
import UserProfile from '../assets/Components/userProfile'
import './Homepage.css'


function Homepage() {


  
  return (
    <> 
    <div className="homepage">   
      <UserProfile></UserProfile>

      <h1>This is Idea Voting</h1>
      <h2>put in any Idea and see if other people resonate</h2>
      
      <div className="post-component-container">
          <PostComponent></PostComponent>
      </div>
    </div>
    </>
  )
}

export default Homepage