import "dotenv/config";

import type {
  ParsedResume,
} from "@resume-analyzer/shared";

import { ResumeAnalyzer } from "./analyzer.js";
import { OpenRouterProvider } from "./providers/openrouter-provider.js";

const model =
  process.env.OPENROUTER_MODEL;

if (!model) {
  throw new Error(
    "OPENROUTER_MODEL is not defined in .env",
  );
}

const provider =
  new OpenRouterProvider(model);

const analyzer =
  new ResumeAnalyzer(provider);

const resume: ParsedResume = {
  personalInfo: {
    fullName: "Rahul Yadav",
    email: "ry9064526713@gmail.com",
    phone: "9064526713",
    location: null,
    linkedin: null,
    github: null,
    portfolio: null,
  },

  education: [
    {
      institution:
        "Galgotias College of Engineering & Technology",
      degree:
        "Bachelor of Technology",
      fieldOfStudy:
        "Computer Science and Engineering (AI & ML)",
      startDate: "2023",
      endDate: "2027",
      grade: "7.25/10.0",
    },
  ],

  experience: [],

  projects: [
    {
      name:
        "Affnet-v2 - Property Rental & Listing Platform",

      description:
        "Developed the backend architecture and designed RESTful APIs to enable secure communication between the frontend and server. Implemented database integration, authentication, validation, and robust error handling to improve application security, reliability, and data management. Utilized Git and GitHub for version control and collaborative development.",

      technologies: [
        "TypeScript",
        "Node.js",
        "Express.js",
        "REST APIs",
        "Git",
        "GitHub",
      ],

      url: null,

      startDate: "2026-05",
      endDate: "2026-06",
    },

    {
      name:
        "SocketTalk - Real-Time Chat Application",

      description:
        "Built a real-time chat application using React, Node.js, TypeScript and WebSockets to enable instant room-based messaging. Implemented WebSocket-based JSON communication and organized the project as a TurboRepo monorepo for efficient code sharing and maintainability. Deployed the frontend on Vercel and the backend on Render.",

      technologies: [
        "React",
        "Node.js",
        "TypeScript",
        "WebSockets",
        "Git",
        "GitHub",
        "Vercel",
        "Render",
      ],

      url: null,

      startDate: "2026-06",
      endDate: "2026-07",
    },
  ],

  skills: [
    {
      name: "Java",
      category: "Languages",
    },
    {
      name: "JavaScript",
      category: "Languages",
    },
    {
      name: "TypeScript",
      category: "Languages",
    },
    {
      name: "SQL",
      category: "Languages",
    },
    {
      name: "HTML",
      category: "Frontend",
    },
    {
      name: "CSS",
      category: "Frontend",
    },
    {
      name: "React.js",
      category: "Frontend",
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
    },
    {
      name: "Node.js",
      category: "Backend",
    },
    {
      name: "Express.js",
      category: "Backend",
    },
    {
      name: "REST APIs",
      category: "Backend",
    },
    {
      name: "WebSockets",
      category: "Backend",
    },
    {
      name: "JWT",
      category: "Backend",
    },
    {
      name: "bcrypt",
      category: "Backend",
    },
    {
      name: "Zod",
      category: "Backend",
    },
    {
      name: "Git",
      category: "Tools",
    },
    {
      name: "GitHub",
      category: "Tools",
    },
    {
      name: "Vercel",
      category: "Tools",
    },
    {
      name: "Postman",
      category: "Tools",
    },
    {
      name: "MongoDB",
      category: "Databases",
    },
    {
      name: "MySQL",
      category: "Databases",
    },
    {
      name: "Team Collaboration",
      category: "Soft Skills",
    },
    {
      name: "Problem-Solving",
      category: "Soft Skills",
    },
    {
      name: "Time Management",
      category: "Soft Skills",
    },
    {
      name: "Adaptability",
      category: "Soft Skills",
    },
  ],

  certifications: [],
};

const jobDescription = `
We are looking for a Full Stack Developer.

Requirements:

- Strong knowledge of React.js
- Strong knowledge of Node.js
- Experience with TypeScript
- Experience building REST APIs
- Knowledge of PostgreSQL
- Knowledge of Docker
- Knowledge of AWS
- Understanding of Git and GitHub
- Good problem-solving skills
- Experience with testing is a plus
`;

async function main() {
  console.log(
    `Using model: ${model}`,
  );

  console.log(
    "Analyzing resume...\n",
  );

  const result =
    await analyzer.analyze({
      resume,
      jobDescription,
    });

  console.log(
    JSON.stringify(
      result,
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(
    "Analysis failed:",
    error,
  );

  process.exit(1);
});