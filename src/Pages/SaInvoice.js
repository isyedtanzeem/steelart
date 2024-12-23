import React, { useState } from "react";
import "./Common.css";
import { ToWords } from "to-words";
import jsPDF from "jspdf";
import Logo from "./Images/hmslogo.png"; // Import your logo image
import waterMark from "./Images/hmswatermark.png"; // Import your logo image
import upi from "./Images/upi.png"; // Import your logo image
import callIcon from "./Images/callicon.png"; // Import your logo image
import Signature from "./Images/signature.png";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const SaInvoice = () => {
  const itemFields = Array.from({ length: 20 }, (_, index) => ({
    [`no${index + 1}Rate`]: "",
    [`no${index + 1}Item`]: "",
    [`qty${index + 1}`]: "",
  }));

  const initialFormData = {
    ...itemFields.reduce((acc, field) => ({ ...acc, ...field }), {}),
    amount1: "",
    name: "",
    mobile: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  let dateForCount = new Date();

  const handleClear = () => {
    const fields = [
      ...Array.from({ length: 20 }, (_, index) => `no${index + 1}Rate`),
      ...Array.from({ length: 20 }, (_, index) => `no${index + 1}Item`),
      ...Array.from({ length: 20 }, (_, index) => `qty${index + 1}`),
      "name",
      "mobile",
      "address",
    ];

    const resetData = fields.reduce((acc, field) => {
      acc[field] = "";
      return acc;
    }, {});

    setFormData(resetData);
  };

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

  const day = dateForCount.getDate();

  let count = day + 166;

  const handleSubmit = (event) => {
    count = count + 1;

    console.log(count, "count");
    event.preventDefault();

    generatePDF(count);
  };

  const generatePDF = (count) => {
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(55);

    pdf.addImage(Logo, "PNG", 20, 8, 16, 16);
    pdf.addImage(waterMark, "PNG", 36, 70, 140, 140);
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(40);
    pdf.setTextColor(46, 57, 150);
    pdf.text("H.M Sanitation", 44, 20);
    pdf.setFont(undefined, "none");
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    pdf.setFontSize(9);
    pdf.text(13, 30, "No. 170,6th cross,Balaji Nagar, Bangalore - 560029");
    pdf.text(
      13,
      34,
      "E-Mail :hmsanitation@gmail.com             Web : www.hmsanitation.in"
    );
    pdf.setFontSize(15);
    pdf.setFont(undefined, "bold");

    pdf.text(160, 18, "Invoice");

    // Add a filled rectangular box to the PDF

    // Set text color to white

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont(undefined, "none");
    pdf.addImage(callIcon, "PNG", 144, 24, 13, 13);

    pdf.text(158, 30, "Huzaifa ");
    pdf.text(158, 36, "7204021703");
    pdf.setFontSize(10);
    //input
    pdf.rect(12, 41, 95, 7);
    pdf.text(`NAME: ${formData.name}`, 13, 45, { align: "left" });
    pdf.rect(12, 48, 95, 7);
    pdf.text(`NUMBER: ${formData.mobile}`, 13, 52.5, { align: "left" });
    pdf.rect(12, 55, 185, 7);
    pdf.text(`ADDRESS: ${formData.address}`, 13, 59.5, { align: "left" });

    const currentDate = new Date().toLocaleDateString();
    var d = new Date();
    var t = new Date().getTime();
    var randomnum = Math.floor(Math.random() * (100 - 50000)) + 100;
    randomnum = d.getFullYear() + (d.getMonth() + 1) + d.getDate() + randomnum;
    randomnum = randomnum + t;
    randomnum = randomnum - 1699000090000;
    console.log(randomnum);
    pdf.rect(107, 41, 90, 7);
    pdf.text(`DATE: ${currentDate}`, 108, 45.4);
    pdf.text(`BILL NO: HMS${randomnum}`, 108, 52.5, { align: "left" });

    pdf.rect(107, 48, 90, 7);

    //end of first layer

    pdf.setFontSize(12);
    pdf.setFillColor(46, 57, 150);
    pdf.rect(12, 66, 185, 7, "F");

    pdf.setFont(undefined, "bold");
    pdf.setTextColor(255, 255, 255);
    pdf.text(`No`, 13, 71);
    pdf.text(`Particulars`, 46, 71);
    pdf.text(`HSN`, 107, 71);
    pdf.text(`Rate`, 126, 71);
    pdf.text(`Unit`, 142, 71);
    pdf.text(`Qty`, 155, 71);
    pdf.text(`Amount`, 172, 71);

    pdf.rect(12, 66, 8, 7);
    pdf.rect(20, 66, 82, 7); //perticular
    pdf.rect(102, 66, 18, 7); //hsn
    pdf.rect(120, 66, 20, 7); //rate
    pdf.rect(140, 66, 12, 7); //unit
    pdf.rect(152, 66, 12, 7); //qty
    pdf.rect(164, 66, 33, 7); //amount

    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "none");

    pdf.setDrawColor(0, 0, 0);

    pdf.rect(12, 73, 8, 7);
    pdf.rect(20, 73, 82, 7); // particular
    pdf.rect(102, 73, 18, 7); // hsn
    pdf.rect(120, 73, 20, 7); // rate
    pdf.rect(140, 73, 12, 7); // unit
    pdf.rect(152, 73, 12, 7); // qty
    pdf.rect(164, 73, 33, 7); // amount
    pdf.text(`01`, 14, 78);
    pdf.text(`${formData.no1Item}`, 22, 78);
    pdf.text(`${formData.hsn1}`, 108, 78);
    pdf.text(`${formData.no1Rate}`, 135, 78, "right");
    pdf.text(`${formData.unit1}`, 148, 78, "right");
    pdf.text(`${formData.qty1}`, 160, 78, "right");
    let amount1 = formData.no1Rate * formData.qty1;
    if (isNaN(amount1) || amount1 === 0) {
      amount1 = "";
    }
    pdf.text(`${amount1}`, 184, 78, "right");

    //1

    //2
    pdf.rect(12, 80, 8, 7);
    pdf.rect(20, 80, 82, 7); // particular
    pdf.rect(102, 80, 18, 7); // hsn
    pdf.rect(120, 80, 20, 7); // rate
    pdf.rect(140, 80, 12, 7); // unit
    pdf.rect(152, 80, 12, 7); // qty
    pdf.rect(164, 80, 33, 7); // amount
    pdf.text(`02`, 14, 85);

   pdf.text(`${formData.no2Item}`, 22, 85);
pdf.text(`${formData.hsn2}`, 108, 85);
pdf.text(`${formData.no2Rate}`, 135, 85, "right");
pdf.text(`${formData.unit2}`, 148, 85, "right");
pdf.text(`${formData.qty2}`, 160, 85, "right");
let amount2 = formData.no2Rate * formData.qty2;
if (isNaN(amount2) || amount2 === 0) {
  amount2 = "";
}
pdf.text(`${amount2}`, 184, 85, "right");
    //3
    pdf.rect(12, 87, 8, 7);
    pdf.rect(20, 87, 82, 7); // particular
    pdf.rect(102, 87, 18, 7); // hsn
    pdf.rect(120, 87, 20, 7); // rate
    pdf.rect(140, 87, 12, 7); // unit
    pdf.rect(152, 87, 12, 7); // qty
    pdf.rect(164, 87, 33, 7); // amount
    pdf.text(`03`, 14, 92);

   pdf.text(`${formData.no3Item}`, 22, 92);
pdf.text(`${formData.hsn3}`, 108, 92);
pdf.text(`${formData.no3Rate}`, 135, 92, "right");
pdf.text(`${formData.unit3}`, 148, 92, "right");
pdf.text(`${formData.qty3}`, 160, 92, "right");
let amount3 = formData.no3Rate * formData.qty3;
if (isNaN(amount3) || amount3 === 0) {
  amount3 = "";
}
pdf.text(`${amount3}`, 184, 92, "right");

    //4
    pdf.rect(12, 94, 8, 7);
    pdf.rect(20, 94, 82, 7); // particular
    pdf.rect(102, 94, 18, 7); // hsn
    pdf.rect(120, 94, 20, 7); // rate
    pdf.rect(140, 94, 12, 7); // unit
    pdf.rect(152, 94, 12, 7); // qty
    pdf.rect(164, 94, 33, 7); // amount
    pdf.text(`04`, 14, 99);
    pdf.text(`${formData.no4Item}`, 22, 99);
    pdf.text(`${formData.hsn4}`, 108, 99);
    pdf.text(`${formData.no4Rate}`, 135, 99, "right");
    pdf.text(`${formData.unit4}`, 148, 99, "right");
    pdf.text(`${formData.qty4}`, 160, 99, "right");
    let amount4 = formData.no4Rate * formData.qty4;
    if (isNaN(amount4) || amount4 === 0) {
      amount4 = "";
    }
    pdf.text(`${amount4}`, 184, 99, "right");
    //5
    pdf.rect(12, 101, 8, 7);
    pdf.rect(20, 101, 82, 7); // particular
    pdf.rect(102, 101, 18, 7); // hsn
    pdf.rect(120, 101, 20, 7); // rate
    pdf.rect(140, 101, 12, 7); // unit
    pdf.rect(152, 101, 12, 7); // qty
    pdf.rect(164, 101, 33, 7); // amount
    pdf.text(`05`, 14, 106);

   pdf.text(`${formData.no5Item}`, 22, 106);
pdf.text(`${formData.hsn5}`, 108, 106);
pdf.text(`${formData.no5Rate}`, 135, 106, "right");
pdf.text(`${formData.unit5}`, 148, 106, "right");
pdf.text(`${formData.qty5}`, 160, 106, "right");
let amount5 = formData.no5Rate * formData.qty5;
if (isNaN(amount5) || amount5 === 0) {
  amount5 = "";
}
pdf.text(`${amount5}`, 184, 106, "right");
    //6
    pdf.rect(12, 108, 8, 7);
    pdf.rect(20, 108, 82, 7); // particular
    pdf.rect(102, 108, 18, 7); // hsn
    pdf.rect(120, 108, 20, 7); // rate
    pdf.rect(140, 108, 12, 7); // unit
    pdf.rect(152, 108, 12, 7); // qty
    pdf.rect(164, 108, 33, 7); // amount
    pdf.text(`06`, 14, 113);

  pdf.text(`${formData.no6Item}`, 22, 113);
pdf.text(`${formData.hsn6}`, 108, 113);
pdf.text(`${formData.no6Rate}`, 135, 113, "right");
pdf.text(`${formData.unit6}`, 148, 113, "right");
pdf.text(`${formData.qty6}`, 160, 113, "right");
let amount6 = formData.no6Rate * formData.qty6;
if (isNaN(amount6) || amount6 === 0) {
  amount6 = "";
}
pdf.text(`${amount6}`, 184, 113, "right");
    //7
    pdf.rect(12, 115, 8, 7);
    pdf.rect(20, 115, 82, 7); // particular
    pdf.rect(102, 115, 18, 7); // hsn
    pdf.rect(120, 115, 20, 7); // rate
    pdf.rect(140, 115, 12, 7); // unit
    pdf.rect(152, 115, 12, 7); // qty
    pdf.rect(164, 115, 33, 7); // amount
    pdf.text(`07`, 14, 120);

    pdf.text(`${formData.no7Item}`, 22, 120);
pdf.text(`${formData.hsn7}`, 108, 120);
pdf.text(`${formData.no7Rate}`, 135, 120, "right");
pdf.text(`${formData.unit7}`, 148, 120, "right");
pdf.text(`${formData.qty7}`, 160, 120, "right");
let amount7 = formData.no7Rate * formData.qty7;
if (isNaN(amount7) || amount7 === 0) {
  amount7 = "";
}
pdf.text(`${amount7}`, 184, 120, "right");
    //8
    pdf.rect(12, 122, 8, 7);
    pdf.rect(20, 122, 82, 7); // particular
    pdf.rect(102, 122, 18, 7); // hsn
    pdf.rect(120, 122, 20, 7); // rate
    pdf.rect(140, 122, 12, 7); // unit
    pdf.rect(152, 122, 12, 7); // qty
    pdf.rect(164, 122, 33, 7); // amount
    pdf.text(`08`, 14, 127);
    pdf.text(`${formData.no8Item}`, 22, 127);
    pdf.text(`${formData.hsn8}`, 108, 127);
    pdf.text(`${formData.no8Rate}`, 135, 127, "right");
    pdf.text(`${formData.unit8}`, 148, 127, "right");
    pdf.text(`${formData.qty8}`, 160, 127, "right");
    let amount8 = formData.no8Rate * formData.qty8;
    if (isNaN(amount8) || amount8 === 0) {
      amount8 = "";
    }
    pdf.text(`${amount8}`, 184, 127, "right");
    //9
    pdf.rect(12, 129, 8, 7);
    pdf.rect(20, 129, 82, 7); // particular
    pdf.rect(102, 129, 18, 7); // hsn
    pdf.rect(120, 129, 20, 7); // rate
    pdf.rect(140, 129, 12, 7); // unit
    pdf.rect(152, 129, 12, 7); // qty
    pdf.rect(164, 129, 33, 7); // amount
    pdf.text(`09`, 14, 134);
    pdf.text(`${formData.no9Item}`, 22, 134);
    pdf.text(`${formData.hsn9}`, 108, 134);
    pdf.text(`${formData.no9Rate}`, 135, 134, "right");
    pdf.text(`${formData.unit9}`, 148, 134, "right");
    pdf.text(`${formData.qty9}`, 160, 134, "right");
    let amount9 = formData.no9Rate * formData.qty9;
    if (isNaN(amount9) || amount9 === 0) {
      amount9 = "";
    }
    pdf.text(`${amount9}`, 184, 134, "right");
    //10
    pdf.rect(12, 136, 8, 7);
    pdf.rect(20, 136, 82, 7); // particular
    pdf.rect(102, 136, 18, 7); // hsn
    pdf.rect(120, 136, 20, 7); // rate
    pdf.rect(140, 136, 12, 7); // unit
    pdf.rect(152, 136, 12, 7); // qty
    pdf.rect(164, 136, 33, 7); // amount
    pdf.text(`10`, 14, 141);
    pdf.text(`${formData.no10Item}`, 22, 141);
    pdf.text(`${formData.hsn10}`, 108, 141);
    pdf.text(`${formData.no10Rate}`, 135, 141, "right");
    pdf.text(`${formData.unit10}`, 148, 141, "right");
    pdf.text(`${formData.qty10}`, 160, 141, "right");
    let amount10 = formData.no10Rate * formData.qty10;
    if (isNaN(amount10) || amount10 === 0) {
      amount10 = "";
    }
    pdf.text(`${amount10}`, 184, 141, "right");
    //11
    pdf.rect(12, 143, 8, 7);
    pdf.rect(20, 143, 82, 7); // particular
    pdf.rect(102, 143, 18, 7); // hsn
    pdf.rect(120, 143, 20, 7); // rate
    pdf.rect(140, 143, 12, 7); // unit
    pdf.rect(152, 143, 12, 7); // qty
    pdf.rect(164, 143, 33, 7); // amount
    pdf.text(`11`, 14, 148);
    pdf.text(`${formData.no11Item}`, 22, 148);
    pdf.text(`${formData.hsn11}`, 108, 148);
    pdf.text(`${formData.no11Rate}`, 135, 148, "right");
    pdf.text(`${formData.unit11}`, 148, 148, "right");
    pdf.text(`${formData.qty11}`, 160, 148, "right");
    let amount11 = formData.no11Rate * formData.qty11;
    if (isNaN(amount11) || amount11 === 0) {
      amount11 = "";
    }
    pdf.text(`${amount11}`, 184, 148, "right");
    //12
    pdf.rect(12, 150, 8, 7);
    pdf.rect(20, 150, 82, 7); // particular
    pdf.rect(102, 150, 18, 7); // hsn
    pdf.rect(120, 150, 20, 7); // rate
    pdf.rect(140, 150, 12, 7); // unit
    pdf.rect(152, 150, 12, 7); // qty
    pdf.rect(164, 150, 33, 7); // amount
    pdf.text(`12`, 14, 155);
    pdf.text(`${formData.no12Item}`, 22, 155);
    pdf.text(`${formData.hsn12}`, 108, 155);
    pdf.text(`${formData.no12Rate}`, 135, 155, "right");
    pdf.text(`${formData.unit12}`, 148, 155, "right");
    pdf.text(`${formData.qty12}`, 160, 155, "right");
    let amount12 = formData.no12Rate * formData.qty12;
    if (isNaN(amount12) || amount12 === 0) {
      amount12 = "";
    }
    pdf.text(`${amount12}`, 184, 155, "right");
    //13
    pdf.rect(12, 157, 8, 7);
    pdf.rect(20, 157, 82, 7); // particular
    pdf.rect(102, 157, 18, 7); // hsn
    pdf.rect(120, 157, 20, 7); // rate
    pdf.rect(140, 157, 12, 7); // unit
    pdf.rect(152, 157, 12, 7); // qty
    pdf.rect(164, 157, 33, 7); // amount
    pdf.text(`13`, 14, 162);
    pdf.text(`${formData.no13Item}`, 22, 162);
    pdf.text(`${formData.hsn13}`, 108, 162);
    pdf.text(`${formData.no13Rate}`, 135, 162, "right");
    pdf.text(`${formData.unit13}`, 148, 162, "right");
    pdf.text(`${formData.qty13}`, 160, 162, "right");
    let amount13 = formData.no13Rate * formData.qty13;
    if (isNaN(amount13) || amount13 === 0) {
      amount13 = "";
    }
    pdf.text(`${amount13}`, 184, 162, "right");
    //14
    pdf.rect(12, 164, 8, 7);
    pdf.rect(20, 164, 82, 7); // particular
    pdf.rect(102, 164, 18, 7); // hsn
    pdf.rect(120, 164, 20, 7); // rate
    pdf.rect(140, 164, 12, 7); // unit
    pdf.rect(152, 164, 12, 7); // qty
    pdf.rect(164, 164, 33, 7); // amount
    pdf.text(`14`, 14, 169);
    pdf.text(`${formData.no14Item}`, 22, 169);
    pdf.text(`${formData.hsn14}`, 108, 169);
    pdf.text(`${formData.no14Rate}`, 135, 169, "right");
    pdf.text(`${formData.unit14}`, 148, 169, "right");
    pdf.text(`${formData.qty14}`, 160, 169, "right");
    let amount14 = formData.no14Rate * formData.qty14;
    if (isNaN(amount14) || amount14 === 0) {
      amount14 = "";
    }
    pdf.text(`${amount14}`, 184, 169, "right");
    //15
    pdf.rect(12, 171, 8, 7);
    pdf.rect(20, 171, 82, 7); // particular
    pdf.rect(102, 171, 18, 7); // hsn
    pdf.rect(120, 171, 20, 7); // rate
    pdf.rect(140, 171, 12, 7); // unit
    pdf.rect(152, 171, 12, 7); // qty
    pdf.rect(164, 171, 33, 7); // amount
    pdf.text("15", 14, 176);
    pdf.text(`${formData.no15Item}`, 22, 176);
    pdf.text(`${formData.hsn15}`, 108, 176);
    pdf.text(`${formData.no15Rate}`, 135, 176, "right");
    pdf.text(`${formData.unit15}`, 148, 176, "right");
    pdf.text(`${formData.qty15}`, 160, 176, "right");
    let amount15 = formData.no15Rate * formData.qty15;
    if (isNaN(amount15) || amount15 === 0) {
      amount15 = "";
    }
    pdf.text(`${amount15}`, 184, 176, "right");
    //16
    pdf.rect(12, 178, 8, 7);
    pdf.rect(20, 178, 82, 7); // particular
    pdf.rect(102, 178, 18, 7); // hsn
    pdf.rect(120, 178, 20, 7); // rate
    pdf.rect(140, 178, 12, 7); // unit
    pdf.rect(152, 178, 12, 7); // qty
    pdf.rect(164, 178, 33, 7); // amount
    pdf.text(`16`, 14, 183);
    pdf.text(`${formData.no16Item}`, 22, 183);
    pdf.text(`${formData.hsn16}`, 108, 183);
    pdf.text(`${formData.no16Rate}`, 135, 183, "right");
    pdf.text(`${formData.unit16}`, 148, 183, "right");
    pdf.text(`${formData.qty16}`, 160, 183, "right");
    let amount16 = formData.no16Rate * formData.qty16;
    if (isNaN(amount16) || amount16 === 0) {
      amount16 = "";
    }
    pdf.text(`${amount16}`, 184, 183, "right");
    //17
    pdf.rect(12, 185, 8, 7);
    pdf.rect(20, 185, 82, 7); // particular
    pdf.rect(102, 185, 18, 7); // hsn
    pdf.rect(120, 185, 20, 7); // rate
    pdf.rect(140, 185, 12, 7); // unit
    pdf.rect(152, 185, 12, 7); // qty
    pdf.rect(164, 185, 33, 7); // amount
    pdf.text(`17`, 14, 190);
    pdf.text(`${formData.no17Item}`, 22, 190);
pdf.text(`${formData.hsn17}`, 108, 190);
pdf.text(`${formData.no17Rate}`, 135, 190, "right");
pdf.text(`${formData.unit17}`, 148, 190, "right");
pdf.text(`${formData.qty17}`, 160, 190, "right");
let amount17 = formData.no17Rate * formData.qty17;
if (isNaN(amount17) || amount17 === 0) {
  amount17 = "";
}
pdf.text(`${amount17}`, 184, 190, "right");
    //18
    pdf.rect(12, 192, 8, 7);
    pdf.rect(20, 192, 82, 7); // particular
    pdf.rect(102, 192, 18, 7); // hsn
    pdf.rect(120, 192, 20, 7); // rate
    pdf.rect(140, 192, 12, 7); // unit
    pdf.rect(152, 192, 12, 7); // qty
    pdf.rect(164, 192, 33, 7); // amount
    pdf.text(`18`, 14, 197);
    pdf.text(`${formData.no18Item}`, 22, 197);
    pdf.text(`${formData.hsn18}`, 108, 197);
    pdf.text(`${formData.no18Rate}`, 135, 197, "right");
    pdf.text(`${formData.unit18}`, 148, 197, "right");
    pdf.text(`${formData.qty18}`, 160, 197, "right");
    let amount18 = formData.no18Rate * formData.qty18;
    if (isNaN(amount18) || amount18 === 0) {
      amount18 = "";
    }
    pdf.text(`${amount18}`, 184, 197, "right");
    //19
    pdf.rect(12, 199, 8, 7);
    pdf.rect(20, 199, 82, 7); // particular
    pdf.rect(102, 199, 18, 7); // hsn
    pdf.rect(120, 199, 20, 7); // rate
    pdf.rect(140, 199, 12, 7); // unit
    pdf.rect(152, 199, 12, 7); // qty
    pdf.rect(164, 199, 33, 7); // amount
    pdf.text(`19`, 14, 204);
    pdf.text(`${formData.no19Item}`, 22, 204);
    pdf.text(`${formData.hsn19}`, 108, 204);
    pdf.text(`${formData.no19Rate}`, 135, 204, "right");
    pdf.text(`${formData.unit19}`, 148, 204, "right");
    pdf.text(`${formData.qty19}`, 160, 204, "right");
    let amount19 = formData.no19Rate * formData.qty19;
    if (isNaN(amount19) || amount19 === 0) {
      amount19 = "";
    }
    pdf.text(`${amount19}`, 184, 204, "right");
    //20
    pdf.rect(12, 206, 8, 7);
    pdf.rect(20, 206, 82, 7); // particular
    pdf.rect(102, 206, 18, 7); // hsn
    pdf.rect(120, 206, 20, 7); // rate
    pdf.rect(140, 206, 12, 7); // unit
    pdf.rect(152, 206, 12, 7); // qty
    pdf.rect(164, 206, 33, 7); // amount
    pdf.text(`20`, 14, 211);
    pdf.text(`${formData.no20Item}`, 22, 211);
    pdf.text(`${formData.hsn20}`, 108, 211);
    pdf.text(`${formData.no20Rate}`, 135, 211, "right");
    pdf.text(`${formData.unit20}`, 148, 211, "right");
    pdf.text(`${formData.qty20}`, 160, 211, "right");
    let amount20 = formData.no20Rate * formData.qty20;
    if (isNaN(amount20) || amount20 === 0) {
      amount20 = "";
    }
    pdf.text(`${amount20}`, 184, 211, "right");

    pdf.rect(154, 213, 43, 10);
    pdf.rect(12, 213, 142, 10);
    pdf.rect(12, 223, 185, 50);
    pdf.setFontSize(14);
    pdf.setFont(undefined, "bold");
    pdf.text(`Total`, 135, 220);
    let totalAmount =
      amount1 +
      amount2 +
      amount3 +
      amount4 +
      amount5 +
      amount6 +
      amount7 +
      amount8 +
      amount9 +
      amount10 +
      amount11 +
      amount12 +
      amount13 +
      amount14 +
      amount15 +
      amount16 +
      amount17 +
      amount18 +
      amount19 +
      amount20;
    pdf.text(`${totalAmount}`, 184, 220, "right");

    pdf.setFontSize(12);

    pdf.setFont(undefined, "none");

    const toWords = new ToWords();
    let inWords = toWords.convert(totalAmount, { currency: true });
    pdf.setFont(undefined, "bold");
    pdf.text(`IN WORDS:`, 14, 230);
    pdf.setFont(undefined, "none");
    pdf.text(`${inWords}`, 14, 235.5);
    pdf.line(12, 237, 197, 237);
    pdf.setFont(undefined, "bold");

    pdf.setFontSize(16);
    pdf.setTextColor(46, 57, 150);

    pdf.text(`For Steel Art`, 136, 244);
    pdf.addImage(Signature, "PNG", 140, 246, 50, 20);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "none");
    let dateFormat = new Date(formData.dateOfDelivery).toLocaleDateString(
      "en-GB"
    );
    console.log(dateFormat);
    if (dateFormat === "Invalid Date") {
      dateFormat = "";
    }
    pdf.setFontSize(12);
    pdf.text(`Date of Delivery: ${dateFormat} `, 14, 260);
    if (formData.deliveredBy === undefined) {
      formData.deliveredBy = "";
    }
    pdf.text(`Delivered By: ${formData.deliveredBy} `, 14, 265);

    pdf.setFontSize(16);

    pdf.text(`Payment Modes:`, 13, 244);
    pdf.setFontSize(14);
    pdf.text(`GPay/PhonePe/Paytm: `, 13, 250);
    pdf.setFont(undefined, "bold");
    pdf.text(`7204021703`, 59, 250);

    // Remove spaces and special characters from name and mobile
    const sanitizedName = formData.name.replace(/[^a-zA-Z0-9]/g, "");

    const pdfName = `Hms_Invoice_${sanitizedName}.pdf`;
    console.log(sanitizedName);

    pdf.save(pdfName);
  };

  return (
    <div className="form-container">
      {/* <h4><Link to="/">Go to Home</Link></h4> */}
      <h4>Steel Art Invoice</h4>

      <form onSubmit={handleSubmit}>
        <div className="display-inline">
          <div className="form-group">
            <input
              type="text"
              className="input margin"
              placeholder="Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              title="Please enter name"
            />
          </div>

          <div className="form-group">
            <input
              className="input margin"
              type="text"
              id="mobile"
              placeholder="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="display-inline">
          <div className="form-group">
            <input
              className="inputAddress "
              type="text"
              id="address"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="display-inline">
          <div className="form-group">
            <label>Date of Delivery</label>
            <input
              className="input margin"
              type="date"
              id="dateOfDelivery"
              placeholder="dateOfDelivery"
              name="dateOfDelivery"
              value={formData.dateOfDelivery}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Delivered By</label>
            <input
              className="input "
              type="text"
              id="deliveredBy"
              placeholder="Delivered By"
              name="deliveredBy"
              value={formData.deliveredBy}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="display-inline ">
          <div className="form-group">
            <label>Particulars</label>
            <input
              className="inputItem margin"
              type="text"
              id="no1Item"
              placeholder="Item 1"
              title="Please enter Item"
              name="no1Item"
              value={formData.no1Item}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>HSN</label>
            <input
              className="inputHsn margin"
              type="text"
              id="hsn1"
              placeholder="Hsn"
              title="Please enter Qty"
              name="hsn1"
              value={formData.hsn1}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Rate</label>
            <input
              className="inputRate margin"
              type="text"
              id="no1Rate"
              placeholder="Rate 1"
              name="no1Rate"
              title="Please enter Rate"
              value={formData.no1Rate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <input
              className="inputQty margin"
              type="text"
              id="unit1"
              placeholder="Unit"
              title="Please enter Unit"
              name="unit1"
              value={formData.unit1}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Qty</label>
            <input
              className="inputQty"
              type="text"
              id="qty1"
              placeholder="Qty 1"
              title="Please enter Qty"
              name="qty1"
              value={formData.qty1}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 2 */}
        <div className="display-inline ">
          <div className="form-group">
            <input
              className="inputItem margin"
              type="text"
              id="no2Item"
              placeholder="Item 2"
              title="Please enter Item"
              name="no2Item"
              value={formData.no2Item}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputHsn margin"
              type="text"
              id="hsn2"
              placeholder="Hsn"
              title="Please enter Qty"
              name="hsn2"
              value={formData.hsn2}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputRate margin"
              type="text"
              id="no2Rate"
              placeholder="Rate 2"
              name="no2Rate"
              title="Please enter Rate"
              value={formData.no2Rate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputQty margin"
              type="text"
              id="unit2"
              placeholder="Uni2"
              title="Please enter Unit"
              name="unit2"
              value={formData.Unit2}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputQty"
              type="text"
              id="qty2"
              placeholder="Qty 2"
              title="Please enter Qty"
              name="qty2"
              value={formData.qty2}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 3 */}
        <div className="display-inline ">
          <div className="form-group">
            <input
              className="inputItem margin"
              type="text"
              id="no3Item"
              placeholder="Item 3"
              title="Please enter Item"
              name="no3Item"
              value={formData.no3Item}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputHsn margin"
              type="text"
              id="hsn3"
              placeholder="Hsn"
              title="Please enter Qty"
              name="hsn3"
              value={formData.hsn3}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputRate margin"
              type="text"
              id="no3Rate"
              placeholder="Rate 3"
              name="no3Rate"
              title="Please enter Rate"
              value={formData.no3Rate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputQty margin"
              type="text"
              id="unit3"
              placeholder="Uni3"
              title="Please enter Unit"
              name="unit3"
              value={formData.Unit3}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputQty"
              type="text"
              id="qty3"
              placeholder="Qty 3"
              title="Please enter Qty"
              name="qty3"
              value={formData.qty3}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 4 */}
        <div className="display-inline ">
          <div className="form-group">
            <input
              className="inputItem margin"
              type="text"
              id="no4Item"
              placeholder="Item 4"
              title="Please enter Item"
              name="no4Item"
              value={formData.no4Item}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputHsn margin"
              type="text"
              id="hsn4"
              placeholder="Hsn"
              title="Please enter Qty"
              name="hsn4"
              value={formData.hsn4}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputRate margin"
              type="text"
              id="no4Rate"
              placeholder="Rate 4"
              name="no4Rate"
              title="Please enter Rate"
              value={formData.no4Rate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputQty margin"
              type="text"
              id="unit4"
              placeholder="Uni4"
              title="Please enter Unit"
              name="unit4"
              value={formData.Unit4}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputQty"
              type="text"
              id="qty4"
              placeholder="Qty 4"
              title="Please enter Qty"
              name="qty4"
              value={formData.qty4}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 5 */}
        <div className="display-inline ">
          <div className="form-group">
            <input
              className="inputItem margin"
              type="text"
              id="no5Item"
              placeholder="Item 5"
              title="Please enter Item"
              name="no5Item"
              value={formData.no5Item}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputHsn margin"
              type="text"
              id="hsn5"
              placeholder="Hsn"
              title="Please enter Qty"
              name="hsn5"
              value={formData.hsn5}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputRate margin"
              type="text"
              id="no5Rate"
              placeholder="Rate 5"
              name="no5Rate"
              title="Please enter Rate"
              value={formData.no5Rate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputQty margin"
              type="text"
              id="unit5"
              placeholder="Uni5"
              title="Please enter Unit"
              name="unit5"
              value={formData.Unit5}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              className="inputQty"
              type="text"
              id="qty5"
              placeholder="Qty 5"
              title="Please enter Qty"
              name="qty5"
              value={formData.qty5}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {formData.no5Rate != "" ? (
          <div>
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no6Item"
                  placeholder="Item 6"
                  title="Please enter Item"
                  name="no6Item"
                  value={formData.no6Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn6"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn6"
                  value={formData.hsn6}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no6Rate"
                  placeholder="Rate 6"
                  name="no6Rate"
                  title="Please enter Rate"
                  value={formData.no6Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit6"
                  placeholder="Uni6"
                  title="Please enter Unit"
                  name="unit6"
                  value={formData.Unit6}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty6"
                  placeholder="Qty 6"
                  title="Please enter Qty"
                  name="qty6"
                  value={formData.qty6}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no7Item"
                  placeholder="Item 7"
                  title="Please enter Item"
                  name="no7Item"
                  value={formData.no7Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn7"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn7"
                  value={formData.hsn7}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no7Rate"
                  placeholder="Rate 7"
                  name="no7Rate"
                  title="Please enter Rate"
                  value={formData.no7Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit7"
                  placeholder="Uni7"
                  title="Please enter Unit"
                  name="unit7"
                  value={formData.Unit7}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty7"
                  placeholder="Qty 7"
                  title="Please enter Qty"
                  name="qty7"
                  value={formData.qty7}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no8Item"
                  placeholder="Item 8"
                  title="Please enter Item"
                  name="no8Item"
                  value={formData.no8Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn8"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn8"
                  value={formData.hsn8}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no8Rate"
                  placeholder="Rate 8"
                  name="no8Rate"
                  title="Please enter Rate"
                  value={formData.no8Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit8"
                  placeholder="Uni8"
                  title="Please enter Unit"
                  name="unit8"
                  value={formData.Unit8}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty8"
                  placeholder="Qty 8"
                  title="Please enter Qty"
                  name="qty8"
                  value={formData.qty8}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no9Item"
                  placeholder="Item 9"
                  title="Please enter Item"
                  name="no9Item"
                  value={formData.no9Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn9"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn9"
                  value={formData.hsn9}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no9Rate"
                  placeholder="Rate 9"
                  name="no9Rate"
                  title="Please enter Rate"
                  value={formData.no9Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit9"
                  placeholder="Uni9"
                  title="Please enter Unit"
                  name="unit9"
                  value={formData.Unit9}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty9"
                  placeholder="Qty 9"
                  title="Please enter Qty"
                  name="qty9"
                  value={formData.qty9}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no10Item"
                  placeholder="Item 10"
                  title="Please enter Item"
                  name="no10Item"
                  value={formData.no10Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn10"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn10"
                  value={formData.hsn10}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no10Rate"
                  placeholder="Rate 10"
                  name="no10Rate"
                  title="Please enter Rate"
                  value={formData.no10Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit10"
                  placeholder="Uni10"
                  title="Please enter Unit"
                  name="unit10"
                  value={formData.Unit10}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty10"
                  placeholder="Qty 10"
                  title="Please enter Qty"
                  name="qty10"
                  value={formData.qty10}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {formData.no10Rate != "" ? (
          <div>
            {/* 11 */}

            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no11Item"
                  placeholder="Item 11"
                  title="Please enter Item"
                  name="no11Item"
                  value={formData.no11Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn11"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn11"
                  value={formData.hsn11}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no11Rate"
                  placeholder="Rate 11"
                  name="no11Rate"
                  title="Please enter Rate"
                  value={formData.no11Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit11"
                  placeholder="Uni11"
                  title="Please enter Unit"
                  name="unit11"
                  value={formData.Unit11}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty11"
                  placeholder="Qty 11"
                  title="Please enter Qty"
                  name="qty11"
                  value={formData.qty11}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 12 */}
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no12Item"
                  placeholder="Item 12"
                  title="Please enter Item"
                  name="no12Item"
                  value={formData.no12Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn12"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn12"
                  value={formData.hsn12}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no12Rate"
                  placeholder="Rate 12"
                  name="no12Rate"
                  title="Please enter Rate"
                  value={formData.no12Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit12"
                  placeholder="Uni12"
                  title="Please enter Unit"
                  name="unit12"
                  value={formData.Unit12}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty12"
                  placeholder="Qty 12"
                  title="Please enter Qty"
                  name="qty12"
                  value={formData.qty12}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 13 */}
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no13Item"
                  placeholder="Item 13"
                  title="Please enter Item"
                  name="no13Item"
                  value={formData.no13Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn13"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn13"
                  value={formData.hsn13}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no13Rate"
                  placeholder="Rate 13"
                  name="no13Rate"
                  title="Please enter Rate"
                  value={formData.no13Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit13"
                  placeholder="Uni13"
                  title="Please enter Unit"
                  name="unit13"
                  value={formData.Unit13}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty13"
                  placeholder="Qty 13"
                  title="Please enter Qty"
                  name="qty13"
                  value={formData.qty13}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 14 */}
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no14Item"
                  placeholder="Item 14"
                  title="Please enter Item"
                  name="no14Item"
                  value={formData.no14Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn14"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn14"
                  value={formData.hsn14}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no14Rate"
                  placeholder="Rate 14"
                  name="no14Rate"
                  title="Please enter Rate"
                  value={formData.no14Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit14"
                  placeholder="Uni14"
                  title="Please enter Unit"
                  name="unit14"
                  value={formData.Unit14}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty14"
                  placeholder="Qty 14"
                  title="Please enter Qty"
                  name="qty14"
                  value={formData.qty14}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 15 */}
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no15Item"
                  placeholder="Item 15"
                  title="Please enter Item"
                  name="no15Item"
                  value={formData.no15Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn15"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn15"
                  value={formData.hsn15}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no15Rate"
                  placeholder="Rate 15"
                  name="no15Rate"
                  title="Please enter Rate"
                  value={formData.no15Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit15"
                  placeholder="Uni15"
                  title="Please enter Unit"
                  name="unit15"
                  value={formData.Unit15}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty15"
                  placeholder="Qty 15"
                  title="Please enter Qty"
                  name="qty15"
                  value={formData.qty15}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {formData.no15Rate != "" ? (
          <div>
            {/* 16 */}
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no16Item"
                  placeholder="Item 16"
                  title="Please enter Item"
                  name="no16Item"
                  value={formData.no16Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn16"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn16"
                  value={formData.hsn16}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no16Rate"
                  placeholder="Rate 16"
                  name="no16Rate"
                  title="Please enter Rate"
                  value={formData.no16Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit16"
                  placeholder="Uni16"
                  title="Please enter Unit"
                  name="unit16"
                  value={formData.Unit16}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty16"
                  placeholder="Qty 16"
                  title="Please enter Qty"
                  name="qty16"
                  value={formData.qty16}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 17 */}
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no17Item"
                  placeholder="Item 17"
                  title="Please enter Item"
                  name="no17Item"
                  value={formData.no17Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn17"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn17"
                  value={formData.hsn17}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no17Rate"
                  placeholder="Rate 17"
                  name="no17Rate"
                  title="Please enter Rate"
                  value={formData.no17Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit17"
                  placeholder="Uni17"
                  title="Please enter Unit"
                  name="unit17"
                  value={formData.Unit17}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty17"
                  placeholder="Qty 17"
                  title="Please enter Qty"
                  name="qty17"
                  value={formData.qty17}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 18 */}
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no18Item"
                  placeholder="Item 18"
                  title="Please enter Item"
                  name="no18Item"
                  value={formData.no18Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn18"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn18"
                  value={formData.hsn18}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no18Rate"
                  placeholder="Rate 18"
                  name="no18Rate"
                  title="Please enter Rate"
                  value={formData.no18Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit18"
                  placeholder="Uni18"
                  title="Please enter Unit"
                  name="unit18"
                  value={formData.Unit18}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty18"
                  placeholder="Qty 18"
                  title="Please enter Qty"
                  name="qty18"
                  value={formData.qty18}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 19 */}
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no19Item"
                  placeholder="Item 19"
                  title="Please enter Item"
                  name="no19Item"
                  value={formData.no19Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn19"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn19"
                  value={formData.hsn19}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no19Rate"
                  placeholder="Rate 19"
                  name="no19Rate"
                  title="Please enter Rate"
                  value={formData.no19Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit19"
                  placeholder="Uni19"
                  title="Please enter Unit"
                  name="unit19"
                  value={formData.Unit19}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty19"
                  placeholder="Qty 19"
                  title="Please enter Qty"
                  name="qty19"
                  value={formData.qty19}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* 20 */}
            <div className="display-inline ">
              <div className="form-group">
                <input
                  className="inputItem margin"
                  type="text"
                  id="no20Item"
                  placeholder="Item 20"
                  title="Please enter Item"
                  name="no20Item"
                  value={formData.no20Item}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputHsn margin"
                  type="text"
                  id="hsn20"
                  placeholder="Hsn"
                  title="Please enter Qty"
                  name="hsn20"
                  value={formData.hsn20}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputRate margin"
                  type="text"
                  id="no20Rate"
                  placeholder="Rate 20"
                  name="no20Rate"
                  title="Please enter Rate"
                  value={formData.no20Rate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty margin"
                  type="text"
                  id="unit20"
                  placeholder="Uni20"
                  title="Please enter Unit"
                  name="unit20"
                  value={formData.Unit20}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="inputQty"
                  type="text"
                  id="qty20"
                  placeholder="Qty 20"
                  title="Please enter Qty"
                  name="qty20"
                  value={formData.qty20}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <button type="submit" className="submit-button margin">
          Download
        </button>
        <button className="submit-button" onClick={handleClear}>
          Clear
        </button>
      </form>
    </div>
  );
};

export default SaInvoice;
