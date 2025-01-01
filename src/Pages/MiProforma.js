import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "./Invoice.css";
import "jspdf-autotable";
import signature from "./Images/signature.png";
import logo from "./Images/saLogo.png";
import { ToWords } from "to-words";

function ProformaGenerator() {
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
  const [proformaNumber, setProformaNumber] = useState("");
  const [invoiceNumberError, setInvoiceNumberError] = useState("");
  const [gstType, setGstType] = useState("noGst");
  const [ewayBill, setewayBill] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
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
    if (items.length < 15) {
      setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
    } else {
      console.log("Cannot add more than 15 items");
    }
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

    doc.addImage(logo, "PNG", 14, 12, 30, 30);

    doc.setFontSize(40);
    doc.setTextColor(0, 73, 182);
    doc.setFont("helvetica", "bold");
    doc.text("STEEL ART", 64, 28); // Company Name
    doc.setTextColor(0, 0, 0);
    doc.setFont("calibri", "none");

    doc.setFontSize(9);
    doc.text(
      "Ground Floor, 240/2, Amalodbhava Nagara, Begur Main Road, Bengaluru - 560068",
      54,
      34
    ); // Company Address
    doc.text("GST No: 29AALPZ8892L1Z8", 64, 40); // Company GST No
    doc.text("Mobile: +91 9900 693 336", 122, 40); // Company Mobile No
    doc.line(14, 50, 200, 50);

    // Adding Proforma Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Proforma`, 88, 48);

    // Proforma Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "none");
    doc.setTextColor(0, 0, 0); // Set color to black
    doc.text("Proforma Number: ", 14, 56);
    doc.setTextColor(255, 0, 0); // Set color to red
    doc.text(proformaNumber, doc.getTextWidth("Proforma Number: ") + 14, 56);
    doc.setTextColor(0, 0, 0); // Reset color to black after this
    const formatDate = (date) => {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    };

    doc.text(`Date: ${formatDate(invoiceDate)}`, 14, 62);
    doc.text(`State : Karnataka , State Code : 29`, 14, 68);
    doc.text(`E-Way Bill No: ${ewayBill}`, 130, 56);
    doc.text(`Vehicle No: ${vehicleNo.toLocaleUpperCase()}`, 130, 62);
    doc.line(14, 70, 200, 70);
    doc.text(`Details of Consignee (Billed To)`, 15, 75);
 
    doc.line(14, 78, 200, 78);

    //Billed To
    doc.text(`Name: ${name}`, 14, 83);
    doc.text(`Mobile: ${mobile}`, 14, 88);
    // Address with wrapping
    const maxLineWidth = 98; // Adjust as per your layout
    const wrappedAddress = doc.splitTextToSize(
      `Address: ${address}`,
      maxLineWidth
    );
    doc.text(wrappedAddress, 14, 93);
    doc.text(`GST No: ${customerGST.toLocaleUpperCase()}`, 14, 102);

   

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
    // Ensure the data contains exactly 15 rows
const fixedRows = 15;
while (data.length < fixedRows) {
  data.push(["", "", "", "", "", ""]); // Add blank rows
}

doc.autoTable({
  head: headers,
  body: data.slice(0, fixedRows), // Ensure only the first 15 rows are displayed
  startY: 106,
  theme: "grid",
  headStyles: {
    fillColor: [0, 73, 182], // Blue background for header
    textColor: [255, 255, 255], // White text for header
    fontSize: 9, // Header font size
  },
  bodyStyles: {
    fontSize: 9, // Body font size
  },
  alternateRowStyles: {
    fillColor: [245, 245, 245], // Light gray background for alternate rows
  },
  columnStyles: {
    3: { halign: "right" }, // Right alignment for 'Rate' column
    5: { halign: "center" }, // Center alignment for 'Amount' column
    2: { halign: "center" }, // Center alignment for 'HSN' column
    4: { halign: "center" }, // Center alignment for 'Unit' column
    6: { halign: "right" }, // Right alignment for 'Quantity' column
  },
});


    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
          // can be used to override defaults for the selected locale
          name: "Rupee",
          plural: "Rupees",
          symbol: "₹",
          fractionalUnit: {
            name: "Paisa",
            plural: "Paise",
            symbol: "",
          },
        },
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

    // Calculate all amounts
const finalAmount = totalAmount + gstAmount;
const roundedFinalAmount = Math.round(finalAmount); // Round the total amount to the nearest integer
const roundOffAmount = roundedFinalAmount - finalAmount; // Calculate the rounding adjustment

// Displaying amounts in the PDF
doc.text(
  `Subtotal: ${subTotal.toFixed(2)}`,
  195,
  doc.lastAutoTable.finalY + 6,
  "right"
);
if (cgstAmount > 0 && sgstAmount > 0) {
  doc.text(
    `CGST: ${cgstAmount.toFixed(2)}`,
    195,
    doc.lastAutoTable.finalY + 12,
    "right"
  );
  doc.text(
    `SGST: ${sgstAmount.toFixed(2)}`,
    195,
    doc.lastAutoTable.finalY + 16,
    "right"
  );
} else if (igstAmount > 0) {
  doc.text(
    `IGST: ${igstAmount.toFixed(2)}`,
    195,
    doc.lastAutoTable.finalY + 12,
    "right"
  );
}
doc.text(
  `GST Amount: ${gstAmount.toFixed(2)}`,
  195,
  doc.lastAutoTable.finalY + 20,
  "right"
);
doc.text(
  `Rounding Off: ${roundOffAmount.toFixed(2)}`,
  195,
  doc.lastAutoTable.finalY + 25,
  "right"
);
doc.text(
  `Total Amount: ${roundedFinalAmount.toFixed(2)}`,
  195,
  doc.lastAutoTable.finalY + 32,
  "right"
);

    doc.line(
      14,
      doc.lastAutoTable.finalY + 28,
      200,
      doc.lastAutoTable.finalY + 28
    );
    doc.line(
      14,
      doc.lastAutoTable.finalY + 35,
      200,
      doc.lastAutoTable.finalY + 35
    );

    let inWords = toWords.convert(finalAmount, { currency: true });

    doc.text(`In Words: ${inWords}`, 14, doc.lastAutoTable.finalY + 40);
    doc.line(
      14,
      doc.lastAutoTable.finalY + 42,
      200,
      doc.lastAutoTable.finalY + 42
    );

    doc.setTextColor(0, 73, 182); // Set text color to RGB (237, 104, 2)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13); // Set font size to 14
    doc.text("For Steel Art", 22, doc.lastAutoTable.finalY + 48);
    doc.addImage(signature, "PNG", 20, doc.lastAutoTable.finalY + 50, 40, 20);
    doc.setFont("helvetica", "none");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10); // Set font size to 14
    doc.text("Receiver's Signature", 155, doc.lastAutoTable.finalY + 66);

    // Saving PDF
    doc.save(`SaProforma-${proformaNumber}.pdf`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <h2>Generate Proforma</h2>
      </div>
      <form className="invoice-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <div>
            <input
              type="text"
              value={proformaNumber}
              onChange={(e) => {
                const value = e.target.value;

                // Allow only digits
                if (/^\d*$/.test(value)) {
                  setProformaNumber(value); // Update the Proforma number if it matches the pattern
                  setInvoiceNumberError(""); // Clear the error message if input is valid
                } else {
                  setInvoiceNumberError("Invoice number must be numeric");
                }
              }}
              placeholder="Enter Proforma Number"
              required
            />
            {invoiceNumberError && (
              <div style={{ color: "red" }}>{invoiceNumberError}</div>
            )}{" "}
          </div>

          <div>
            <label>Date:</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label style={{ fontWeight: "bold", fontSize: "20px" }}>
             To
          </label>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Customer Name"
              required
            />
          </div>
          <div>
            <label> </label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter Mobile Number"
            />
            {mobileError && <div style={{ color: "red" }}>{mobileError}</div>}{" "}
            {/* Display error */}
          </div>
          <div>
            <label></label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Address"
            />
          </div>
          <div>
            <label> </label>
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
        </div>
      

        <div className="input-group">
          <div>
            <label></label>
            <input
              type="text"
              value={ewayBill}
              onChange={(e) => setewayBill(e.target.value)}
              placeholder="Enter EWay Bill No"
            />
          </div>
          <div>
            <label></label>
            <input
              type="text"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              placeholder="Enter Vehicle No"
            />
          </div>
          <div className="input-group">
            <label></label>
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
                <label></label>
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Enter Item Description"
                />
              </div>

              <div>
                <label></label>
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
                  step="any" 
                />
              </div>

              <div>
                <label></label>
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
                <label></label>
                <input type="text" value={item.amount} readOnly />
              </div>
            </div>

            <button
              className="remove-button"
              type="button"
              onClick={() => removeItem(index)}
            >
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

        <button className="generate-button" type="submit">
          Generate Proforma
        </button>
      </form>
    </div>
  );
}

export default ProformaGenerator;
