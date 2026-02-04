const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors()); // Allows all origins (Frontend) to connect
app.use(express.json()); 

// ✅ Test route (Open http://localhost:5000 in browser to check if this works)
app.get("/", (req, res) => {
    res.send("Portfolio Backend is LIVE and Running!");
});

// ✅ Contact form route
app.post("/contact", async (req, res) => {
    console.log("Data Received:", req.body); 

    const { email, phone, project } = req.body;

    if (!email || !phone || !project) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        // Configuration for Gmail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,      
                pass: process.env.EMAIL_PASS   
            }
        });

        const mailOptions = {
            from: process.env.EMAIL, // Gmail usually requires 'from' to be the auth user
            replyTo: email,          // This allows you to reply directly to the sender
            to: process.env.EMAIL,   
            subject: `New Portfolio Message from ${email}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>New Project Inquiry</h2>
                    <p><strong>From:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Project:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 10px;">${project}</blockquote>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        res.status(200).json({ message: "Thank you! I will get back to you soon." });

    } catch (error) {
        console.error("Nodemailer Error:", error.message);
        // If email fails, we still send a 500 so the frontend catch block triggers
        res.status(500).json({ message: "Server encountered an error sending email." });
    }
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server active at http://localhost:${PORT}`);
});