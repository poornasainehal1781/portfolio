/**
 * Application Controller & UI Logic for Nehal-GPT Portfolio
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Knowledge Base Engine
    const engine = new KnowledgeEngine(window.NEHAL_PROFILE);

    // State Variables
    let currentModel = "gpt-4o"; // Options: 'gpt-4o', 'deepseek-r1', 'executive'
    let isSpeechEnabled = false;
    let isRecording = false;
    let isGenerating = false;
    let recognition = null;
    let chatHistory = [];

    // DOM Elements
    const chatContainer = document.getElementById("chatContainer");
    const chatThread = document.getElementById("chatThread");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const micBtn = document.getElementById("micBtn");
    const ttsToggleBtn = document.getElementById("ttsToggleBtn");
    const modelSelectBtn = document.getElementById("modelSelectBtn");
    const modelDropdown = document.getElementById("modelDropdown");
    const currentModelName = document.getElementById("currentModelName");
    const currentModelBadge = document.getElementById("currentModelBadge");
    const sidebar = document.getElementById("sidebar");
    const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
    const newChatBtn = document.getElementById("newChatBtn");
    const themeToggleBtn = document.getElementById("themeToggleBtn");

    // Modals
    const resumeModal = document.getElementById("resumeModal");
    const viewResumeBtns = document.querySelectorAll(".view-resume-trigger");
    const closeResumeModal = document.getElementById("closeResumeModal");

    // Initialize Speech Recognition if supported
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            stopMic();
            handleUserSubmit();
        };

        recognition.onerror = () => {
            stopMic();
        };

        recognition.onend = () => {
            stopMic();
        };
    } else {
        if (micBtn) micBtn.style.display = "none";
    }

    // Auto-expand input textarea
    userInput.addEventListener("input", () => {
        userInput.style.height = "auto";
        userInput.style.height = Math.min(userInput.scrollHeight, 160) + "px";
        sendBtn.disabled = userInput.value.trim() === "";
    });

    // Enter key submits (Shift+Enter for newline)
    userInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleUserSubmit();
        }
    });

    sendBtn.addEventListener("click", handleUserSubmit);

    // Prompt Card Click Handlers
    document.querySelectorAll(".prompt-card").forEach(card => {
        card.addEventListener("click", () => {
            const promptText = card.getAttribute("data-prompt");
            if (promptText) {
                userInput.value = promptText;
                handleUserSubmit();
            }
        });
    });

    // Preset Nav Sidebar Items
    document.querySelectorAll(".preset-prompt").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const promptText = item.getAttribute("data-prompt");
            if (promptText) {
                // Highlight active nav
                document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
                item.classList.add("active");
                
                userInput.value = promptText;
                handleUserSubmit();
            }
        });
    });

    // Model Switcher Logic
    modelSelectBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        modelDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!modelDropdown.contains(e.target) && !modelSelectBtn.contains(e.target)) {
            modelDropdown.classList.remove("show");
        }
    });

    document.querySelectorAll(".model-option").forEach(option => {
        option.addEventListener("click", () => {
            const selectedModel = option.getAttribute("data-model");
            currentModel = selectedModel;

            document.querySelectorAll(".model-option").forEach(o => o.classList.remove("active"));
            option.classList.add("active");

            if (selectedModel === "gpt-4o") {
                currentModelName.textContent = "Nehal-GPT 4o";
                currentModelBadge.textContent = "Senior Portfolio";
                currentModelBadge.style.background = "linear-gradient(135deg, #10a37f, #059669)";
            } else if (selectedModel === "deepseek-r1") {
                currentModelName.textContent = "DeepSeek-Nehal R1";
                currentModelBadge.textContent = "Reasoning";
                currentModelBadge.style.background = "linear-gradient(135deg, #3b82f6, #1d4ed8)";
            } else if (selectedModel === "executive") {
                currentModelName.textContent = "Nehal Executive";
                currentModelBadge.textContent = "Fast Summary";
                currentModelBadge.style.background = "linear-gradient(135deg, #ab68ff, #7c3aed)";
            }

            modelDropdown.classList.remove("show");
        });
    });

    // Mic Recording Toggle
    if (micBtn) {
        micBtn.addEventListener("click", () => {
            if (!recognition) return;
            if (isRecording) {
                stopMic();
            } else {
                startMic();
            }
        });
    }

    function startMic() {
        isRecording = true;
        micBtn.classList.add("recording");
        recognition.start();
    }

    function stopMic() {
        isRecording = false;
        micBtn.classList.remove("recording");
        try { recognition.stop(); } catch (err) {}
    }

    // Voice TTS Toggle
    if (ttsToggleBtn) {
        ttsToggleBtn.addEventListener("click", () => {
            isSpeechEnabled = !isSpeechEnabled;
            ttsToggleBtn.classList.toggle("active", isSpeechEnabled);
            if (!isSpeechEnabled && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        });
    }

    // Sidebar Toggle (Mobile / Collapse)
    sidebarToggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    // New Chat Reset
    newChatBtn.addEventListener("click", () => {
        chatThread.innerHTML = "";
        welcomeScreen.style.display = "flex";
        chatHistory = [];
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    });

    // Theme Switcher
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const icon = themeToggleBtn.querySelector("i");
        if (document.body.classList.contains("light-theme")) {
            icon.className = "fa-solid fa-moon";
        } else {
            icon.className = "fa-solid fa-sun";
        }
    });

    // Resume Modal Open/Close, Tabs & Direct Download
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");
    const sidebarDownloadPdfBtn = document.getElementById("sidebarDownloadPdfBtn");
    const tabPdfView = document.getElementById("tabPdfView");
    const tabHtmlView = document.getElementById("tabHtmlView");
    const pdfViewerContainer = document.getElementById("pdfViewerContainer");
    const htmlViewerContainer = document.getElementById("htmlViewerContainer");

    // Tab switcher logic
    if (tabPdfView && tabHtmlView) {
        tabPdfView.addEventListener("click", () => {
            tabPdfView.classList.add("active");
            tabHtmlView.classList.remove("active");
            if (pdfViewerContainer) pdfViewerContainer.style.display = "block";
            if (htmlViewerContainer) htmlViewerContainer.style.display = "none";
        });

        tabHtmlView.addEventListener("click", () => {
            tabHtmlView.classList.add("active");
            tabPdfView.classList.remove("active");
            if (pdfViewerContainer) pdfViewerContainer.style.display = "none";
            if (htmlViewerContainer) htmlViewerContainer.style.display = "block";
        });
    }

    viewResumeBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            resumeModal.classList.add("active");
        });
    });

    if (closeResumeModal) {
        closeResumeModal.addEventListener("click", () => {
            resumeModal.classList.remove("active");
        });
    }

    resumeModal.addEventListener("click", (e) => {
        if (e.target === resumeModal) {
            resumeModal.classList.remove("active");
        }
    });

    // Main Form Submit Handler
    function handleUserSubmit() {
        const text = userInput.value.trim();
        if (!text || isGenerating) return;

        // Hide welcome splash screen on first message
        welcomeScreen.style.display = "none";

        // Append User Message to Chat
        appendUserMessage(text);

        // Reset Input Box
        userInput.value = "";
        userInput.style.height = "auto";
        sendBtn.disabled = true;

        // Generate AI Response
        isGenerating = true;
        const responseData = engine.generateResponse(text, currentModel);

        setTimeout(() => {
            appendAiMessage(responseData);
        }, 300);
    }

    function appendUserMessage(text) {
        const row = document.createElement("div");
        row.className = "message-row user-row";
        row.innerHTML = `
            <div class="message-bubble">
                ${escapeHtml(text)}
            </div>
        `;
        chatThread.appendChild(row);
        scrollToBottom();
    }

    function appendAiMessage(responseData) {
        const row = document.createElement("div");
        row.className = "message-row ai-row";

        const avatar = document.createElement("div");
        avatar.className = "message-avatar ai-avatar";
        avatar.innerHTML = `<i class="fa-solid fa-robot"></i>`;

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";

        row.appendChild(avatar);
        row.appendChild(bubble);
        chatThread.appendChild(row);

        let htmlContainer = "";

        // If DeepSeek-R1, prepend reasoning box
        if (responseData.reasoning) {
            htmlContainer += `
                <details class="reasoning-box" open>
                    <summary><i class="fa-solid fa-brain"></i> Thinking Process (DeepSeek-R1)</summary>
                    <div class="reasoning-content">${escapeHtml(responseData.reasoning)}</div>
                </details>
            `;
        }

        const messageContentDiv = document.createElement("div");
        messageContentDiv.className = "message-content";
        bubble.innerHTML = htmlContainer;
        bubble.appendChild(messageContentDiv);

        // Action icons footer (copy, speak, feedback)
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "message-actions";
        actionsDiv.innerHTML = `
            <button class="msg-action-btn copy-btn" title="Copy text"><i class="fa-regular fa-copy"></i></button>
            <button class="msg-action-btn speak-btn" title="Read out loud"><i class="fa-solid fa-volume-high"></i></button>
            <button class="msg-action-btn" title="Good response"><i class="fa-regular fa-thumbs-up"></i></button>
        `;

        // Stream text effect
        const rawMarkdown = responseData.content;
        streamText(messageContentDiv, rawMarkdown, () => {
            bubble.appendChild(actionsDiv);
            isGenerating = false;
            setupMsgActions(actionsDiv, rawMarkdown);

            if (isSpeechEnabled) {
                speakText(rawMarkdown);
            }
        });
    }

    function streamText(container, markdownText, callback) {
        const html = parseMarkdown(markdownText);
        let currentLen = 0;
        const totalLen = html.length;

        // Fast streaming typing simulation
        const step = Math.max(1, Math.floor(totalLen / 40));
        
        const timer = setInterval(() => {
            currentLen += step;
            if (currentLen >= totalLen) {
                currentLen = totalLen;
                container.innerHTML = html;
                clearInterval(timer);
                scrollToBottom();
                if (callback) callback();
            } else {
                container.innerHTML = html.substring(0, currentLen) + `<span class="typing-cursor"></span>`;
                scrollToBottom();
            }
        }, 15);
    }

    function parseMarkdown(md) {
        let text = md;

        // Headings
        text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="chat-link-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> $1</a>');

        // Tables
        text = text.replace(/\|(.+)\|/g, (match) => {
            const rows = match.split('\n');
            let tableHtml = '<table>';
            rows.forEach((row, i) => {
                if (row.includes('---')) return;
                const cols = row.split('|').filter(c => c.trim() !== '');
                if (cols.length === 0) return;
                tableHtml += '<tr>';
                cols.forEach(cell => {
                    const tag = i === 0 ? 'th' : 'td';
                    tableHtml += `<${tag}>${cell.trim()}</${tag}>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table>';
            return tableHtml;
        });

        // Lists
        text = text.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
        text = text.replace(/<\/ul>\s*<ul>/g, '');

        // Pre code blocks
        text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

        // Paragraphs
        text = text.replace(/\n\n/g, '<br><br>');

        return text;
    }

    function setupMsgActions(actionsDiv, rawText) {
        const copyBtn = actionsDiv.querySelector(".copy-btn");
        const speakBtn = actionsDiv.querySelector(".speak-btn");

        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(rawText);
            copyBtn.innerHTML = `<i class="fa-solid fa-check" style="color:#10a37f"></i>`;
            setTimeout(() => {
                copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i>`;
            }, 2000);
        });

        speakBtn.addEventListener("click", () => {
            speakText(rawText);
        });
    }

    function speakText(text) {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        // Remove markdown symbols for speech
        const cleanText = text.replace(/[*#\_\[\]\(\)]/g, " ");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
});
