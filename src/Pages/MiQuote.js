import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "./Invoice.css";
import "jspdf-autotable";
import signature from "./Images/MIsignature.png";
import logo from "./Images/Logo3.png";
import { ToWords } from "to-words";

function QuotationGenerator() {
  const [name, setName] = useState("");
  const [attendName, setAttendName] = useState("");
  const [quotainName, setQuotainName] = useState("");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [fabricationExpenseAmount, setFabricationExpenseAmount] = useState("");
  const [project, setProject] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [sfAmount, setSfAmount] = useState("");
  const [wastageAmount, setWastageAmount] = useState("");
  const [netProfitAmount, setNetProfitAmount] = useState("");
  const [transportChargesAmount, setTransportChargesAmount] = useState("");

  // State for fabrication charges
  const [fabricationChargesUnit, setFabricationChargesUnit] = useState("");
  const [fabricationChargesQuantity, setFabricationChargesQuantity] =
    useState("");
  const [fabricationChargesRate, setFabricationChargesRate] = useState("");

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

    if (wpm > 0) {
      // If WPM is present, calculate totalKg and amount based on WPM
      values[index].totalKg = quantity * wpm;
      values[index].amount = values[index].totalKg * rate;
    } else {
      // If WPM is not present, calculate amount directly from quantity and rate
      values[index].totalKg = 0; // Reset totalKg as WPM is not considered
      values[index].amount = quantity * rate;
    }

    setItems(values);
  };

  const addItem = () => {
    if (items.length < 15) {
      setItems([
        ...items,
        {
          description: "",
          quantity: 1,
          wpm: "",
          totalKg: 0,
          rate: "",
          amount: 0,
          unit: "",
        },
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

  const fabricationChargesAmount =
    (parseFloat(fabricationChargesQuantity) || 0) *
    (parseFloat(fabricationChargesRate) || 0);
  const calculateTotal = () => {
    // Fixed amounts
    const fabricationExpense = parseFloat(fabricationExpenseAmount || 0);
    const wastage = parseFloat(wastageAmount) || 0;
    const fabricationCharges = parseFloat(fabricationChargesAmount || 0);
    const netProfit = parseFloat(netProfitAmount) || 0;
    const transportCharges = parseFloat(transportChargesAmount) || 0;

    // Calculate total from items
    const itemsTotal = items.reduce((acc, item) => acc + (item.amount || 0), 0);

    // Add fixed amounts
    return (
      itemsTotal +
      fabricationExpense +
      wastage +
      fabricationCharges +
      netProfit +
      transportCharges
    );
  };

  const calculateKg = () => {
    return items.reduce((acc, item) => acc + item.totalKg, 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header Section
    // doc.addImage(logo, "PNG", 14, 12, 30, 30);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 102);
    doc.text("MISBA ENTERPRISES", 32, 28);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "none");
    doc.setFontSize(9);
    doc.text(
      "Ground Floor, No. 6/17/9, Muneer mandir !2th Cross,Kaveri nagar,Hongasandra Bommanahalli, Bengaluru",
      38,
      34
    );
    doc.text("GST No: 29AALPZ8892L2Z7", 64, 40);
    doc.text("Mobile: +91 8073 761 599", 122, 40);
    doc.line(14, 50, 200, 50);

    // Quotation Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Quotation`, 94, 48);

    // Quotation Details
    doc.setFontSize(10);
    doc.text(`Date: ${invoiceDate.split('-').reverse().join('-')}`, 14, 58);
    doc.text(`Ref: ${name}`, 14, 63);
    doc.text(`${address}`, 20, 68);
    doc.text(`Project: ${project}`, 20, 78);
    doc.text(`Kind Attn Mr: ${attendName}`, 20, 73);
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
      [
        "No",
        "Description",
        "Weight",
        "Unit",
        "Qty",
        "Total Kg",
        "Rate",
        "Amount",
      ],
    ];
    const footer = [
      [
        "",
        "",
        "",
        "",
        "",
        `${totalKg.toFixed(2)}`,
        "",
        `${totalAmount.toFixed(2)}`,
      ],
    ];

    // Map dynamic rows from `items`
const dynamicRows = items.map((item, index) => [
  index + 1, // Numbering starts from 1 for dynamic rows
  item.description,
  item.wpm || "",
  item.unit || "",
  item.quantity || "",
  item.totalKg ? item.totalKg.toFixed(2) : "",
  item.rate || "",
  item.amount ? item.amount.toFixed(2) : "",
]);

// Calculate starting index for fixed rows
const startIndexForFixedRows = dynamicRows.length + 1;

// Define fixed rows with dynamic numbering
const fixedRows = [
  [
    `${startIndexForFixedRows}`,
    "Fabrication Expense",
    "",
    "",
    "",
    "",
    "",
    fabricationExpenseAmount
      ? parseFloat(fabricationExpenseAmount).toFixed(2)
      : "",
  ],
  [
    `${startIndexForFixedRows + 1}`,
    "Wastage",
    "",
    "",
    "",
    "",
    "",
    wastageAmount ? parseFloat(wastageAmount).toFixed(2) : "",
  ],
  [
    `${startIndexForFixedRows + 2}`,
    "Fabrication Charges",
    "",
    fabricationChargesUnit || "",
    fabricationChargesQuantity || "",
    "",
    fabricationChargesRate
      ? parseFloat(fabricationChargesRate).toFixed(2)
      : "",
    fabricationChargesAmount
      ? parseFloat(fabricationChargesAmount).toFixed(2)
      : "",
  ],
  [
    `${startIndexForFixedRows + 3}`,
    "Net Profit",
    "",
    "",
    "",
    "",
    "",
    netProfitAmount ? parseFloat(netProfitAmount).toFixed(2) : "",
  ],
  [
    `${startIndexForFixedRows + 4}`,
    "Transport Charges",
    "",
    "",
    "",
    "",
    "",
    transportChargesAmount
      ? parseFloat(transportChargesAmount).toFixed(2)
      : "",
  ],
];

// Combine dynamic rows and fixed rows
let data = [...dynamicRows, ...fixedRows];

// Ensure table rows are exactly 15
const minRows = 15;
while (data.length < minRows) {
  data.push(["", "", "", "", "", "", "", ""]);
}

// Define table with headers, body, and footer
doc.autoTable({
  head: headers,
  body: data,
  foot: footer,
  startY: 94,
  theme: "grid",
  headStyles: {
    fillColor: [0, 0, 102],
    textColor: [255, 255, 255],
    fontSize: 9,
    halign: "center",
  },
  footStyles: {
    fillColor: [255, 255, 255],
    textColor: [0, 0, 0],
    fontSize: 9,
    halign: "right",
  },
  bodyStyles: { fontSize: 9 },
  alternateRowStyles: { fillColor: [245, 245, 245] },
  columnStyles: {
    2: { halign: "center" },
    3: { halign: "center" },
    4: { halign: "center" },
    5: { halign: "right" },
    6: { halign: "right" },
    7: { halign: "right" },
  },
});


    // Combine fixed rows and dynamic rows
  

    // Define table with headers, body, and footer
    doc.autoTable({
      head: headers,
      body: data,
      foot: footer,
      startY: 94,
      theme: "grid",
      headStyles: {
        fillColor: [0, 0, 102],
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: "center",
      },
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 9,
        halign: "right",
      },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
      },
    });

    // Amount in Words
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        fractionalUnit: { name: "Paisa", plural: "Paise" },
      },
    });
    const inWords = toWords.convert(totalAmount);
    doc.text(`${measurement}`, 14, doc.lastAutoTable.finalY + -2);
    doc.text(`${sfAmount}`, 14, doc.lastAutoTable.finalY + 3);
    doc.text(`In Words: ${inWords}`, 14, doc.lastAutoTable.finalY + 12);

    // Footer Section
    doc.line(
      14,
      doc.lastAutoTable.finalY + 14,
      200,
      doc.lastAutoTable.finalY + 14
    );
    doc.text(
      `Note: Any Taxes,other's will be extra.`,
      14,
      doc.lastAutoTable.finalY + 22
    );
    doc.text(`${note}`, 24, doc.lastAutoTable.finalY + 26);

    doc.setFontSize(13);
    doc.text("For Misba Enterprises", 140, doc.lastAutoTable.finalY + 22);
    doc.addImage(signature, "PNG", 145, doc.lastAutoTable.finalY + 24, 40, 20);

    doc.save(`Quote-${name}.pdf`);
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
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="Enter Project "
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
                  placeholder="Enter Weight"
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
                  step="any"
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

<div>
          <h3>Additional Charges</h3>
          <div>
            <label>
              Fabrication Expense:
              <input
                type="number"
                value={fabricationExpenseAmount}
                onChange={(e) => setFabricationExpenseAmount(e.target.value)}
                min="0"
              />
            </label>
          </div>
          <div>
            <label>
              Wastage Amount:
              <input
                type="number"
                value={wastageAmount}
                onChange={(e) => setWastageAmount(e.target.value)}
                min="0"
              />
            </label>
          </div>
          <div>
            <label>
              Net Profit:
              <input
                type="number"
                value={netProfitAmount}
                onChange={(e) => setNetProfitAmount(e.target.value)}
                min="0"
              />
            </label>
          </div>
          <div>
            <label>
              Transport Charges:
              <input
                type="number"
                value={transportChargesAmount}
                onChange={(e) => setTransportChargesAmount(e.target.value)}
                min="0"
              />
            </label>
          </div>
          <h3>Fabrication Charges</h3>
          <div>
            <label>
              Unit:
              <input
                type="text"
                value={fabricationChargesUnit}
                onChange={(e) => setFabricationChargesUnit(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Quantity:
              <input
                type="number"
                value={fabricationChargesQuantity}
                onChange={(e) => setFabricationChargesQuantity(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Rate:
              <input
                type="number"
                value={fabricationChargesRate}
                onChange={(e) => setFabricationChargesRate(e.target.value)}
                min="0"
              />
            </label>
          </div>
        </div>

        
        <div className="total-amount">
          <h3>Total Amount: ₹{calculateTotal().toFixed(2)}</h3>
        </div>
        <div>
          <label>Measurement </label>
          <input
            type="text"
            name="rate"
            value={measurement}
            onChange={(e) => setMeasurement(e.target.value)}
          />
        </div>
        <div>
          <label>Note for per Square feet/meter </label>
          <input
            type="text"
            name="rate"
            value={sfAmount}
            onChange={(e) => setSfAmount(e.target.value)}
          />
        </div>
        <div>
            <label>Description </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter Note "
            />
          </div>
        <button className="generate-button" type="submit">
          Generate Quotation
        </button>
      </form>
    </div>
  );
}

export default QuotationGenerator;
