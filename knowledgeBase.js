/**
 * Knowledge Base & Response Generator Engine for Poorna Sai Nehal's Portfolio
 */

const NEHAL_PROFILE = {
    name: "Pottapinjara Poorna Sai Nehal",
    shortName: "Poorna Sai Nehal",
    title: "Computer Science Undergraduate | AI & Full-Stack Developer",
    phone: "+91-70325-42246",
    email: "poornasai113@gmail.com",
    github: "https://github.com/poornasainehal1781",
    linkedin: "https://www.linkedin.com/in/poornsainehal/",
    university: "SR University, Warangal, Telangana",
    degree: "B.Tech in Computer Science & Engineering",
    cgpa: "8.15 / 10",
    batch: "2023 – 2027",
    summary: "Computer Science undergraduate with strong foundations in Python, Java, SQL, Data Structures & Algorithms, and Full Stack Development. Passionate about building AI-powered applications, LLM agents, and scalable software solutions.",
    
    certifications: [
        {
            name: "Microsoft Azure AI-900",
            issuer: "Microsoft",
            title: "Azure AI Fundamentals",
            badgeIcon: "fa-brands fa-microsoft"
        }
    ],

    skills: {
        languages: ["Python", "Java", "SQL"],
        web: ["HTML5", "CSS3", "JavaScript", "React.js", "Flask", "Streamlit", "REST APIs"],
        mlData: ["pandas", "scikit-learn", "Altair", "NLP", "Large Language Models (LLMs)", "Prompt Engineering", "Data Visualization"],
        databases: ["MySQL"],
        tools: ["Git", "GitHub", "VS Code", "Vercel", "MySQL", "OpenRouter API"]
    },

    projects: [
        {
            id: "placement-pilot",
            title: "AI Placement Mentor – AI-Powered Resume Analyzer & Interview Preparation Platform",
            category: "Full-Stack AI Platform",
            date: "2026",
            tech: ["Python", "Flask", "React.js", "MySQL", "OpenRouter API", "NLP", "Prompt Engineering"],
            liveUrl: "https://placement-pilot-five.vercel.app",
            githubUrl: "https://github.com/poornasainehal1781",
            summary: "AI-Powered Resume Analyzer & Interview Preparation Platform.",
            highlights: [
                "Engineered a full-stack AI platform that analyzes resumes and generates ATS compatibility scores, reducing manual resume review effort by an estimated 40%.",
                "Designed an NLP-driven analysis engine that extracts 15+ resume attributes (skills, projects, technologies, experience) to auto-generate 50+ tailored, technology-specific interview questions per candidate.",
                "Deployed a production-ready React.js, Flask, and MySQL application with secure resume upload and an interactive dashboard, supporting concurrent multi-user sessions."
            ]
        },
        {
            id: "prompt2program",
            title: "Prompt2Program – AI Code Generator",
            category: "Generative AI Web App",
            date: "Mar 2024",
            tech: ["Python", "Streamlit", "OpenRouter API", "Generative AI"],
            liveUrl: "https://aiac-project-holxwbcahffhefb2ebuvxq.streamlit.app/",
            githubUrl: "https://github.com/poornasainehal1781",
            summary: "AI-powered web app that converts natural language prompts into functional code.",
            highlights: [
                "Built an AI-powered web application that converts natural language prompts into functional code across multiple programming languages.",
                "Integrated the OpenRouter API to deliver real-time code explanations and sample outputs, improving user comprehension of generated code.",
                "Implemented secure, session-based API handling within a responsive Streamlit UI, ensuring reliable performance under concurrent use."
            ]
        },
        {
            id: "ipl-merchandise",
            title: "IPL Merchandise E-Commerce Website",
            category: "Frontend Web Application",
            date: "Oct 2024",
            tech: ["HTML", "CSS", "JavaScript"],
            liveUrl: "https://iplclone-ruby.vercel.app",
            githubUrl: "https://github.com/poornasainehal1781",
            summary: "Responsive e-commerce website showcasing 30+ products across 10 IPL teams.",
            highlights: [
                "Launched a responsive e-commerce website showcasing 30+ products across 10 IPL teams.",
                "Engineered dynamic product filtering by team and category, cutting average product search time by roughly 30%.",
                "Optimized layout and assets to ensure seamless performance across mobile, tablet, and desktop breakpoints."
            ]
        }
    ],

    internships: [
        {
            role: "AI & Cloud Intern",
            organization: "Edunet Foundation (AICTE)",
            period: "2024",
            tech: ["Data Science", "Altair", "Visualization"],
            highlights: [
                "Analyzed multiple real-world datasets and built 10+ interactive Altair visualizations to surface key trends for stakeholders.",
                "Streamlined data preprocessing and exploratory analysis workflows, improving overall data quality and cutting processing time by roughly 25%."
            ]
        },
        {
            role: "AI & ML Virtual Internship",
            organization: "AICTE",
            period: "2024",
            tech: ["Python", "pandas", "scikit-learn"],
            highlights: [
                "Built and evaluated 5+ machine learning models for classification and regression tasks, benchmarking performance with accuracy and F1-score metrics.",
                "Performed feature engineering and hyperparameter tuning, improving model accuracy by an estimated 10-15% over baseline."
            ]
        }
    ]
};

/**
 * Smart NLP Query Processor & Response Synthesizer
 */
class KnowledgeEngine {
    constructor(profile) {
        this.profile = profile;
    }

    /**
     * Process query and return output based on chosen model
     */
    generateResponse(query, model = "gpt-4o") {
        const cleanQuery = query.toLowerCase().trim();
        const intent = this.detectIntent(cleanQuery);
        const rawContent = this.buildContentForIntent(intent, cleanQuery);

        if (model === "deepseek-r1") {
            const reasoning = this.generateReasoning(intent, cleanQuery);
            return {
                reasoning: reasoning,
                content: rawContent
            };
        } else if (model === "executive") {
            return {
                reasoning: null,
                content: this.formatExecutiveSummary(rawContent, intent)
            };
        } else {
            // Default GPT-4o conversational
            return {
                reasoning: null,
                content: rawContent
            };
        }
    }

    detectIntent(q) {
        if (q.includes("project") || q.includes("placement pilot") || q.includes("prompt2program") || q.includes("ipl") || q.includes("app") || q.includes("build") || q.includes("work")) return "PROJECTS";
        if (q.includes("skill") || q.includes("tech") || q.includes("language") || q.includes("python") || q.includes("react") || q.includes("stack") || q.includes("tool")) return "SKILLS";
        if (q.includes("education") || q.includes("college") || q.includes("university") || q.includes("cgpa") || q.includes("degree") || q.includes("study") || q.includes("b.tech")) return "EDUCATION";
        if (q.includes("experience") || q.includes("internship") || q.includes("company") || q.includes("edunet") || q.includes("aicte")) return "INTERNSHIPS";
        if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("linkedin") || q.includes("github") || q.includes("reach") || q.includes("hire") || q.includes("social")) return "CONTACT";
        if (q.includes("certif") || q.includes("azure") || q.includes("microsoft") || q.includes("ai-900")) return "CERTIFICATIONS";
        if (q.includes("resume") || q.includes("cv") || q.includes("pdf") || q.includes("download")) return "RESUME";
        if (q.includes("who is") || q.includes("about") || q.includes("intro") || q.includes("poorna") || q.includes("nehal") || q.includes("summary")) return "ABOUT";
        if (q.includes("why hire") || q.includes("strength") || q.includes("recruiter") || q.includes("role") || q.includes("job") || q.includes("available")) return "WHY_HIRE";
        return "GENERAL";
    }

    generateReasoning(intent, q) {
        const thoughts = [
            `1. Analyzing user input: "${q}"`,
            `2. Identified intent target: ${intent}`,
            `3. Querying profile database for Pottapinjara Poorna Sai Nehal...`,
            `4. Matching relevant projects, live deployed links, tech stack metrics, and verification sources.`,
            `5. Formatting response using Markdown cards, code snippets, and action buttons for maximum UI readability.`
        ];
        return thoughts.join("\n");
    }

    buildContentForIntent(intent, q) {
        const p = this.profile;

        switch(intent) {
            case "PROJECTS":
                return `Here are **Poorna Sai Nehal's featured projects**, featuring the exact resume descriptions with separated live deployment links:

### 1. 🤖 AI Placement Mentor – AI-Powered Resume Analyzer & Interview Preparation Platform (2026)
* **Tech Stack:** Python | Flask | React.js | MySQL | OpenRouter API | NLP | Prompt Engineering
* **Resume Details:**
  • Engineered a full-stack AI platform that analyzes resumes and generates ATS compatibility scores, reducing manual resume review effort by an estimated 40%.
  • Designed an NLP-driven analysis engine that extracts 15+ resume attributes (skills, projects, technologies, experience) to auto-generate 50+ tailored, technology-specific interview questions per candidate.
  • Deployed a production-ready React.js, Flask, and MySQL application with secure resume upload and an interactive dashboard, supporting concurrent multi-user sessions.
* 🔗 **Separated Live Link:** [placement-pilot-five.vercel.app](https://placement-pilot-five.vercel.app)

---

### 2. ⚡ Prompt2Program – AI Code Generator (Mar 2024)
* **Tech Stack:** Python | Streamlit | OpenRouter API | Generative AI
* **Resume Details:**
  • Built an AI-powered web application that converts natural language prompts into functional code across multiple programming languages.
  • Integrated the OpenRouter API to deliver real-time code explanations and sample outputs, improving user comprehension of generated code.
  • Implemented secure, session-based API handling within a responsive Streamlit UI, ensuring reliable performance under concurrent use.
* 🔗 **Separated Live Link:** [aiac-project-streamlit.app](https://aiac-project-holxwbcahffhefb2ebuvxq.streamlit.app/)

---

### 3. 🏏 IPL Merchandise E-Commerce Website (Oct 2024)
* **Tech Stack:** HTML | CSS | JavaScript
* **Resume Details:**
  • Launched a responsive e-commerce website showcasing 30+ products across 10 IPL teams.
  • Engineered dynamic product filtering by team and category, cutting average product search time by roughly 30%.
  • Optimized layout and assets to ensure seamless performance across mobile, tablet, and desktop breakpoints.
* 🔗 **Separated Live Link:** [iplclone-ruby.vercel.app](https://iplclone-ruby.vercel.app)

---
💡 *Would you like to deep-dive into the architectural details of any specific project?*`;

            case "SKILLS":
                return `**Poorna Sai Nehal's Technical Skill Map:**

| Category | Technologies & Tools |
| :--- | :--- |
| **Languages** | Python, Java, SQL |
| **Web / Frameworks** | HTML5, CSS3, JavaScript, React.js, Flask, Streamlit, REST APIs |
| **ML / AI / Data** | pandas, scikit-learn, Altair, NLP, Large Language Models (LLMs), Prompt Engineering, Data Visualization |
| **Tools & Platforms** | Git, GitHub, VS Code, Vercel, MySQL, OpenRouter API |

**Core Strengths:**
* 🧠 **AI Integration:** Expertise in wrapping OpenRouter API & LLMs into user-friendly Web apps.
* ⚡ **Full-Stack Prototyping:** Rapid development using React, Flask, and Streamlit.
* 📊 **Data Engineering:** Preprocessing, exploratory data analysis, and data visualization.`;

            case "EDUCATION":
                return `### 🎓 Education & Academic Record

* **Degree:** B.Tech in Computer Science & Engineering — SR University
* **Institution:** SR University, Warangal, Telangana
* **CGPA:** **8.15 / 10**
* **Duration:** 2023 – 2027

**Key Academic Focus Areas:**
- Data Structures & Algorithms (DSA)
- Object-Oriented Programming (Python / Java)
- Database Management Systems (SQL / MySQL)
- Web Technologies & Software Engineering
- Artificial Intelligence & Machine Learning`;

            case "INTERNSHIPS":
                return `### 💼 Professional Internships

1. **AI & Cloud Intern** — *Edunet Foundation (AICTE)* [2024]
   * **Domain:** Data Science | Altair | Visualization
   * **Resume Highlights:**
     • Analyzed multiple real-world datasets and built 10+ interactive Altair visualizations to surface key trends for stakeholders.
     • Streamlined data preprocessing and exploratory analysis workflows, improving overall data quality and cutting processing time by roughly 25%.

2. **AI & ML Virtual Internship** — *AICTE* [2024]
   * **Domain:** Python | pandas | scikit-learn
   * **Resume Highlights:**
     • Built and evaluated 5+ machine learning models for classification and regression tasks, benchmarking performance with accuracy and F1-score metrics.
     • Performed feature engineering and hyperparameter tuning, improving model accuracy by an estimated 10-15% over baseline.`;

            case "CONTACT":
                return `### 📬 Connect with Poorna Sai Nehal

Feel free to get in touch for internship opportunities, project collaborations, or tech discussions!

* 📧 **Email:** [poornasai113@gmail.com](mailto:poornasai113@gmail.com)
* 📞 **Phone:** [+91-70325-42246](tel:+917032542246)
* 🐙 **GitHub:** [github.com/poornasainehal1781](https://github.com/poornasainehal1781)
* 💼 **LinkedIn:** [linkedin.com/in/poornsainehal](https://www.linkedin.com/in/poornsainehal/)
* 📍 **Location:** SR University, Warangal, Telangana, India`;

            case "CERTIFICATIONS":
                return `### 🏅 Professional Certifications

* ☁️ **Microsoft Azure AI-900: Azure AI Fundamentals**
  * **Issuer:** Microsoft
  * **Skills Covered:** Cloud AI Services, Machine Learning Concepts, Computer Vision, & Natural Language Processing on Microsoft Azure.`;

            case "RESUME":
                return `📄 **Poorna Sai Nehal's Resume is ready for download & view!**

You can inspect the original PDF directly in the built-in viewer or click **"Download PDF"** to save the complete official resume file (\`FINAL_RESUME.pdf\`).

**Quick Highlights:**
* **B.Tech CSE** @ SR University (CGPA 8.15)
* **3 Major Deployed Projects** (AI Placement Mentor, Prompt2Program, IPL Shop)
* **Microsoft Azure AI-900 Certified**
* **2 AICTE Internships** in AI, Cloud, and Machine Learning.`;

            case "WHY_HIRE":
                return `### 🎯 Why Recruiters & Teams Choose Poorna Sai Nehal

1. **Proven AI + Web Execution:** Poorna doesn't just study AI theory; he builds and deploys real LLM-powered applications like **Placement Pilot** and **Prompt2Program** with active live URLs.
2. **Strong CS Fundamentals:** Solid grasp of Data Structures, Algorithms, OOP (Python/Java), and Relational Databases (MySQL).
3. **Versatile Stack:** Seamlessly bridges ML/NLP backends (Flask, OpenRouter API) with modern responsive frontends (React, Streamlit, HTML/CSS).
4. **Cloud Certified & Disciplined:** Microsoft Azure AI-900 certified with formal internship experience under AICTE & Edunet.
5. **Immediate Value:** Ready to contribute to Full-Stack, Python/AI Development, and Data Engineering roles!`;

            case "ABOUT":
                return `Hello! 👋 I am **Nehal-GPT**, the AI assistant representing **Pottapinjara Poorna Sai Nehal**.

Poorna is a **Computer Science undergraduate** at **SR University** (CGPA: 8.15/10) with a passion for building AI-powered web products, intelligent full-stack platforms, and data-driven software solutions.

**Top 3 Highlights:**
- 🤖 Built **AI Placement Mentor** ('placement-pilot-five.vercel.app') using React, Flask & OpenRouter API.
- ⚡ Built **Prompt2Program** AI code generator.
- ☁️ Certified in **Microsoft Azure AI-900**.

*Ask me anything about Poorna's projects, tech stack, internships, or contact details!*`;

            default:
                return `I'm **Nehal-GPT**, Poorna's personal AI assistant!

I can help you explore Poorna's background:
- 🚀 **Projects:** Placement Pilot, Prompt2Program, IPL Merchandise
- 💻 **Tech Stack:** Python, Java, SQL, React.js, Flask, AI/ML, Azure
- 💼 **Experience:** AICTE & Edunet Internships
- 🎓 **Education:** B.Tech CSE @ SR University (8.15 CGPA)
- 📬 **Contact:** Email, LinkedIn, GitHub & Resume Download

What would you like to check out first?`;
        }
    }

    formatExecutiveSummary(text, intent) {
        return `⚡ **EXECUTIVE RECRUITER SUMMARY (${intent})**\n\n` + 
            text.replace(/### /g, "**").replace(/---/g, "");
    }
}

// Global Export
window.NEHAL_PROFILE = NEHAL_PROFILE;
window.KnowledgeEngine = KnowledgeEngine;
