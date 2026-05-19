// ============================================================
//  KARAN JOGI — Portfolio Chatbot Knowledge Base
//  Sources: JSX components + GitHub READMEs (live-fetched)
// ============================================================

const knowledgeBase = {

  // ── PERSONAL ────────────────────────────────────────────────
  personal: {
    name: "Karan Jogi",
    github_username: "KARAN-1309",
    roles: ["AI/ML Engineer", "IoT Developer", "Software Developer"],
    tagline: "Building at the intersection of AI, IoT, and embedded systems.",
    location: "West Bengal, India",
    email: "karanjogi2021@gmail.com",
    github: "https://github.com/KARAN-1309",
  },

  // ── EDUCATION ───────────────────────────────────────────────
  education: [
    {
      period: "2008 – 2021",
      level: "Secondary Education",
      institution: "Sacred Heart School, Adra",
      detail:
        "Built a strong academic foundation across sciences, mathematics, and languages. Developed early curiosity for technology and electronics.",
    },
    {
      period: "2021 – 2023",
      level: "Higher Secondary Education",
      institution: "Delhi Public School, Durgapur",
      subjects: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
      detail:
        "Specialized in PCM + CS. Completed board exams with distinction and developed core programming fundamentals.",
    },
    {
      period: "2023 – Present",
      level: "B.Tech — Computer Science & Engineering (AI & ML)",
      institution: "Brainware University, Barasat",
      detail:
        "Pursuing a degree at the intersection of AI, IoT, and software engineering. Active in research, internships, and hands-on embedded systems projects.",
    },
  ],

  // ── SKILLS & TOOLS ──────────────────────────────────────────
  skills: {
    languages:      ["Python", "SQL", "JavaScript", "HTML", "CSS"],
    tools:          ["VS Code", "Arduino IDE", "Roboflow", "Blender", "Power BI"],
    hardware:       ["Arduino UNO", "Arduino Nano", "ESP32"],
    versionControl: ["Git", "GitHub"],
    domains: [
      "Artificial Intelligence",
      "Machine Learning",
      "Computer Vision",
      "IoT (Internet of Things)",
      "Embedded Systems",
      "Data Science & Analytics",
      "Prompt Engineering",
      "Generative AI",
    ],
  },

  // ── PROJECTS ────────────────────────────────────────────────
  projects: [
    {
      id: "dhanush",
      name: "DHANUSH 1.0",
      tagline: "AI-Powered ISR Analysis Platform — Precision Gains Victory",
      category: "AI · ISR · Computer Vision",
      status: "Production Ready",
      github: "https://github.com/KARAN-1309/DHANUSH_1.0",
      license: "MIT",
      language: "Python (100%)",

      description:
        "A standalone, mission-ready desktop platform engineered for advanced Intelligence, Surveillance, and Reconnaissance (ISR) operations. Provides actionable, real-time intelligence through automated detection, classification, and persistent tracking of military aircraft using cutting-edge AI.",

      tech: ["Python", "YOLOv8s (Ultralytics)", "OpenCV", "Computer Vision", "Custom ML Model"],

      features: [
        "Static Image Analysis — satellite/drone imagery processing for strategic intelligence",
        "Live Feed Processing — real-time video analysis with persistent target tracking",
        "10-Frame Confidence Lock-On — advanced algorithm for stable target identification",
        "Dynamic Intelligence Dossiers — real-time aircraft specification cards",
        "Precision Bounding Boxes — accurate target localization with visual overlays",
        "Performance Analytics — comprehensive metrics and validation reporting",
        "Command Center UI — immersive, operator-friendly interface",
      ],

      model: {
        architecture: "YOLOv8s",
        dataset: "Custom aggregated military aircraft dataset (Kaggle + custom data)",
        epochs: 25,
        image_size: "640×640",
        batch_size: 16,
        augmentation: "Multi-angle, lighting variations",
      },

      performance: {
        mAP50_95: "66.0%",
        mAP50: "73.6%",
        precision: "75.3%",
        recall: "64.0%",
      },

      aircraft_database: {
        total_classes: 43,
        categories: {
          "Attack & Fighter": ["A-10", "AV-8B", "EF-2000", "F-4", "F-14", "F-15", "F-16", "F-18", "F-22", "F-35", "F-117", "J-20", "JAS-39", "MiG-31", "Mirage 2000", "Rafale", "Su-34", "Su-57", "Tornado", "YF-23"],
          "Bombers & Strategic": ["B-1", "B-2", "B-52", "SR-71", "Tu-95", "Tu-160", "Vulcan", "XB-70"],
          "Transport & Cargo": ["A400M", "C-2", "C-5", "C-17", "C-130", "US-2"],
          "Surveillance & Recon": ["E-2", "E-7", "P-3", "RQ-4", "U-2"],
          "UAVs & Special": ["MQ-9", "AG-600", "Be-200", "V-22"],
        },
      },

      files: ["app.py", "convert_and_prepare.py", "evaluate_model.py", "run_image_pipeline.py", "yolov8s.pt"],
    },

    {
      id: "whichkatha",
      name: "WHICH_KATHA",
      tagline: "Stop Scrolling. Start Watching.",
      category: "AI · Recommendation Engine · Web App",
      status: "Live & Deployed",
      github: "https://github.com/KARAN-1309/Which_Katha",
      live_demo: "https://which-katha.vercel.app",
      license: "MIT",
      languages: { JavaScript: "29.3%", HTML: "28.5%", Python: "26.9%", CSS: "15.3%" },

      description:
        "An intelligent movie and TV show recommendation engine designed to solve the decision paralysis of modern streaming platforms. Uses a Smart Context Engine powered by the TMDB API to understand natural language queries like 'Similar to Breaking Bad' or 'Bollywood Spy Thriller from the 90s'.",

      tech: ["Python", "Flask", "TMDB API", "HTML5", "CSS3", "Vanilla JavaScript", "Vercel (Serverless)"],

      features: [
        "Smart AI Search — natural language queries like 'Anime similar to Attack on Titan'",
        "Smart Fallback Logic — intelligently relaxes filters step-by-step for guaranteed results",
        "Multi-Region Support — Bollywood, Hollywood, K-Drama, and Anime",
        "Mood Filters — Happy, Melancholic, Adventurous, Romantic, Thrilling",
        "Decade Slider — filter content from 1980 to 2026",
        "Age Appropriateness — Kids vs. Adults smart filtering",
        "Real-Time Data — top 10 trending movies & shows, live ratings and metadata",
        "Privacy-First Watchlist & History — all data stored locally, no login required",
        "Glassmorphism dark-theme UI",
      ],

      supported_formats: ["Movies", "TV Shows / Web Series", "Anime"],

      query_examples: [
        "Movies similar to Inception",
        "Bollywood romantic comedy from 2000s",
        "K-drama about family",
        "Shah Rukh Khan movies",
        "Thrilling movies from 1990s",
        "Anime with adventure theme",
      ],

      deployment: {
        platform: "Vercel (Serverless)",
        url: "https://which-katha.vercel.app",
      },

      project_structure: {
        "app.py": "Main Flask Backend (Smart Logic & API Routes)",
        "requirements.txt": "Python Dependencies",
        "vercel.json": "Vercel Configuration",
        "static/style.css": "Glassmorphism Dark Theme Styling",
        "static/script.js": "Frontend Logic (API Calls, UI, LocalStorage)",
        "templates/index.html": "Main User Interface",
      },
    },

    {
      id: "rover",
      name: "NRF24L01 RC ROVER",
      category: "Embedded · Arduino · Wireless",
      status: "Hardware Implementation",
      github: null,
      description:
        "High-performance wireless RC car using Arduino Nano as transmitter and Arduino UNO as receiver, communicating via NRF24L01 transceiver module. Controls dual BLDC motors and an MG996R servo motor with joystick-based remote control.",
      tech: ["Arduino Nano", "Arduino UNO", "NRF24L01 Transceiver", "BLDC Motors", "MG996R Servo", "C++ (Arduino)"],
      features: [
        "Wireless communication via NRF24L01 2.4GHz transceiver",
        "Joystick-based remote control transmitter (Arduino Nano)",
        "Dual BLDC motor drive for locomotion",
        "MG996R servo motor for steering",
        "Receiver unit built on Arduino UNO",
      ],
    },

    {
      id: "iot-container",
      name: "IoT SMART CONTAINER",
      category: "IoT · ESP32 · Sensors",
      status: "Hardware Implementation",
      github: null,
      description:
        "An ESP32-powered intelligent monitoring system using ultrasonic sensors to measure fill levels and load sensors to detect weight in real-time. Wirelessly transmits data to cloud platforms for automated monitoring and alerts.",
      tech: ["ESP32", "Ultrasonic Sensors", "Load Sensors", "IoT", "Cloud Connectivity", "C++ (Arduino)"],
      features: [
        "Real-time fill level measurement via ultrasonic sensors",
        "Weight detection via load sensors",
        "Wireless cloud data transmission via ESP32 Wi-Fi",
        "Automated monitoring and threshold alerts",
      ],
    },
  ],

  // ── CERTIFICATIONS & ACHIEVEMENTS ───────────────────────────
  certifications: [
    {
      id: "c1",
      title: "Prompt Engineering",
      issuer: "NVIDIA",
      year: "2024",
      description: "Certified in building LLM applications using prompt engineering techniques.",
    },
    {
      id: "c2",
      title: "Data Science & Analytics",
      issuer: "HP LIFE",
      year: "2024",
      description: "Completed foundational training in data science and analytics methodologies.",
    },
    {
      id: "c3",
      title: "Generative AI Mastermind",
      issuer: "Outskill",
      year: "2024",
      description: "Completed advanced Generative AI training program and applied projects.",
    },
    {
      id: "c4",
      title: "AI for Beginners",
      issuer: "HP LIFE",
      year: "2024",
      description: "Gained foundational knowledge of artificial intelligence concepts and applications.",
    },
    {
      id: "c5",
      title: "Space Science & Drone Technologies Internship",
      issuer: "India Space Lab",
      year: "2024",
      description: "Completed internship training in space science and drone technologies.",
    },
    {
      id: "c6",
      title: "Artificial Intelligence Internship",
      issuer: "Codec Technologies",
      year: "2024",
      description: "Successfully completed an Artificial Intelligence internship program.",
    },
    {
      id: "c7",
      title: "Research Co-Author Recognition",
      issuer: "AIIoT 2025 Conference",
      year: "2025",
      description: "Recognized as co-author of a peer-reviewed AI and IoT research paper at the AIIoT 2025 conference.",
    },
    {
      id: "c8",
      title: "Oracle AI Foundations Associate",
      issuer: "Oracle",
      year: "2025",
      description: "Certified in Oracle Cloud Infrastructure AI foundations and services.",
    },
  ],

  // ── INTERNSHIP EXPERIENCE ────────────────────────────────────
  experience: [
    {
      role: "AI Intern",
      organization: "Codec Technologies",
      year: "2024",
      description: "Worked on applied Artificial Intelligence projects as part of an internship program.",
    },
    {
      role: "Space Science & Drone Tech Intern",
      organization: "India Space Lab",
      year: "2024",
      description: "Trained and worked on space science principles and drone technology applications.",
    },
  ],

  // ── RESEARCH ─────────────────────────────────────────────────
  research: [
    {
      title: "AI and IoT Research Paper",
      venue: "AIIoT 2025 Conference",
      year: "2025",
      role: "Co-Author",
      description: "Co-authored a research paper on the intersection of Artificial Intelligence and Internet of Things, recognized at the AIIoT 2025 international conference.",
    },
  ],

  // ── CONTACT ──────────────────────────────────────────────────
  contact: {
    email: "karanjogi2021@gmail.com",
    github: "https://github.com/KARAN-1309",
  },

  // ── CHATBOT HELPER: QUICK Q&A PAIRS ──────────────────────────
  // Common questions a visitor might ask — mapped to direct answers
  faq: [
    {
      q: ["who are you", "about you", "introduce yourself", "tell me about karan"],
      a: "Karan Jogi is an AI/ML Engineer, IoT Developer, and Software Developer based in West Bengal, India. He is currently pursuing a B.Tech in Computer Science & Engineering (AI & ML) at Brainware University and works at the intersection of artificial intelligence, embedded systems, and software development.",
    },
    {
      q: ["projects", "what have you built", "portfolio"],
      a: "Karan has built four key projects: DHANUSH 1.0 (an AI-powered ISR platform for military aircraft detection using YOLOv8), WHICH_KATHA (a live AI movie recommendation web app at which-katha.vercel.app), an NRF24L01 RC Rover (wireless hardware build), and an IoT Smart Container (ESP32-based fill-level and weight monitoring system).",
    },
    {
      q: ["dhanush", "isr", "aircraft", "military", "yolo"],
      a: "DHANUSH 1.0 is Karan's flagship AI project — a desktop ISR platform that can detect and classify 43 military aircraft models in real-time from images or live video. It uses a custom-trained YOLOv8s model achieving 75.3% precision and 73.6% mAP50. Source code: https://github.com/KARAN-1309/DHANUSH_1.0",
    },
    {
      q: ["which katha", "movie recommendation", "recommendation engine", "streaming"],
      a: "WHICH_KATHA is a live Flask web app that recommends movies and TV shows using the TMDB API and natural language queries. It supports Bollywood, Hollywood, K-Drama, and Anime with mood filters, a decade slider, and a privacy-first watchlist. Try it live: https://which-katha.vercel.app",
    },
    {
      q: ["skills", "technologies", "tools", "what can you do"],
      a: "Karan's core skills include Python, SQL, JavaScript, HTML/CSS, Power BI, Arduino IDE, Roboflow, Blender, Git, and GitHub. His domain expertise spans AI/ML, Computer Vision, IoT, Embedded Systems, Data Science, Prompt Engineering, and Generative AI.",
    },
    {
      q: ["education", "university", "college", "degree", "study"],
      a: "Karan is currently pursuing a B.Tech in CSE (AI & ML) at Brainware University, Barasat (2023–Present). He completed his Higher Secondary (PCM + CS) from Delhi Public School, Durgapur, and his Secondary schooling from Sacred Heart School, Adra.",
    },
    {
      q: ["certifications", "certificates", "achievements", "credentials"],
      a: "Karan holds 8 certifications including NVIDIA Prompt Engineering, HP LIFE Data Science & Analytics, Outskill Generative AI Mastermind, HP LIFE AI for Beginners, Oracle AI Foundations Associate, and recognition as a co-author at the AIIoT 2025 Conference. He also completed internships at Codec Technologies (AI) and India Space Lab (Drones & Space Science).",
    },
    {
      q: ["contact", "email", "reach", "hire", "connect"],
      a: "You can reach Karan at karanjogi2021@gmail.com or explore his work on GitHub at https://github.com/KARAN-1309",
    },
    {
      q: ["internship", "experience", "work"],
      a: "Karan has completed two internships: an AI internship at Codec Technologies (2024) and a Space Science & Drone Technologies internship at India Space Lab (2024). He is also a co-author of a research paper presented at the AIIoT 2025 Conference.",
    },
    {
      q: ["research", "paper", "publication", "aiiot"],
      a: "Karan co-authored a research paper on AI and IoT, which was recognized and presented at the AIIoT 2025 international conference.",
    },
  ],
};

export default knowledgeBase;