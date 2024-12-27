import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "./Invoice.css";
import "jspdf-autotable";
import signature from "./Images/signature.png"
import logo from "./Images/saLogo.png"

function InvoiceGenerator() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [customerGST, setCustomerGST] = useState("");

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    return `$${dd}/${mm}/${yyyy}-`;
  };

  const [invoiceDate, setInvoiceDate] = useState(getCurrentDate()); // Default to today's date

 
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceNumberError, setInvoiceNumberError] = useState("");
  const [gstType, setGstType] = useState("noGst");
  const [invoiceType, setInvoiceType] = useState("Project");

  const [ewayBill, setewayBill] = useState("");
  const [mobileError, setMobileError] = useState("");

  const [items, setItems] = useState([
    
    { description: "", quantity: 1, rate: 0, amount: 0 },
     
  ]);

  const handleInputChange = (index, e) => {
    const values = [...items];
    values[index][e.target.name] = e.target.value;

    // Recalculate amount for the item
    if (e.target.name === "quantity" || e.target.name === "rate") {
      values[index].amount = values[index].quantity * values[index].rate;
    }

    setItems(values);
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, rate: 0, amount: 0 },
      
    ]);
  };
  

  const removeItem = (index) => {
    const values = [...items];
    values.splice(index, 1);
    setItems(values);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.amount, 0);
  };

  const validateGST = (gstNumber) => {
    // Validate if GST number is 15 characters
    return gstNumber.length === 15;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.addImage(logo, 'PNG', 14, 12, 30, 30);

    doc.setFontSize(50);
    doc.setTextColor(0, 74, 173);
    doc.setFont("helvetica", "bold");
    doc.text("STEEL ART", 64, 28); // Company Name
    doc.setTextColor(0, 0, 0);
    doc.setFont("calibri","none");

    doc.setFontSize(10);
    doc.text(
      "Ground Floor, 240/2, Amalodbhava Nagara, Begur Main Road, Bengaluru - 560068",
      54,
      34
    ); // Company Address
    doc.text("GST No: 29AALPZ8892L1Z8", 64, 40); // Company GST No
    doc.text("Mobile: +91 9900 693 336", 122, 40); // Company Mobile No
    doc.line(14, 45, 200, 45);

    // Adding Invoice Title
    doc.setFontSize(18);
    doc.text(`${invoiceType} - Invoice`, 16, 55);
    // doc.text(`${invoiceType}`, 136, 55);

    // Invoice Details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceNumber}`, 14, 68);
    const formatDate = (date) => {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    };

    doc.text(`Invoice Date: ${formatDate(invoiceDate)}`, 130, 68);
    doc.text(`Name: ${name}`, 14, 76);
    doc.text(`Mobile: ${mobile}`, 14, 84);
    doc.text(`Address: ${address}`, 14, 92);
    doc.text(`GST No: ${customerGST}`, 130, 76);
    doc.text(`E-Way Bill No: ${ewayBill}`, 130, 84);

    // Table Headers
    const headers = [
      ["No", "Description", "HSN", "Rate", "Unit", "Qty", "Amount"],
    ];
    const data = items.map((item, index) => [
      index + 1, // Serial number (Sl No)
      item.description,
      item.hsn,
      item.rate,
      item.unit,
      item.quantity,
      item.amount,
    ]);

    // Adding Table to PDF
    doc.autoTable({
      head: headers,
      body: data,
      startY: 100,
      theme: "grid",
      headStyles: {
        fillColor: [0, 74, 173], // Blue background for header
        textColor: [255, 255, 255], // White text for header
        fontSize: 10, // Header font size
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light gray background for alternate rows
      },
      columnStyles: {
        3: { halign: "right", textColor: [0, 128, 0] }, // Green text for the 'Rate' column
        5: { halign: "center", textColor: [255, 0, 0] }, // Red text for the 'Amount' column
        2: { halign: "center" }, // Center alignment for 'HSN' column
        4: { halign: "center" }, // Center alignment for 'Unit' column
        6: { halign: "right" }, // Right alignment for 'Quantity' column
      },
    });
    

    // GST Calculation
    const totalAmount = calculateTotal();
    let gstAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let subTotal = totalAmount;
    if (gstType === "cgstSgst") {
      cgstAmount = totalAmount * 0.09;
      sgstAmount = totalAmount * 0.09;
      gstAmount = cgstAmount + sgstAmount;
    } else if (gstType === "igst") {
      igstAmount = totalAmount * 0.18;
      gstAmount = igstAmount;
    }

    const finalAmount = totalAmount + gstAmount;

    // Displaying GST and Final Amount
    doc.text(
      `Subtotal: ${subTotal.toFixed(2)}`,
      140,
      doc.lastAutoTable.finalY + 10
    );
    if (cgstAmount > 0 && sgstAmount > 0) {
      doc.text(
        `CGST: ${cgstAmount.toFixed(2)}`,
        140,
        doc.lastAutoTable.finalY + 18
      );
      doc.text(
        `SGST: ${sgstAmount.toFixed(2)}`,
        140,
        doc.lastAutoTable.finalY + 26
      );
    } else if (igstAmount > 0) {
      doc.text(
        `IGST: ${igstAmount.toFixed(2)}`,
        140,
        doc.lastAutoTable.finalY + 18
      );
    }
    doc.text(
      `GST Amount: ${gstAmount.toFixed(2)}`,
      140,
      doc.lastAutoTable.finalY + 34
    );
    doc.text(
      `Total Amount: ${finalAmount.toFixed(2)}`,
      140,
      doc.lastAutoTable.finalY + 42
    );
    doc.line(
      14,
      doc.lastAutoTable.finalY + 46,
      200,
      doc.lastAutoTable.finalY + 46
    );
    doc.line(
      14,
      doc.lastAutoTable.finalY + 36,
      200,
      doc.lastAutoTable.finalY + 36
    );

    doc.text("Bank Account Details:", 14, doc.lastAutoTable.finalY + 58);
    doc.text("Kotak Mahindra Bank", 14, doc.lastAutoTable.finalY + 66);
    doc.text("A/C No: 8073761599", 14, doc.lastAutoTable.finalY + 74);
    doc.text("IFSC: KKBK0008057", 14, doc.lastAutoTable.finalY + 82);
    doc.text("Branch: BOMMANAHALLI", 14, doc.lastAutoTable.finalY + 90);

    doc.setTextColor(0, 74, 173); // Set text color to RGB (0, 74, 173)
    doc.setFont("helvetica", "bold");
doc.setFontSize(14); // Set font size to 14
doc.text("For Steel Art", 150, doc.lastAutoTable.finalY + 66);
doc.addImage(signature, 'PNG', 145, doc.lastAutoTable.finalY + 70, 40, 20);
    // Saving PDF
    doc.save("invoice.pdf");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <h2>Generate Invoice</h2>
      </div>
      <form className="invoice-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <div>
            <label>Invoice Number:</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => {
                const value = e.target.value;

                // Allow only digits
                if (/^\d*$/.test(value)) {
                  setInvoiceNumber(value); // Update the invoice number if it matches the pattern
                  setInvoiceNumberError(""); // Clear the error message if input is valid
                } else {
                  setInvoiceNumberError("Invoice number must be numeric");
                }
              }}
              placeholder="Enter Invoice Number"
              required
            />
            {invoiceNumberError && (
              <div style={{ color: "red" }}>{invoiceNumberError}</div>
            )}{" "}
            {/* Display error */}
          </div>

          <div>
            <label>Invoice Date:</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Invoice Type:</label>
            <select
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value)}
             
            >
              <option value="Project">Project</option>
              <option value="Consigment">Consigment</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <div>
            <label>Customer Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Customer Name"
              required
            />
          </div>
          <div>
            <label>Mobile:</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter Mobile Number"
            />
            {mobileError && <div style={{ color: "red" }}>{mobileError}</div>}{" "}
            {/* Display error */}
          </div>
        </div>

        <div className="input-group">
          <div>
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Address"
              required
            />
          </div>
          <div>
            <label>Customer GST No:</label>
            <input
              type="text"
              value={customerGST}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || value.length <= 15) {
                  setCustomerGST(value); // Update only if value is empty or 15 characters or less
                }
              }}
              placeholder="Enter Customer GST No (15 characters)"
            />
          </div>
          <div>
            <label>E-Way Bill No:</label>
            <input
              type="text"
              value={ewayBill}
              onChange={(e) => setewayBill(e.target.value)}
              placeholder="Enter EWay Bill No"
            />
          </div>
          <div className="input-group">
            <label>GST Type:</label>
            <select
              value={gstType}
              onChange={(e) => setGstType(e.target.value)}
              required
            >
              <option value="noGst">No GST</option>
              <option value="cgstSgst">9% CGST + 9% SGST</option>
              <option value="igst">18% IGST</option>
            </select>
          </div>
        </div>

        <h3>Items</h3>
        {items.map((item, index) => (
          <div className="item-row" key={index}>
            <div className="input-group">
              <div>
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Enter Item Description"
                />
              </div>

              <div>
                <label>HSN:</label>
                <input
                  type="text"
                  name="hsn"
                  value={item.hsn}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Enter HSN"
                />
              </div>

              <div>
                <label>Rate:</label>
                <input
                  type="number"
                  name="rate"
                  value={item.rate}
                  onChange={(e) => handleInputChange(index, e)}
                  min="0"
                />
              </div>

              <div>
                <label>Unit:</label>
                <input
                  type="text"
                  name="unit"
                  value={item.unit}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Enter Unit"
                />
              </div>

              <div>
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(index, e)}
                  min="1"
                />
              </div>

              <div>
                <label>Amount:</label>
                <input type="text" value={item.amount} readOnly />
              </div>
            </div>

            <button className="remove-button" type="button" onClick={() => removeItem(index)}>
              Remove Item
            </button>
            <hr />
          </div>
        ))}

        <button className="add-button" type="button" onClick={addItem}>
          Add Item
        </button>
        <br />
        <br />

        <button className="generate-button" type="submit">Generate Invoice</button>
      </form>
    </div>
  );
}

export default InvoiceGenerator;
