import { Link } from "react-router-dom";
import './Home.css';  // Import your CSS file

function Home() {
  return (
    <div className="container">  
    <h2>Misba Enterprises</h2>  
      <Link to='/MiInvoice' className="button-fav blue-button">Invoice</Link>
      <Link to='/MiDelivery' className="button-fav red-button">Delivery Challan</Link>
      <Link to='/MiProforma' className="button-fav blue-button">Proforma</Link>
      <Link to='/MiQuote' className="button-fav red-button">Quotation</Link>

    </div>
  );
}

export default Home;