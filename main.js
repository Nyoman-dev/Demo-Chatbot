/**
 * ============================================
 *    AI Chat Interface — Main Script
 *    Vanilla JS + GSAP
 *    ============================================
 *
 * @format
 */

(function () {
	"use strict";

	// ---- DOM References ----
	const app = document.getElementById("app");
	const chatPanel = document.getElementById("chat-panel");
	const greetingContainer = document.getElementById("greeting-container");
	const greetingSubtitle = document.querySelector(".greeting-subtitle");
	const greetingHeadline = document.querySelector(".greeting-headline");
	const suggestionsGrid = document.getElementById("suggestions-grid");
	const suggestionCards = document.querySelectorAll(".suggestion-card");
	const chatMessages = document.getElementById("chat-messages");
	const inputSection = document.getElementById("input-section");
	const inputWrapper = document.getElementById("input-wrapper");
	const chatInput = document.getElementById("chat-input");
	const sendBtn = document.getElementById("send-btn");
	const disclaimer = document.getElementById("disclaimer");
	const sidebar = document.getElementById("sidebar");
	const sidebarToggle = document.getElementById("sidebar-toggle");
	const closeSidebar = document.getElementById("close-sidebar");
	const sidebarBackdrop = document.getElementById("sidebar-backdrop");
	const chatList = document.getElementById("chat-list");
	const btnNewChat = document.getElementById("btn-new-chat");
	const btnResend = document.getElementById("btn-resend");
	const btnClear = document.getElementById("btn-clear");
	const btnTheme = document.getElementById("btn-theme");
	const themeIcon = document.getElementById("theme-icon");
	const themeText = document.getElementById("theme-text");

	// ---- State ----
	let messages = [];
	let isDarkMode = false;
	let isSidebarOpen = false;
	let isChatting = false;
	let isTyping = false;
	let typingInterval = null;

	// ---- Recent Chats Data ----
	let recentChats = [
		{
			id: 1,
			title: "Membuat fungsi JavaScript async",
			time: "2 menit lalu",
			active: true,
		},
		{
			id: 2,
			title: "Tips desain UI/UX modern",
			time: "1 jam lalu",
			active: false,
		},
		{
			id: 3,
			title: "Penjelasan API REST dan GraphQL",
			time: "3 jam lalu",
			active: false,
		},
		{
			id: 4,
			title: "Struktur database e-commerce",
			time: "Kemarin",
			active: false,
		},
		{ id: 5, title: "Optimasi performa website", time: "Kemarin", active: false },
		{
			id: 6,
			title: "Konsep Docker dan containerization",
			time: "2 hari lalu",
			active: false,
		},
		{
			id: 7,
			title: "Cara menggunakan Git branching",
			time: "3 hari lalu",
			active: false,
		},
	];

	// ---- AI Responses ----
	const aiResponses = {
		"machine learning":
			"Machine learning adalah cabang kecerdasan buatan (AI) yang memungkinkan sistem komputer belajar dan meningkatkan performanya dari pengalaman tanpa diprogram secara eksplisit.\n\nTerdapat tiga jenis utama:\n\n1. **Supervised Learning** — Model dilatih dengan data yang sudah diberi label. Contoh: klasifikasi email spam, prediksi harga rumah.\n\n2. **Unsupervised Learning** — Model mencari pola dalam data tanpa label. Contoh: segmentasi pelanggan, deteksi anomali.\n\n3. **Reinforcement Learning** — Agen belajar melalui interaksi dengan lingkungan, mendapatkan reward atau penalty. Contoh: AlphaGo, robot navigasi.\n\nProses umum meliputi: pengumpulan data, preprocessing, feature engineering, pemilihan model, training, evaluasi, dan deployment.",

		kode:
			'Tentu! Berikut contoh kode JavaScript yang sering digunakan dalam pengembangan web modern:\n\n```javascript\n// Async function untuk fetch data\nasync function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error(response.statusText);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Error:", error.message);\n    return null;\n  }\n}\n```\n\nFungsi di atas menggunakan async/await untuk menangani request HTTP secara asynchronous. Error handling dilakukan dengan try-catch.\n\nApakah Anda ingin saya menjelaskan lebih detail atau membantu dengan kode spesifik?',

		data:
			'Analisis data bisnis yang efektif melibatkan beberapa tahap penting:\n\n**1. Definisikan Tujuan**\nTentukan pertanyaan bisnis yang ingin dijawab. Misalnya: "Mengapa penjualan turun 15% di kuartal ini?"\n\n**2. Kumpulkan Data**\nSumber data bisa dari CRM, Google Analytics, database transaksi, survei pelanggan, atau data sosial media.\n\n**3. Bersihkan Data**\nHandle missing values, outlier, dan inkonsistensi. Data berkualitas adalah fondasi analisis yang akurat.\n\n**4. Analisis**\n- *Deskriptif*: Apa yang terjadi? (dashboard, KPI)\n- *Diagnostik*: Mengapa terjadi? (correlation, root cause)\n- *Prediktif*: Apa yang akan terjadi? (forecasting, ML)\n- *Preskriptif*: Apa yang harus dilakukan? (optimization, recommendation)\n\n**5. Visualisasi & Komunikasi**\nGunakan chart yang tepat untuk audiens. Simpulkan insight yang actionable.\n\nTools populer: Python (pandas, matplotlib), SQL, Tableau, Power BI.',

		konten:
			"Saya bisa membantu Anda membuat berbagai jenis konten kreatif!\n\n**Untuk Media Sosial:**\n- Caption Instagram yang engaging dengan hook yang kuat\n- Thread Twitter yang informatif dan viral\n- Script reel/TikTok dengan pacing yang tepat\n- Konten LinkedIn yang profesional namun personal\n\n**Untuk Blog/Website:**\n- Artikel SEO-friendly dengan struktur H2/H3 yang jelas\n- Listicle yang mudah di-scan\n- How-to guide yang step-by-step\n\n**Untuk Marketing:**\n- Headline yang konversif (A/B test ready)\n- Email sequence yang menjaga engagement\n- Landing page copy dengan CTA yang compelling\n\nBeritahu saya:\n1. Platform apa?\n2. Target audiensnya siapa?\n3. Tone yang diinginkan (formal, kasual, humor, dll)\n4. Tujuan konten (edukasi, entertain, sell)?",

		default:
			"Terima kasih atas pertanyaan Anda. Saya akan berusaha memberikan jawaban yang berguna.\n\nUntuk mendapatkan respons yang lebih tepat, Anda bisa:\n\n- Memberikan lebih banyak konteks tentang kebutuhan Anda\n- Menyebutkan domain atau topik spesifik\n- Menanyakan langkah-langkah praktis yang bisa diikuti\n\nSaya siap membantu di berbagai area seperti teknologi, analisis data, pemrograman, konten kreatif, dan banyak lagi. Silakan lanjutkan!",
	};

	// ---- Initialize ----
	function init() {
		loadThemePreference();
		renderChatList();
		setupEventListeners();
		setupSpotlightEffect();
		runEntranceAnimation();
	}

	// ---- Theme ----
	function loadThemePreference() {
		const saved = localStorage.getItem("ai-chat-theme");
		if (saved === "dark") {
			isDarkMode = true;
			document.documentElement.setAttribute("data-theme", "dark");
			themeIcon.classList.replace("fa-moon", "fa-sun");
			themeText.textContent = "Tema Terang";
		}
	}

	function toggleTheme() {
		isDarkMode = !isDarkMode;
		if (isDarkMode) {
			document.documentElement.setAttribute("data-theme", "dark");
			themeIcon.classList.replace("fa-moon", "fa-sun");
			themeText.textContent = "Tema Terang";
			localStorage.setItem("ai-chat-theme", "dark");
		} else {
			document.documentElement.setAttribute("data-theme", "light");
			themeIcon.classList.replace("fa-sun", "fa-moon");
			themeText.textContent = "Tema Gelap";
			localStorage.setItem("ai-chat-theme", "light");
		}
	}

	// ---- Sidebar ----
	function openSidebar() {
		isSidebarOpen = true;
		sidebar.classList.add("open");
		sidebarBackdrop.classList.add("active");
		// Force reflow for transition
		void sidebarBackdrop.offsetWidth;
		sidebarBackdrop.classList.add("visible");
	}

	function closeSidebarFn() {
		isSidebarOpen = false;
		sidebarBackdrop.classList.remove("visible");
		setTimeout(() => {
			sidebar.classList.remove("open");
			sidebarBackdrop.classList.remove("active");
		}, 300);
	}

	// ---- Card Spotlight Effect ----
	function setupSpotlightEffect() {
		suggestionCards.forEach((card) => {
			card.addEventListener("mousemove", (e) => {
				const rect = card.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				card.style.setProperty("--mouse-x", x + "px");
				card.style.setProperty("--mouse-y", y + "px");
			});

			card.addEventListener("mouseleave", () => {
				card.style.setProperty("--mouse-x", "50%");
				card.style.setProperty("--mouse-y", "50%");
			});
		});
	}

	// ---- Input Handling ----
	function handleInputChange() {
		// Auto-resize
		chatInput.style.height = "auto";
		chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + "px";

		// Enable/disable send button
		const hasText = chatInput.value.trim().length > 0;
		sendBtn.disabled = !hasText;
	}

	function handleInputKeydown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (!sendBtn.disabled && !isTyping) {
				sendMessage();
			}
		}
	}

	// ---- Send Message ----
	function sendMessage(textOverride) {
		const text = (textOverride || chatInput.value).trim();
		if (!text || isTyping) return;

		// If first message, transition to chat mode
		if (!isChatting) {
			transitionToChatMode();
		}

		// Add user message
		const userMsg = { role: "user", content: text };
		messages.push(userMsg);
		renderMessage(userMsg);

		// Clear input
		chatInput.value = "";
		chatInput.style.height = "auto";
		sendBtn.disabled = true;

		// Scroll to bottom
		scrollToBottom();

		// Simulate AI response
		simulateAIResponse(text);
	}

	function transitionToChatMode() {
		isChatting = true;

		const tl = gsap.timeline();
		tl.to(greetingContainer, {
			y: -20,
			opacity: 0,
			duration: 0.35,
			ease: "power2.in",
			onComplete: () => {
				greetingContainer.style.display = "none";
			},
		});
		tl.set(chatMessages, { display: "flex" }, "-=0.1");
		tl.from(chatMessages, {
			opacity: 0,
			duration: 0.3,
			ease: "power2.out",
		});
	}

	function transitionToGreetingMode() {
		isChatting = false;
		messages = [];
		chatMessages.innerHTML = "";
		chatMessages.classList.remove("active");
		chatMessages.style.display = "none";

		greetingContainer.style.display = "flex";

		const tl = gsap.timeline();
		tl.from(greetingContainer, {
			y: 20,
			opacity: 0,
			duration: 0.5,
			ease: "power3.out",
		});
		tl.from(
			greetingSubtitle,
			{
				y: 15,
				opacity: 0,
				duration: 0.4,
				ease: "power3.out",
			},
			"-=0.3",
		);
		tl.from(
			greetingHeadline,
			{
				y: 20,
				opacity: 0,
				duration: 0.45,
				ease: "power3.out",
			},
			"-=0.25",
		);
		tl.from(
			suggestionCards,
			{
				y: 30,
				opacity: 0,
				duration: 0.4,
				stagger: 0.08,
				ease: "power3.out",
			},
			"-=0.2",
		);
	}

	// ---- Render Messages ----
	function renderMessage(msg) {
		const div = document.createElement("div");
		div.className = `message ${msg.role === "user" ? "user-message" : "ai-message"}`;

		const avatar = document.createElement("div");
		avatar.className = "message-avatar";
		if (msg.role === "user") {
			avatar.innerHTML = '<i class="fas fa-user"></i>';
		} else {
			avatar.innerHTML = '<i class="fas fa-sparkles"></i>';
		}

		const bubble = document.createElement("div");
		bubble.className = "message-bubble";

		if (msg.role === "user") {
			bubble.textContent = msg.content;
		} else {
			// AI messages support basic formatting
			bubble.innerHTML = formatAIContent(msg.content);
		}

		div.appendChild(avatar);
		div.appendChild(bubble);
		chatMessages.appendChild(div);
	}

	function formatAIContent(text) {
		// Simple markdown-like formatting
		let formatted = text
			// Bold: **text**
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			// Inline code: `code`
			.replace(
				/`(.*?)`/g,
				'<code style="background:var(--bg-secondary);padding:0.15em 0.4em;border-radius:4px;font-size:0.82em;">$1</code>',
			)
			// Code blocks: ```...```
			.replace(
				/```(\w*)\n?([\s\S]*?)```/g,
				'<pre style="background:var(--bg-secondary);padding:0.75rem 1rem;border-radius:0.5rem;overflow-x:auto;font-size:0.8rem;margin:0.5rem 0;line-height:1.5;"><code>$2</code></pre>',
			)
			// Line breaks
			.replace(/\n/g, "<br>");

		return formatted;
	}

	// ---- AI Response Simulation ----
	function simulateAIResponse(userText) {
		isTyping = true;

		// Show typing indicator
		const typingDiv = document.createElement("div");
		typingDiv.className = "message ai-message";
		typingDiv.id = "typing-indicator-msg";

		const typingAvatar = document.createElement("div");
		typingAvatar.className = "message-avatar";
		typingAvatar.innerHTML = '<i class="fas fa-sparkles"></i>';

		const typingBubble = document.createElement("div");
		typingBubble.className = "message-bubble";

		const typingDots = document.createElement("div");
		typingDots.className = "typing-indicator";
		typingDots.innerHTML = "<span></span><span></span><span></span>";

		typingBubble.appendChild(typingDots);
		typingDiv.appendChild(typingAvatar);
		typingDiv.appendChild(typingBubble);
		chatMessages.appendChild(typingDiv);

		scrollToBottom();

		// Determine response
		const lowerText = userText.toLowerCase();
		let responseText;
		if (lowerText.includes("machine learning") || lowerText.includes("ml")) {
			responseText = aiResponses["machine learning"];
		} else if (
			lowerText.includes("kode") ||
			lowerText.includes("code") ||
			lowerText.includes("javascript") ||
			lowerText.includes("program")
		) {
			responseText = aiResponses["kode"];
		} else if (
			lowerText.includes("data") ||
			lowerText.includes("analisis") ||
			lowerText.includes("bisnis")
		) {
			responseText = aiResponses["data"];
		} else if (
			lowerText.includes("konten") ||
			lowerText.includes("kreatif") ||
			lowerText.includes("media sosial") ||
			lowerText.includes("tulisan")
		) {
			responseText = aiResponses["konten"];
		} else {
			responseText = aiResponses["default"];
		}

		// Simulate typing delay (proportional to response length)
		const delay = 800 + Math.min(responseText.length * 2, 1500);

		setTimeout(() => {
			// Remove typing indicator
			const indicator = document.getElementById("typing-indicator-msg");
			if (indicator) indicator.remove();

			// Add AI message
			const aiMsg = { role: "ai", content: responseText };
			messages.push(aiMsg);

			// Render with typing effect
			const div = document.createElement("div");
			div.className = "message ai-message";

			const avatar = document.createElement("div");
			avatar.className = "message-avatar";
			avatar.innerHTML = '<i class="fas fa-sparkles"></i>';

			const bubble = document.createElement("div");
			bubble.className = "message-bubble";

			div.appendChild(avatar);
			div.appendChild(bubble);
			chatMessages.appendChild(div);

			// Type out the response character by character (simplified — type in chunks for performance)
			typeContent(bubble, responseText, 0, () => {
				isTyping = false;
				scrollToBottom();
			});

			scrollToBottom();

			// Add to recent chats if it's a new topic
			addRecentChat(userText);
		}, delay);
	}

	function typeContent(element, fullText, index, callback) {
		// Type in small chunks for better performance with formatted text
		const chunkSize = 3;
		let currentIndex = index;

		// For formatted content, we'll reveal in larger chunks
		const formattedHTML = formatAIContent(fullText);

		typingInterval = setInterval(() => {
			if (currentIndex < fullText.length) {
				currentIndex = Math.min(currentIndex + chunkSize, fullText.length);
				const partialText = fullText.substring(0, currentIndex);
				element.innerHTML =
					formatAIContent(partialText) +
					'<span class="typing-cursor" style="display:inline-block;width:2px;height:1em;background:var(--accent);margin-left:2px;animation:blink-cursor 0.8s step-end infinite;vertical-align:text-bottom;"></span>';
				scrollToBottom();
			} else {
				clearInterval(typingInterval);
				element.innerHTML = formattedHTML;
				if (callback) callback();
			}
		}, 18);
	}

	// Add blink cursor keyframes dynamically
	const cursorStyle = document.createElement("style");
	cursorStyle.textContent = `
    @keyframes blink-cursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
	document.head.appendChild(cursorStyle);

	// ---- Scroll ----
	function scrollToBottom() {
		requestAnimationFrame(() => {
			chatMessages.scrollTop = chatMessages.scrollHeight;
		});
	}

	// ---- Recent Chats ----
	function renderChatList() {
		if (recentChats.length === 0) {
			chatList.innerHTML =
				'<div class="chat-list-empty">Belum ada riwayat obrolan</div>';
			return;
		}

		chatList.innerHTML = recentChats
			.map(
				(chat) => `
      <div class="chat-list-item ${chat.active ? "active" : ""}" data-id="${chat.id}">
        <span class="chat-list-item-title">${chat.title}</span>
        <span class="chat-list-item-time">${chat.time}</span>
      </div>
    `,
			)
			.join("");

		// Click handlers
		chatList.querySelectorAll(".chat-list-item").forEach((item) => {
			item.addEventListener("click", () => {
				const id = parseInt(item.dataset.id);
				recentChats.forEach((c) => (c.active = c.id === id));
				renderChatList();
				// Close sidebar on mobile
				if (window.innerWidth <= 1024) {
					closeSidebarFn();
				}
			});
		});
	}

	function addRecentChat(title) {
		// Truncate title
		const shortTitle = title.length > 40 ? title.substring(0, 40) + "..." : title;

		// Remove active from all
		recentChats.forEach((c) => (c.active = false));

		// Add to front
		recentChats.unshift({
			id: Date.now(),
			title: shortTitle,
			time: "Baru saja",
			active: true,
		});

		// Keep max 10
		if (recentChats.length > 10) {
			recentChats = recentChats.slice(0, 10);
		}

		renderChatList();
	}

	// ---- Toast Notification ----
	function showToast(message) {
		// Remove existing toast
		const existing = document.querySelector(".toast");
		if (existing) existing.remove();

		const toast = document.createElement("div");
		toast.className = "toast";
		toast.textContent = message;
		document.body.appendChild(toast);

		requestAnimationFrame(() => {
			toast.classList.add("show");
		});

		setTimeout(() => {
			toast.classList.remove("show");
			setTimeout(() => toast.remove(), 300);
		}, 2000);
	}

	// ---- Action Handlers ----
	function handleNewChat() {
		if (isTyping) {
			clearInterval(typingInterval);
			isTyping = false;
		}
		transitionToGreetingMode();
		if (window.innerWidth <= 1024) {
			closeSidebarFn();
		}
	}

	function handleResend() {
		if (isTyping) return;

		// Find last user message
		const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
		if (!lastUserMsg) {
			showToast("Tidak ada pesan untuk dikirim ulang");
			return;
		}

		// Remove last AI message if exists
		const lastAIMsg = [...messages].reverse().find((m) => m.role === "ai");
		if (lastAIMsg) {
			messages.pop();
			// Remove last AI message from DOM
			const aiMsgs = chatMessages.querySelectorAll(".ai-message");
			if (aiMsgs.length > 0) {
				const lastAI = aiMsgs[aiMsgs.length - 1];
				gsap.to(lastAI, {
					opacity: 0,
					y: -10,
					duration: 0.25,
					onComplete: () => lastAI.remove(),
				});
			}
		}

		// Re-send
		setTimeout(() => {
			simulateAIResponse(lastUserMsg.content);
		}, 400);

		if (window.innerWidth <= 1024) {
			closeSidebarFn();
		}
	}

	function handleClearHistory() {
		recentChats = [];
		renderChatList();
		showToast("Riwayat obrolan telah dihapus");
	}

	// ---- Event Listeners ----
	function setupEventListeners() {
		// Theme
		btnTheme.addEventListener("click", toggleTheme);

		// Sidebar toggle
		sidebarToggle.addEventListener("click", openSidebar);
		closeSidebar.addEventListener("click", closeSidebarFn);
		sidebarBackdrop.addEventListener("click", closeSidebarFn);

		// Input
		chatInput.addEventListener("input", handleInputChange);
		chatInput.addEventListener("keydown", handleInputKeydown);

		// Send button
		sendBtn.addEventListener("click", () => {
			if (!isTyping) sendMessage();
		});

		// Suggestion cards
		suggestionCards.forEach((card) => {
			card.addEventListener("click", () => {
				const text = card.getAttribute("data-text");
				chatInput.value = text;
				handleInputChange();
				chatInput.focus();

				// Small delay then send
				setTimeout(() => {
					if (!isTyping) sendMessage(text);
				}, 200);
			});
		});

		// Sidebar actions
		btnNewChat.addEventListener("click", handleNewChat);
		btnResend.addEventListener("click", handleResend);
		btnClear.addEventListener("click", handleClearHistory);

		// Keyboard: Escape closes sidebar
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && isSidebarOpen) {
				closeSidebarFn();
			}
		});

		// Window resize: close sidebar if going from mobile to desktop
		window.addEventListener("resize", () => {
			if (window.innerWidth > 1024 && isSidebarOpen) {
				closeSidebarFn();
			}
		});
	}

	// ---- GSAP Entrance Animation ----
	function runEntranceAnimation() {
		// Set initial states
		gsap.set(greetingSubtitle, { y: 20, opacity: 0 });
		gsap.set(greetingHeadline, { y: 30, opacity: 0 });
		gsap.set(suggestionCards, { y: 40, opacity: 0 });
		gsap.set(inputSection, { y: 15, opacity: 0 });
		gsap.set(disclaimer, { opacity: 0 });
		gsap.set(sidebar, { x: 30, opacity: 0 });

		const tl = gsap.timeline({
			defaults: { ease: "power3.out" },
		});

		tl
			.to(greetingSubtitle, {
				y: 0,
				opacity: 1,
				duration: 0.55,
				delay: 0.15,
			})
			.to(
				greetingHeadline,
				{
					y: 0,
					opacity: 1,
					duration: 0.6,
				},
				"-=0.3",
			)
			.to(
				suggestionCards,
				{
					y: 0,
					opacity: 1,
					duration: 0.45,
					stagger: 0.08,
				},
				"-=0.25",
			)
			.to(
				inputSection,
				{
					y: 0,
					opacity: 1,
					duration: 0.45,
				},
				"-=0.15",
			)
			.to(
				disclaimer,
				{
					opacity: 1,
					duration: 0.35,
				},
				"-=0.2",
			)
			.to(
				sidebar,
				{
					x: 0,
					opacity: 1,
					duration: 0.5,
					ease: "power2.out",
				},
				"-=0.4",
			);
	}

	// ---- Start ----
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
