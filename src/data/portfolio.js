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
      "Built a graph-based route optimisation engine using Dijkstra's algorithm over weighted directed graphs (adjacency list + min-heap priority queue) to compute the shortest and fastest routes between city junctions. Designed a traffic-aware pathfinding module with dynamic recalculation, exposed through REST APIs. Built an interactive map interface (Leaflet.js, HTML5/CSS3/JS) for real-time route visualisation and comparison across multiple cities.",
    tags: [
      "Python",
      "Flask",
      "Dijkstra's Algorithm",
      "Leaflet.js",
      "REST APIs",
      "Graph Theory",
    ],
    image: "",
    links: { github: "#", live: "#" },
  },
  {
    title: "YouTube Clone",
    subtitle: "React.js + Gemini API",
    description:
      "Built a full-featured video platform with an AI chatbot (Gemini API integration), Study Mode, Sticky Notes, upload functionality, and user profiles. Focused on responsive UI/UX design, component architecture, API handling, and state management across the app.",
    tags: [
      "React.js",
      "Gemini API",
      "AI Chatbot",
      "State Management",
      "Responsive UI",
      "Component Architecture",
    ],
    image: "",
    links: { github: "#", live: "#" },
  },
  {
    title: "Basic Trading Dashboard",
    subtitle: "Node.js + MERN",
    description:
      "Built a buy/sell dashboard with candlestick chart visualisation, backend transaction handling, and database integration, applying MERN concepts and backend logic in a real project context.",
    tags: [
      "Node.js",
      "React",
      "MongoDB",
      "Candlestick Charts",
      "Backend Logic",
      "MERN Stack",
    ],
    image: "",
    links: { github: "#", live: "#" },
  },
  {
    title: "Revive Threads",
    subtitle: "Product Management",
    description:
      "Designed a sustainable fashion platform: defined MVP, 30+ functional requirements, end-to-end user journeys, and a comprehensive Go-To-Market strategy aligned to user pain points and business goals.",
    tags: [
      "MVP Definition",
      "User Journeys",
      "GTM Strategy",
      "Market Analysis",
      "Functional Requirements",
    ],
    image: "",
    links: { case: "#" },
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
