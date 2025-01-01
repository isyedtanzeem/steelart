import { Link } from "react-router-dom";
import './Home.css';  // Import your CSS file

function Home() {
  return (
    <div className="container">  
    <h2></h2>  
      <Link to='/SaHome' className="button-fav blue-button">Steel Art</Link>
      <Link to='/MiHome' className="button-fav red-button">Misba </Link>
  

    </div>
  );
}

export default Home;