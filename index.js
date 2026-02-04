document.addEventListener("DOMContentLoaded", () => {
    // ==== Smooth Scroll ====
    const scrollLinks = [
        { id: "homeLink", target: "fit-box" },
        { id: "contactLink", target: "contact" },
        { id: "aboutLink", target: "fraim" }
    ];

    scrollLinks.forEach(link => {
        const el = document.getElementById(link.id);
        if (el) {
            el.addEventListener("click", e => {
                e.preventDefault();
                const targetEl = document.getElementById(link.target);
                if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
            });
        }
    });

    // ==== Mobile Menu Toggle ====
    const menuButton = document.querySelector(".fab.fa-menu");
    const navMenu = document.querySelector(".home");

    if (menuButton && navMenu) {
        menuButton.addEventListener("click", e => {
            e.preventDefault();
            navMenu.classList.toggle("active");
        });
    }

    // ==== Button Hover Animation ====
    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("mouseover", () => {
            btn.style.transform = "scale(1.1)";
            btn.style.transition = "0.3s ease";
        });
        btn.addEventListener("mouseout", () => {
            btn.style.transform = "scale(1)";
        });
    });

    // ==== Card Scroll Animation ====
    const cards = document.querySelectorAll('.card, .fff, .fff1, .fff2');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    }, { threshold: 0.3 });
    cards.forEach(card => observer.observe(card));

    // ==== Contact Form Submission ====
    const contactForm = document.getElementById("contactForm") || document.querySelector(".five form");
    
    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector("button");
            const originalBtnText = submitBtn.textContent;

            // UI Feedback
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const email = this.querySelector("#email")?.value.trim();
            const phone = this.querySelector("#phone")?.value.trim();
            const project = this.querySelector("#project")?.value.trim();

            // Validation check
            if (!email || !phone || !project) {
                alert("Please fill all fields");
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            try {
                // Backend URL
                const response = await fetch("http://localhost:5000/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, phone, project })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message || "Success! Message sent.");
                    this.reset(); // Form clear kar dega
                } else {
                    // Server ne error bheja (e.g. 400 or 500)
                    throw new Error(data.message || "Server error");
                }

            } catch (err) {
                console.error("Submission Error:", err);
                // Agar server start nahi hai toh ye alert chalega
                alert("Connection Error: Backend server (port 5000) is not responding.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});