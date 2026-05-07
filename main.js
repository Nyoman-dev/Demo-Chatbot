/**
 * ==========================================
 *    Nexus AI Chat — Main JavaScript
 *    Vanilla JS + GSAP Animations
 *    ==========================================
 *
 * @format
 */

(function () {
	"use strict";

	// ---- DOM References ----
	const sidebar = document.getElementById("sidebar");
	const sidebarOpenBtn = document.getElementById("sidebarOpenBtn");
	const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
	const mobileOverlay = document.getElementById("mobileOverlay");
	const navTabs = document.querySelectorAll(".nav-tab");
	const tabIndicator = document.getElementById("tabIndicator");
	const modelTrigger = document.getElementById("modelTrigger");
	const modelDropdown = document.getElementById("modelDropdown");
	const modelLabel = document.getElementById("modelLabel");
	const topbarModel = document.getElementById("topbarModel");
	const modelOptions = document.querySelectorAll(".model-option");
	const newChatBtn = document.getElementById("newChatBtn");
	const messageInput = document.getElementById("messageInput");
	const sendBtn = document.getElementById("sendBtn");
	const themeToggleSidebar = document.getElementById("themeToggleSidebar");
	const themeToggleTopbar = document.getElementById("themeToggleTopbar");
	const categoryCards = document.querySelectorAll(".category-card");
	const historyItems = document.querySelectorAll(".history-item");
	const floatingInput = document.getElementById("floatingInput");

	// ---- State ----
	let sidebarOpen = window.innerWidth >= 1024;
	let dropdownOpen = false;
	let activeTab = "chat";
	let currentModel = "Claude Sonnet 4.6";
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	// ---- Initialize ----
	function init() {
		// Set initial sidebar state for desktop
		if (window.innerWidth >= 1024) {
			sidebar.classList.add("open");
		}

		// Load saved theme
		const savedTheme = localStorage.getItem("nexus-theme");
		if (savedTheme) {
			document.body.setAttribute("data-theme", savedTheme);
		}

		// Init Lucide icons
		if (window.lucide) {
			lucide.createIcons();
		}

		bindEvents();
		if (!prefersReducedMotion) {
			playEntranceAnimation();
		} else {
			// Show everything immediately
			gsap.set(".greeting-section, .input-section, .category-card, .disclaimer", {
				opacity: 1,
				y: 0,
			});
		}
	}

	// ---- Event Binding ----
	function bindEvents() {
		// Sidebar toggle
		sidebarOpenBtn.addEventListener("click", openSidebar);
		sidebarCloseBtn.addEventListener("click", closeSidebar);
		mobileOverlay.addEventListener("click", closeSidebar);

		// Navigation tabs
		navTabs.forEach((tab) => {
			tab.addEventListener("click", () => switchTab(tab.dataset.tab));
		});

		// Model dropdown
		modelTrigger.addEventListener("click", toggleDropdown);
		modelOptions.forEach((opt) => {
			opt.addEventListener("click", () => selectModel(opt));
		});

		// Close dropdown on outside click
		document.addEventListener("click", (e) => {
			if (
				dropdownOpen &&
				!document.getElementById("modelSelector").contains(e.target)
			) {
				closeDropdown();
			}
		});

		// New chat
		newChatBtn.addEventListener("click", handleNewChat);

		// Textarea auto-resize
		messageInput.addEventListener("input", autoResizeTextarea);

		// Send button
		sendBtn.addEventListener("click", handleSend);

		// Enter to send (Shift+Enter for newline)
		messageInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		});

		// Theme toggles
		themeToggleSidebar.addEventListener("click", toggleTheme);
		themeToggleTopbar.addEventListener("click", toggleTheme);

		// Category cards spotlight
		categoryCards.forEach((card) => {
			card.addEventListener("mousemove", (e) => handleSpotlight(e, card));
			card.addEventListener("mouseleave", () => clearSpotlight(card));
			card.addEventListener("click", () => handleCategoryClick(card));
		});

		// History items
		historyItems.forEach((item) => {
			item.addEventListener("click", () => setActiveHistory(item));
		});

		// Resize handler
		window.addEventListener("resize", handleResize);
	}

	// ---- Sidebar Logic ----
	function openSidebar() {
		sidebarOpen = true;
		sidebar.classList.add("open");
		if (!prefersReducedMotion) {
			gsap.to(sidebar, { x: 0, duration: 0.35, ease: "power3.out" });
			gsap.to(mobileOverlay, {
				opacity: 1,
				duration: 0.3,
				onStart: () => mobileOverlay.classList.add("active"),
			});
		}
	}

	function closeSidebar() {
		sidebarOpen = false;
		sidebar.classList.remove("open");
		if (!prefersReducedMotion) {
			gsap.to(sidebar, { x: -260, duration: 0.3, ease: "power3.in" });
			gsap.to(mobileOverlay, {
				opacity: 0,
				duration: 0.2,
				onComplete: () => mobileOverlay.classList.remove("active"),
			});
		}
	}

	function handleResize() {
		if (window.innerWidth >= 1024) {
			mobileOverlay.classList.remove("active");
			gsap.set(mobileOverlay, { opacity: 0 });
			gsap.set(sidebar, { x: 0 });
			sidebar.classList.add("open");
			sidebarOpen = true;
		} else if (!sidebarOpen) {
			gsap.set(sidebar, { x: -260 });
		}
	}

	// ---- Tab Switching ----
	function switchTab(tab) {
		activeTab = tab;
		navTabs.forEach((t) => {
			const isActive = t.dataset.tab === tab;
			t.classList.toggle("active", isActive);
			t.setAttribute("aria-selected", isActive);
		});

		if (tab === "agent") {
			tabIndicator.classList.add("agent");
		} else {
			tabIndicator.classList.remove("agent");
		}

		if (!prefersReducedMotion) {
			gsap.fromTo(tabIndicator, {}, { duration: 0.25, ease: "power2.out" });
		}
	}

	// ---- Model Dropdown ----
	function toggleDropdown() {
		dropdownOpen ? closeDropdown() : openDropdown();
	}

	function openDropdown() {
		dropdownOpen = true;
		modelTrigger.setAttribute("aria-expanded", "true");
		modelDropdown.classList.add("open");
		if (!prefersReducedMotion) {
			gsap.fromTo(
				modelDropdown,
				{ height: 0, opacity: 0 },
				{ height: "auto", opacity: 1, duration: 0.25, ease: "power2.out" },
			);
		} else {
			modelDropdown.style.height = "auto";
			modelDropdown.style.opacity = "1";
		}
	}

	function closeDropdown() {
		dropdownOpen = false;
		modelTrigger.setAttribute("aria-expanded", "false");
		if (!prefersReducedMotion) {
			gsap.to(modelDropdown, {
				height: 0,
				opacity: 0,
				duration: 0.2,
				ease: "power2.in",
				onComplete: () => modelDropdown.classList.remove("open"),
			});
		} else {
			modelDropdown.style.height = "0";
			modelDropdown.style.opacity = "0";
			modelDropdown.classList.remove("open");
		}
	}

	function selectModel(opt) {
		const model = opt.dataset.model;
		currentModel = model;

		// Update UI
		modelLabel.textContent = model;
		topbarModel.textContent = model;

		// Update selected state
		modelOptions.forEach((o) => o.classList.remove("selected"));
		opt.classList.add("selected");

		closeDropdown();

		// Quick feedback animation
		if (!prefersReducedMotion) {
			gsap.fromTo(
				modelTrigger,
				{ scale: 0.97 },
				{ scale: 1, duration: 0.2, ease: "back.out(2)" },
			);
		}
	}

	// ---- New Chat ----
	function handleNewChat() {
		// Remove active from history
		historyItems.forEach((item) => item.classList.remove("active"));

		// Clear input
		messageInput.value = "";
		autoResizeTextarea();

		// Button feedback
		if (!prefersReducedMotion) {
			gsap.fromTo(
				newChatBtn,
				{ scale: 0.95 },
				{ scale: 1, duration: 0.3, ease: "back.out(3)" },
			);
		}

		// Flash effect on button
		newChatBtn.style.borderColor = "var(--accent)";
		newChatBtn.style.color = "var(--accent)";
		newChatBtn.style.background = "var(--accent-glow)";
		setTimeout(() => {
			newChatBtn.style.borderColor = "";
			newChatBtn.style.color = "";
			newChatBtn.style.background = "";
		}, 400);
	}

	// ---- Textarea Auto-Resize ----
	function autoResizeTextarea() {
		messageInput.style.height = "auto";
		messageInput.style.height = Math.min(messageInput.scrollHeight, 160) + "px";
	}

	// ---- Send Message ----
	function handleSend() {
		const text = messageInput.value.trim();
		if (!text) {
			// Shake animation for empty send
			if (!prefersReducedMotion) {
				gsap.to(floatingInput, {
					x: [-6, 6, -4, 4, -2, 0],
					duration: 0.4,
					ease: "power2.out",
				});
			}
			return;
		}

		// Send button animation
		if (!prefersReducedMotion) {
			gsap.to(sendBtn, {
				scale: 0.85,
				duration: 0.1,
				yoyo: true,
				repeat: 1,
				ease: "power2.inOut",
			});
		}

		// Clear input
		messageInput.value = "";
		autoResizeTextarea();
		messageInput.blur();
	}

	// ---- Theme Toggle ----
	function toggleTheme() {
		const body = document.body;
		const current = body.getAttribute("data-theme");
		const next = current === "dark" ? "light" : "dark";
		body.setAttribute("data-theme", next);
		localStorage.setItem("nexus-theme", next);

		// Crossfade animation on theme icon buttons
		if (!prefersReducedMotion) {
			const btns = [themeToggleSidebar, themeToggleTopbar];
			btns.forEach((btn) => {
				gsap.fromTo(
					btn,
					{ rotate: -90, scale: 0.8, opacity: 0.5 },
					{
						rotate: 0,
						scale: 1,
						opacity: 1,
						duration: 0.4,
						ease: "back.out(2)",
					},
				);
			});
		}
	}

	// ---- Card Spotlight Effect ----
	function handleSpotlight(e, card) {
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const spotlight = card.querySelector(".card-spotlight");
		spotlight.style.background = `radial-gradient(300px circle at ${x}px ${y}px, var(--accent-glow-strong), transparent 70%)`;
	}

	function clearSpotlight(card) {
		const spotlight = card.querySelector(".card-spotlight");
		spotlight.style.background = "transparent";
	}

	// ---- Category Card Click ----
	function handleCategoryClick(card) {
		const category = card.dataset.category;
		const prompts = {
			ml: "Explain how to fine-tune a transformer model for text classification",
			prog: "Help me refactor this function to be more performant and readable",
			data: "Show me how to create an interactive dashboard with this dataset",
			creative: "Help me write a compelling product launch email sequence",
		};

		if (prompts[category]) {
			messageInput.value = prompts[category];
			autoResizeTextarea();
			messageInput.focus();

			if (!prefersReducedMotion) {
				gsap.fromTo(
					floatingInput,
					{ scale: 0.98 },
					{ scale: 1, duration: 0.3, ease: "back.out(2)" },
				);
			}
		}
	}

	// ---- History Item Active ----
	function setActiveHistory(item) {
		historyItems.forEach((h) => h.classList.remove("active"));
		item.classList.add("active");

		if (!prefersReducedMotion) {
			gsap.fromTo(item, { x: -4 }, { x: 0, duration: 0.25, ease: "power2.out" });
		}

		// Close sidebar on mobile after selection
		if (window.innerWidth < 1024) {
			setTimeout(closeSidebar, 200);
		}
	}

	// ---- Entrance Animation ----
	function playEntranceAnimation() {
		const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

		// Sidebar slides in
		tl.fromTo(
			sidebar,
			{ x: -260, opacity: 0 },
			{ x: 0, opacity: 1, duration: 0.5 },
		);

		// Greeting fades up
		tl.fromTo(
			".greeting-title",
			{ y: 30, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.6 },
			"-=0.15",
		);
		tl.fromTo(
			".greeting-subtitle",
			{ y: 20, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.5 },
			"-=0.4",
		);

		// Floating input slides up
		tl.fromTo(
			".input-section",
			{ y: 25, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.5 },
			"-=0.3",
		);

		// Category cards stagger in
		tl.fromTo(
			".category-card",
			{ y: 20, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				duration: 0.4,
				stagger: 0.08,
			},
			"-=0.25",
		);

		// Disclaimer fades in
		tl.fromTo(
			".disclaimer",
			{ opacity: 0 },
			{ opacity: 1, duration: 0.4 },
			"-=0.15",
		);

		// Sidebar elements stagger (slightly delayed)
		tl.fromTo(
			".sidebar-header",
			{ x: -20, opacity: 0 },
			{ x: 0, opacity: 1, duration: 0.3 },
			"-=1.0",
		);
		tl.fromTo(
			".nav-tabs",
			{ y: 10, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.3 },
			"-=0.8",
		);
		tl.fromTo(
			".model-selector",
			{ y: 10, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.3 },
			"-=0.65",
		);
		tl.fromTo(
			".new-chat-btn",
			{ y: 10, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.3 },
			"-=0.5",
		);
		tl.fromTo(
			".history-group",
			{ x: -15, opacity: 0 },
			{ x: 0, opacity: 1, duration: 0.3, stagger: 0.06 },
			"-=0.4",
		);
		tl.fromTo(
			".sidebar-footer",
			{ y: 10, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.3 },
			"-=0.3",
		);
	}

	// ---- Keyboard: Escape to close ----
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			if (dropdownOpen) closeDropdown();
			if (sidebarOpen && window.innerWidth < 1024) closeSidebar();
		}
	});

	// ---- Start ----
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
