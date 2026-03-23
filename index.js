document.addEventListener("DOMContentLoaded", () => {
    
    // 1. ==== Smooth Scroll ====
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

    // 2. ==== Mobile Menu Toggle ====
    const menuButton = document.querySelector(".fab.fa-menu");
    const navMenu = document.querySelector(".home");

    if (menuButton && navMenu) {
        menuButton.addEventListener("click", e => {
            e.preventDefault();
            navMenu.classList.toggle("active");
        });
    }

    // 3. ==== Button Hover Animation ====
    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("mouseover", () => {
            btn.style.transform = "scale(1.1)";
            btn.style.transition = "0.3s ease";
        });
        btn.addEventListener("mouseout", () => {
            btn.style.transform = "scale(1)";
        });
    });

    // 4. ==== Card Scroll Animation ====
    const cards = document.querySelectorAll('.card, .fff, .fff1, .fff2');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    }, { threshold: 0.3 });
    cards.forEach(card => observer.observe(card));

    // 5. ==== Contact Form Submission ====
    const contactForm = document.getElementById("contactForm") || document.querySelector(".five form");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector("button");
            const originalBtnText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const email = this.querySelector("#email")?.value.trim();
            const phone = this.querySelector("#phone")?.value.trim();
            const project = this.querySelector("#project")?.value.trim();

            if (!email || !phone || !project) {
                alert("Please fill all fields");
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            try {
                // LIVE RAILWAY URL
                const response = await fetch("https://portfoilobackend-production.up.railway.app/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, phone, project })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message || "Success! Message sent.");
                    this.reset();
                } else {
                    throw new Error(data.message || "Server error");
                }

            } catch (err) {
                console.error("Submission Error:", err);
                alert("Connection Error: Backend server is not responding. Check if Railway is active.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // 6. ==== Loader Logic ====
    const loader = document.querySelector(".loader-wrapper");
    if (loader) {
        setTimeout(() => {
            loader.classList.add("loader-hidden");
            setTimeout(() => {
                loader.style.display = "none";
            }, 800);
        }, 1000); 
    }

}); // Yahan main DOMContentLoaded khatam ho raha hai
