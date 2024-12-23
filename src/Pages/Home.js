import { Link } from "react-router-dom";
import './Home.css';  // Import your CSS file

function Home() {
  return (
    <div className="container">
      <Link to='/SaInvoice' className="button-fav blue-button">Invoice</Link>
      <Link to='/SaDelivery' className="button-fav red-button">Delivery</Link>
      <Link to='/SaQuote' className="button-fav red-button">Quotation</Link>
    </div>
  );
}

export default Home;
