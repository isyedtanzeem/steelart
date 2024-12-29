import { Link } from "react-router-dom";
import './Home.css';  // Import your CSS file

function Home() {
  return (
    <div className="container">  
    <h2>Steel Art</h2>  
      {/* <Link to='/SaQuote' className="button-fav red-button">Quotation</Link> */}
      <Link to='/SaInvoice' className="button-fav blue-button">Invoice</Link>
      <Link to='/SaDelivery' className="button-fav red-button">Delivery Challan</Link>
      {/* <Link to='/SaProforma' className="button-fav blue-button">Proforma</Link> */}
    </div>
  );
}

export default Home;
