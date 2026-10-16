/* =====================================================================
   SKILLS DATA: edit this file to add or change skills.

   Structure:
     "Category name": {
       "Skill name": [
         ["type", "Place", "How you used it", "optional link"],
       ],
     },

   type is one of: "work", "project", "education", "activity"

   Examples:
     Add a place to an existing skill: add one line inside its [ ].
       ["project", "My New App", "Built the backend", "https://github.com/khs14/my-app"],

     Add a new skill: add a new "Skill name": [ ... ], block in a category.
     Add a new category: add a new "Category": { ... }, block.

   Counts, chip order (most-used first), and the panel update automatically.
   Keep a comma after every line except the last one in each list.
===================================================================== */

const SKILL_GROUPS = {
  "Languages": {
    "Python": [
      ["work", "ISRO", "NLP and extractive QA pipelines"],
      ["work", "Rancho Labs", "ML curriculum in Python and Jupyter Notebooks"],
      ["work", "CWE", "Database cleaning automation tool"],
      ["project", "Offensive Check", "CNN text classifier", "https://offensive-check.streamlit.app/"],
      ["project", "Scholar Stack", "PDF plagiarism and AI-content checks, certificate generation", "https://scholarstack.in"],
      ["education", "The NorthCap University", "The Joy of Computing using Python; Programming for Data Science & AI"],
      ["education", "The NorthCap University", "Peer tutor for Python"],
      ["education", "Sardar Patel Vidyalaya", "Python and MySQL fundamentals"]
    ],
    "JavaScript": [
      ["work", "ISRO", "Custom API and dashboard for the disaster portal"],
      ["work", "Leoforce", "Interactive dashboards and playgrounds"],
      ["project", "kaustubhsethi.com", "This portfolio", "https://kaustubhsethi.com"],
      ["project", "kaustubhsethi.me", "Secondary portfolio", "https://kaustubhsethi.me"],
      ["project", "vandanasethi.art", "Artist portfolio website", "https://vandanasethi.art"],
      ["project", "kotronixtechnologies.com", "Company website", "https://kotronixtechnologies.com"]
    ],
    "C": [
      ["education", "The NorthCap University", "Fundamentals of Computer Programming I; Intro to Industry 4.0 & IoT"]
    ],
    "Java": [
      ["education", "The NorthCap University", "Fundamentals of Computer Programming II"]
    ],
    "Kotlin": [
      ["project", "Event Hub", "Jetpack Compose event app", "https://github.com/khs14/event_hub"]
    ]
  },
  "AI / ML": {
    "Deep Learning": [
      ["work", "Rancho Labs", "Taught CNNs in the ML curriculum"],
      ["project", "Offensive Check", "CNN model at 86% accuracy", "https://offensive-check.streamlit.app/"],
      ["education", "The NorthCap University", "Deep Learning"]
    ],
    "NLP": [
      ["work", "ISRO", "5× relevance over keyword methods with extractive QA"],
      ["project", "Offensive Check", "Offensive text classification", "https://offensive-check.streamlit.app/"],
      ["education", "The NorthCap University", "Computational Linguistics & NLP"]
    ],
    "Machine Learning": [
      ["work", "Rancho Labs", "Taught linear and logistic regression"],
      ["work", "Leoforce", "Tested and refined AI candidate-ranking models"],
      ["education", "The NorthCap University", "Intro to AI & ML; Applied AI & Expert Systems; AI for Robotics"]
    ],
    "Computer Vision": [
      ["work", "ISRO", "Rooftop and sand dune extraction from satellite imagery"],
      ["education", "The NorthCap University", "Computer Vision"]
    ],
    "Keras": [
      ["work", "Rancho Labs", "CNN lessons"],
      ["project", "Offensive Check", "CNN model", "https://offensive-check.streamlit.app/"]
    ],
    "Scikit-learn": [
      ["work", "Rancho Labs", "Regression lessons"],
      ["project", "Offensive Check", "Model building and evaluation", "https://offensive-check.streamlit.app/"]
    ],
    "LLMs": [
      ["work", "ISRO", "Feature extraction from satellite and aerial imagery"]
    ],
    "Extractive QA": [
      ["work", "ISRO", "Relevant answers from disaster news"]
    ],
    "Reinforcement Learning": [
      ["education", "The NorthCap University", "Reinforcement Learning"]
    ],
    "Human-Centered AI": [
      ["education", "University of Michigan", "Human-AI Interaction and Systems"]
    ]
  },
  "Data": {
    "SQL & Databases": [
      ["work", "ISRO", "PostgreSQL database for the disaster portal"],
      ["education", "University of Michigan", "Advanced Database Systems"],
      ["education", "The NorthCap University", "Database Management System"],
      ["education", "Sardar Patel Vidyalaya", "MySQL fundamentals"]
    ],
    "Pandas / NumPy": [
      ["work", "Rancho Labs", "Hands-on projects on Kaggle datasets"],
      ["project", "Offensive Check", "Dataset preparation", "https://offensive-check.streamlit.app/"],
      ["education", "The NorthCap University", "Programming for Data Science & AI"]
    ],
    "Statistics": [
      ["education", "The NorthCap University", "Applied Computational Statistics"]
    ]
  },
  "Web & Software": {
    "React.js": [
      ["work", "ISRO", "Dashboard for real-time and historical disaster analysis"],
      ["project", "Scholar Stack", "Frontend", "https://scholarstack.in"],
      ["project", "kaustubhsethi.me", "Secondary portfolio", "https://kaustubhsethi.me"],
      ["project", "vandanasethi.art", "Artist portfolio website", "https://vandanasethi.art"],
      ["project", "kotronixtechnologies.com", "Company website", "https://kotronixtechnologies.com"]
    ],
    "CSS": [
      ["project", "kaustubhsethi.com", "This portfolio", "https://kaustubhsethi.com"],
      ["project", "kaustubhsethi.me", "Secondary portfolio", "https://kaustubhsethi.me"],
      ["project", "vandanasethi.art", "Artist portfolio website", "https://vandanasethi.art"],
      ["project", "kotronixtechnologies.com", "Company website", "https://kotronixtechnologies.com"]
    ],
    "Git": [
      ["work", "Leoforce", "GitLab workflows"],
      ["project", "Offensive Check", "Version control on GitHub", "https://github.com/khs14"],
      ["project", "Scholar Stack", "Version control on GitHub", "https://github.com/khs14"],
      ["project", "Event Hub", "Version control on GitHub", "https://github.com/khs14/event_hub"]
    ],
    "REST APIs": [
      ["work", "ISRO", "Custom API for the disaster portal"],
      ["work", "Leoforce", "Dashboards built on REST APIs"]
    ],
    "Software Engineering & PM": [
      ["work", "Kotronix Technologies", "Coordinated service projects with a 20-person team"],
      ["education", "The NorthCap University", "Software Engineering & Project Management"]
    ],
    "Node.js": [
      ["work", "ISRO", "Backend for the disaster portal"]
    ],
    "Streamlit": [
      ["project", "Offensive Check", "Deployed on Streamlit Cloud", "https://offensive-check.streamlit.app/"]
    ],
    "Firebase": [
      ["project", "Scholar Stack", "Backend", "https://scholarstack.in"]
    ],
    "Android Development": [
      ["project", "Event Hub", "Kotlin and Jetpack Compose app", "https://github.com/khs14/event_hub"]
    ]
  },
  "Systems & Security": {
    "Cybersecurity": [
      ["education", "University of Michigan", "Computer and Network Security"],
      ["education", "The NorthCap University", "Cyber Security"],
      ["education", "The NorthCap University", "Peer tutor for Cyber Security"]
    ],
    "Computer Networks": [
      ["education", "University of Michigan", "Computer and Network Security"],
      ["education", "The NorthCap University", "Computer Networks"]
    ],
    "Data Structures & Algorithms": [
      ["education", "The NorthCap University", "Data Structures; Analysis & Design of Algorithms; Discrete Mathematics; Theory of Computation"]
    ],
    "Operating Systems": [
      ["education", "The NorthCap University", "Operating System"]
    ],
    "IoT": [
      ["education", "The NorthCap University", "Intro to Industry 4.0 & IoT, coded in C"]
    ],
    "Hardware Fault Diagnostics": [
      ["work", "Kotronix Technologies", "Component-level repair of 22+ DC fast chargers"]
    ]
  },
  "Professional": {
    "Leadership": [
      ["work", "Kotronix Technologies", "Led a technical team of 20"],
      ["activity", "Enactus", "Directed creative design and finance"],
      ["activity", "GDSC", "Organized technical events"],
      ["activity", "Sardar Patel Vidyalaya", "Class Representative, grades 9 to 12"]
    ],
    "Technical Writing": [
      ["work", "ISRO", "Paper in a Q1 Springer Nature journal"],
      ["work", "Rancho Labs", "Slides and learning materials for 20,000+ students"]
    ],
    "Entrepreneurship": [
      ["work", "Kotronix Technologies", "Founded and ran the company; $171K in revenue"],
      ["education", "The NorthCap University", "Entrepreneurship"]
    ]
  }
};