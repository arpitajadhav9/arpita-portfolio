export const personal = {
  name: "Arpita",
  fullName: "Arpita Sanjay Jadhav",
  email: "arpitajadhav.1965@gmail.com",
  phone: "+91 9136738305",
  heroHeading: "Hi, I'm Arpita.",
  heroIdentity:
    "B.Tech CSE Student • Building Thoughtful Digital Experiences",
  heroSentences: [
    "I design user-first interfaces with Figma and code.",
    "I build full-stack apps with React.js and Node.js.",
    "I think beyond code — about users, products and problems.",
    "I enjoy solving real-world problems with data structures.",
    "I'm continuously learning and improving.",
  ],
  heroNote:
    "3rd-year B.Tech CSE • Mumbai, India • 2023 – 2027",
  tagline:
    "Designing, building and exploring better products",
  description:
    "3rd-year Computer Science Engineering undergraduate with strong foundations in data structures, algorithms, and full-stack development (MERN, Python/Flask). Built projects spanning graph-based pathfinding, AI-integrated web platforms (Gemini API), and MERN trading tools, and uses AI coding assistants (GitHub Copilot, ChatGPT) regularly to speed up development, debugging and testing.\n\nBrings hands-on UI/UX and product experience from internships at Engaze and LetsUpgrade, with a growing focus on backend systems and APIs. Eager to contribute to a fast-paced, technically rigorous engineering team.",
  personalNote:
    "Outside of work, you'll probably find me sketching wireframes on paper that never make it to Figma, reading about behavioural psychology, or trying a new cafe and rating their matcha. I believe great design comes from curiosity — and a good playlist helps.",
  roles: [
    "UI/UX Designer",
    "Full-Stack Developer",
    "Product Designer",
    "Software Engineer",
  ],
  location: "Mumbai, India",
};

export const social = {
  linkedin: "https://www.linkedin.com/in/arpitajadhav/",
  github: "https://github.com/arpitajadhav9",
};

export const education = [
  {
    degree: "B.Tech – Computer Science Engineering",
    school: "ITM Skills University",
    period: "2023 – 2027",
    note: "3rd Year",
  },
  {
    degree: "Higher Secondary (12th)",
    school: "Swami Vivekanand Junior College",
    period: "2021 – 2023",
  },
  {
    degree: "Schooling (1st – 10th)",
    school: "Vivekanand English High School",
    period: "2011 – 2021",
  },
];

export const skills = [
  {
    category: "Design",
    items: [
      "Figma",
      "Wireframing",
      "Prototyping",
      "High-fidelity Design",
      "User Research",
      "Interaction Design",
      "User Journey Mapping",
    ],
  },
  {
    category: "Frontend",
    items: [
      "React.js",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Flutter",
      "Dart",
      "No-code Tools",
    ],
  },
  {
    category: "Backend & Tools",
    items: [
      "Node.js",
      "Python / Flask",
      "REST APIs",
      "MongoDB",
      "MySQL",
      "Git",
      "GitHub",
    ],
  },
  {
    category: "Core",
    items: [
      "Data Structures & Algorithms",
      "C",
      "C++",
      "Java",
      "DBMS",
      "AI Assistants (Copilot, ChatGPT)",
    ],
  },
];

export const projects = [
  {
    title: "Smart Traffic Navigation",
    subtitle: "Python, Flask, Leaflet.js",
    description:
      "A graph-based route optimization engine using Dijkstra's algorithm to compute dynamic traffic-aware pathfinding.",
    detailedDescription:
      "This project implements a graph-based route optimization engine designed to compute the shortest and fastest paths across dense city junctions. By modeling road networks as weighted directed graphs using adjacency lists and a min-heap priority queue, it calculates real-time routes. It features a custom traffic-aware algorithm that dynamically recalculates paths based on simulated congestion, exposing the engine via lightweight REST APIs. The frontend features an interactive, real-time map visualization utilizing Leaflet.js.",
    contribution: "Built the entire project independently — backend algorithm, API layer, and frontend map visualization.",
    overallContribution: "100%",
    features: [
      "Implemented Dijkstra's algorithm with min-heap priority queue for shortest path computation",
      "Built event-driven adjacency updater for dynamic edge weight changes without recalculation lag",
      "Created REST API layer to expose the routing engine",
      "Designed interactive Leaflet.js map with real-time route rendering",
      "Optimized SVG path updates using requestAnimationFrame for smooth map performance",
    ],
    challenges:
      "Modeling dynamic weight changes in graph edges without causing recalculation lag was key. I solved this by implementing an event-driven adjacency updater. Also, keeping map renders performant during massive coordinate updates required using requestAnimationFrame and SVG path optimization in Leaflet.",
    tags: [
      "Python",
      "Flask",
      "Dijkstra's Algorithm",
      "Leaflet.js",
      "REST APIs",
      "Graph Theory",
    ],
    image: "",
    hasMockup: false,
    researchMaterial: "https://arxiv.org/abs/cs/0306123",
    links: { github: "https://github.com/arpitajadhav9/traffic-navigation", live: "https://traffic-nav.demo" },
  },
  {
    title: "YouTube Clone",
    subtitle: "React.js + Gemini API",
    description:
      "Video streaming platform integrated with an AI tutor, Study Mode, timestamps, and interactive note-taking.",
    detailedDescription:
      "A feature-rich video platform built to enhance virtual learning. It integrates Google's Gemini API to power a contextual AI chatbot that can answer video-specific questions. The platform features a specialized 'Study Mode' containing a synchronized HTML5 video player, time-stamped sticky notes, drag-and-drop notes organizing, user profile tracking, and file upload modules.",
    contribution: "Designed and developed the Study Mode feature, AI chatbot integration, and frontend architecture.",
    overallContribution: "100%",
    features: [
      "Integrated Google Gemini API with timestamp-aware context windows for accurate AI responses",
      "Built synchronized HTML5 video player with time-stamped sticky notes",
      "Implemented drag-and-drop note organization with React state management",
      "Created decoupled component architecture to prevent unnecessary re-renders",
      "Designed responsive UI with user profile tracking and file upload modules",
    ],
    challenges:
      "Synthesizing Gemini API prompts with specific timestamp metadata was challenging due to context window limits. I optimized it by sending a slide-window transcript snippet corresponding to the current video playback head. Managing state for the notes editor without causing parent video player re-renders was resolved using decoupled refs and React.memo.",
    tags: [
      "React.js",
      "Gemini API",
      "AI Chatbot",
      "State Management",
      "Responsive UI",
      "Component Architecture",
    ],
    image: "",
    hasMockup: true,
    mockupType: "study-helper",
    links: { github: "https://github.com/arpitajadhav9/youtube-ai-clone", live: "https://yt-tutor.demo" },
  },
  {
    title: "Basic Trading Dashboard",
    subtitle: "Node.js + MERN",
    description:
      "MERN trading simulator featuring candlestick chart visualization, transaction logs, and balance tracking.",
    detailedDescription:
      "A full-stack mock trading system providing real-time candlestick charts and transaction logs. Built on the MERN stack, the application allows users to simulate stock or currency trades, update portfolio balances, and view performance charts. The backend implements atomic transaction logs to prevent balance issues.",
    contribution: "Designed and built the full stack — backend APIs, database schema, and chart-based trading UI.",
    overallContribution: "100%",
    features: [
      "Designed MongoDB schema for atomic transaction logs and portfolio state",
      "Built pre-aggregation worker script for 1-min, 5-min, and hourly OHLC candle compilation",
      "Implemented Canvas-based candlestick chart rendering for fluid panning and zooming",
      "Created RESTful API endpoints for trade execution and balance tracking",
      "Built real-time transaction log feed with filtering and sorting",
    ],
    challenges:
      "Aggregating tick-level transaction records into standard time-interval candlestick data in MongoDB was resource-heavy. I resolved this by designing a pre-aggregation worker script that compiles 1-minute, 5-minute, and hourly OHLC candles asynchronously. The UI uses Canvas-based chart rendering to ensure fluid panning and zooming.",
    tags: [
      "Node.js",
      "React",
      "MongoDB",
      "Candlestick Charts",
      "Backend Logic",
      "MERN Stack",
    ],
    image: "",
    hasMockup: false,
    links: { github: "https://github.com/arpitajadhav9/mern-trading", live: "https://trade-dash.demo" },
  },
  {
    title: "Revive Threads",
    subtitle: "Product Management",
    description:
      "MVP product definition, user journey mapping, and Go-To-Market strategy for sustainable commerce.",
    detailedDescription:
      "A product management case study defining MVP specifications, user journeys, GTM strategy, and competitive landscape assessments for a sustainable fashion resale marketplace. Features a comprehensive 30+ requirement functional backlog, high-fidelity wireframe blueprints, and conversion-funnel modeling.",
    contribution: "Owned the entire product definition — research, MVP spec, user journeys, GTM strategy, and wireframes.",
    overallContribution: "100%",
    features: [
      "Defined 30+ functional requirements for the MVP product backlog",
      "Mapped complete user journeys from onboarding to resale transaction flow",
      "Built competitive landscape assessment across 6 sustainable fashion platforms",
      "Designed high-fidelity wireframe blueprints for core marketplace features",
      "Modeled conversion funnels and GTM strategy with carbon-offset verification loop",
    ],
    challenges:
      "The primary challenge was designing a verification loop that builds trust in sustainable claims without introducing high friction to sellers. I modeled a multi-tier certification system based on user research insights, proving that transparent carbon-offset rewards significantly increase transaction volume.",
    tags: [
      "MVP Definition",
      "User Journeys",
      "GTM Strategy",
      "Market Analysis",
      "Functional Requirements",
    ],
    image: "",
    hasMockup: true,
    mockupType: "product-roadmap",
    links: { case: "https://medium.com/product-management/revive-threads-gtm" },
  },
];

export const experience = [
  {
    role: "UI/UX Designer Intern",
    company: "Engaze",
    location: "Mumbai, India",
    period: "Jul 2025 – Dec 2025",
    description:
      "Designed wireframes, prototypes, and high-fidelity UI screens in Figma for multiple product features, optimising user flows and visual hierarchy. Collaborated closely with developers for pixel-accurate implementation; ran usability reviews and iterated designs based on feedback to improve engagement.",
    skillsGained: [
      "Figma",
      "Wireframing",
      "Prototyping",
      "High-fidelity Design",
      "User Flows",
      "Interaction Design",
      "Developer Collaboration",
      "Usability Reviews",
    ],
    lessonsLearned:
      "Working on production features taught me that great design is a balance between user needs and technical feasibility. Collaborating closely with developers showed me how small decisions in Figma ripple into real implementation challenges.",
  },
  {
    role: "Student Intern – UI/UX",
    company: "LetsUpgrade",
    location: "Mumbai, India",
    period: "Jul 2024 – Aug 2024",
    description:
      "Created and refined UI designs for a website redesign project, improving layout, navigation flow, and visual hierarchy. Collaborated with the team to align design solutions with branding guidelines and usability goals using Figma.",
    skillsGained: [
      "UI Design",
      "Website Redesign",
      "Visual Hierarchy",
      "Branding",
      "Figma",
      "Team Collaboration",
    ],
    lessonsLearned:
      "This internship taught me the importance of consistency in design systems. Aligning every screen with brand guidelines while keeping usability high was a challenging but valuable learning experience.",
  },
  {
    role: "Student Intern – Marketing & Analysis",
    company: "LetsUpgrade",
    location: "Mumbai, India",
    period: "Dec 2023 – Jan 2024",
    description:
      "Contributed to marketing strategy discussions and campaign ideation for an EduTech platform. Analysed the existing platform UX and provided actionable insights to enhance user engagement and usability.",
    skillsGained: [
      "Marketing Strategy",
      "Campaign Ideation",
      "UX Analysis",
      "User Engagement",
      "Actionable Insights",
    ],
    lessonsLearned:
      "This role bridges my interest in product thinking and data analysis. Learning to look at a platform through both a marketing and UX lens gave me a more holistic understanding of how products grow.",
  },
];

export const contact = {
  subtitle:
    "Have a project in mind or just want to say hi?",
};
