import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "./Invoice.css";
import "jspdf-autotable";
import signature from "./Images/signature.png";
import logo from "./Images/Logo3.png";
import { ToWords } from "to-words";

function QuotationGenerator() {
  const [name, setName] = useState("");
  const [attendName, setAttendName] = useState("");
  const [quotainName, setQuotainName] = useState("");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [customerGST, setCustomerGST] = useState("");

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}`;
  };

  const [invoiceDate, setInvoiceDate] = useState(getCurrentDate());

  const [items, setItems] = useState([
    { description: "", quantity: 1, wpm: "", totalKg: 0, rate: "", amount: 0, unit: "" },
  ]);

  const handleInputChange = (index, e) => {
    const values = [...items];
    values[index][e.target.name] = e.target.value;

    const quantity = parseFloat(values[index].quantity) || 0;
    const wpm = parseFloat(values[index].wpm) || 0;
    const rate = parseFloat(values[index].rate) || 0;

    values[index].totalKg = quantity * wpm;
    values[index].amount = values[index].totalKg * rate;

    setItems(values);
  };

  const addItem = () => {
    if (items.length < 15) {
      setItems([
        ...items,
        { description: "", quantity: 1, wpm: "", totalKg: 0, rate: "", amount: 0, unit: "" },
      ]);
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
  const calculateKg = () => {
    return items.reduce((acc, item) => acc + item.totalKg, 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header Section
    doc.addImage(logo, "PNG", 14, 12, 30, 30);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(1, 84, 7);
    doc.text("STEEL ART", 64, 28);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "none");
    doc.setFontSize(9);
    doc.text("Ground Floor, 240/2, Amalodbhava Nagara, Begur Main Road, Bengaluru - 560068", 54, 34);
    doc.text("GST No: 29AALPZ8892L1Z8", 64, 40);
    doc.text("Mobile: +91 9900 693 336", 122, 40);
    doc.line(14, 50, 200, 50);

    // Quotation Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Quotation`, 94, 48);

    // Quotation Details
    doc.setFontSize(10);
    doc.text(`Date: ${invoiceDate}`, 14, 58);
    doc.text(`Ref: ${name}`, 14, 63);
    doc.text(`${address}`, 20, 68);
    doc.text(`Project:`, 20, 73);
    doc.text(`Kind Attn Mr: ${attendName}`, 20, 78);
    doc.text(`Quotation: ${quotainName}`, 20, 83);
    doc.text(
      `Dear Sir, with reference to the above subject, we are pleased to quote our rates as follows:`,
      20,
      90
    );
    const totalAmount = calculateTotal();
    const totalKg = calculateKg();
    // Table Data
    const headers = [
      ["No", "Description", "Wt p/mtr", "Qty", "Unit", "Total Kg", "Rate", "Amount"],
    ];
    const footer = [
      ["", "", "", "", "", `${totalKg.toFixed(2)}`, "", `${totalAmount.toFixed(2)}`],
    ];
    const data = items.map((item, index) => [
      index + 1,
      item.description,
      item.wpm,
      item.quantity,
      item.unit,
      item.totalKg.toFixed(2),
      item.rate,
      item.amount.toFixed(2),
    ]);

    // Ensure table rows are exactly 15
    const fixedRows = 15;
    while (data.length < fixedRows) {
      data.push(["", "", "", "", "", "", "", ""]);
    }

    doc.autoTable({
      head: headers,
      foot:footer,
      body: data,
      startY: 94,
      theme: "grid",
      headStyles: { fillColor: [1, 84, 7], textColor: [255, 255, 255], fontSize: 9 ,halign: "center"},
      footStyles: { fillColor: [255,255,255], textColor: [0, 0, 0], fontSize: 9 ,halign: "right"},
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        3: { halign: "center" },
        2: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
      },
    });

    // Total Amount
    
    // doc.text(
    //   `Total KG: ${totalKg.toFixed(2)}`,
    //   150,
    //   doc.lastAutoTable.finalY + 6,
    //   "right"
    // );
    // // Total Amount
    
    // doc.text(
    //   `Total Amount: ${totalAmount.toFixed(2)}`,
    //   195,
    //   doc.lastAutoTable.finalY + 6,
    //   "right"
    // );

    // Amount in Words
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        fractionalUnit: { name: "Paisa", plural: "Paise" },
      },
    });
    const inWords = toWords.convert(totalAmount);
    doc.text(`In Words: ${inWords}`, 14, doc.lastAutoTable.finalY + 12);

    // Footer Section
    doc.line(14, doc.lastAutoTable.finalY + 14, 200, doc.lastAutoTable.finalY + 14);
    doc.text(`Note: Any Taxes,other's will be extra.`, 14, doc.lastAutoTable.finalY + 22);
    doc.text(`${note}`, 24, doc.lastAutoTable.finalY + 26);

    doc.setFontSize(13);
    doc.text("For Steel Art", 162, doc.lastAutoTable.finalY + 22);
    doc.addImage(signature, "PNG", 160, doc.lastAutoTable.finalY + 24, 40, 20);

    doc.save(`SaQuote-${name}.pdf`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <h2>Generate Quotation</h2>
      </div>
      <form className="invoice-form" onSubmit={handleSubmit}>
        <div className="input-group">
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
            Quotation To
          </label>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Comapny Name"
              required
            />
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
              value={attendName}
              onChange={(e) => setAttendName(e.target.value)}
              placeholder="Enter Attend Name "
            />
          </div>
          <div>
            <label> </label>
            <input
              type="text"
              value={quotainName}
              onChange={(e) => setQuotainName(e.target.value)}
              placeholder="Enter Quotaion "
            />
          </div>
          <div>
            <label>Note </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter Note "
            />
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
                <label>Weight per mtr</label>
                <input
                  type="text"
                  name="wpm"
                  value={item.wpm}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Enter Weight per miter"
                  required
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
                <input
                  type="text"
                  name="unit"
                  value={item.unit}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Enter Unit"
                />
              </div>
              <div>
                <label>Total kg</label>
                <input type="text" value={item.totalKg} readOnly />
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
                  required
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
          Generate Quotation
        </button>
      </form>
    </div>
  );
}

export default QuotationGenerator;
