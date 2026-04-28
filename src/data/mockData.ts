export interface Project {
  id: string;
  title: string;
  abstract: string;
  technologies: string[];
  githubLink?: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedBy: string;
  submittedById?: string;
  submittedAt: string;
  rejectionComment?: string;
  type: 'portfolio' | 'abstract';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'STAFF';
  department: string;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Smart Campus Navigation System',
    abstract: 'A mobile-first web application that helps students and visitors navigate the university campus using indoor mapping and real-time location services. The system includes accessibility features for users with disabilities and integrates with class schedules to provide optimal routes between classes.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Mapbox API'],
    githubLink: 'https://github.com/example/smart-campus',
    status: 'approved',
    submittedBy: 'John Doe',
    submittedAt: '2024-08-15',
    type: 'abstract',
  },
  {
    id: '2',
    title: 'AI-Powered Study Assistant',
    abstract: 'An intelligent tutoring system that uses natural language processing to answer student questions, generate practice problems, and provide personalized learning recommendations based on student performance patterns. The system adapts difficulty levels based on individual progress.',
    technologies: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
    githubLink: 'https://github.com/example/study-assistant',
    status: 'approved',
    submittedBy: 'Jane Smith',
    submittedAt: '2024-07-22',
    type: 'abstract',
  },
  {
    id: '3',
    title: 'Blockchain-Based Credential Verification',
    abstract: 'A decentralized application for verifying academic credentials and certificates. Universities can issue tamper-proof digital certificates that employers can instantly verify without contacting the institution. Reduces fraud and streamlines the hiring process.',
    technologies: ['Solidity', 'Ethereum', 'React', 'Web3.js'],
    status: 'approved',
    submittedBy: 'Mike Johnson',
    submittedAt: '2024-06-10',
    type: 'abstract',
  },
  {
    id: '4',
    title: 'Mental Health Support Chatbot',
    abstract: 'A conversational AI chatbot designed to provide initial mental health support and resources to university students. The bot uses sentiment analysis to detect distress levels and can connect students with professional counseling services when needed.',
    technologies: ['Python', 'Dialogflow', 'React Native', 'Firebase'],
    githubLink: 'https://github.com/example/mental-health-bot',
    status: 'approved',
    submittedBy: 'Sarah Williams',
    submittedAt: '2024-05-28',
    type: 'abstract',
  },
  {
    id: '5',
    title: 'Sustainable Food Delivery Platform',
    abstract: 'An eco-friendly food delivery application that partners with local restaurants to reduce packaging waste and carbon emissions. Features include carbon footprint tracking per order, reusable container programs, and bicycle delivery optimization algorithms.',
    technologies: ['Vue.js', 'Django', 'PostgreSQL', 'Google Maps API'],
    status: 'approved',
    submittedBy: 'Alex Chen',
    submittedAt: '2024-04-15',
    type: 'abstract',
  },
  {
    id: '6',
    title: 'Virtual Lab Simulator',
    abstract: 'A 3D virtual reality laboratory environment for conducting chemistry and physics experiments safely. Students can perform dangerous experiments without risk, repeat procedures unlimited times, and receive instant feedback on their technique.',
    technologies: ['Unity', 'C#', 'WebGL', 'Three.js'],
    githubLink: 'https://github.com/example/virtual-lab',
    status: 'approved',
    submittedBy: 'Emily Brown',
    submittedAt: '2024-03-20',
    type: 'abstract',
  },
  {
    id: '7',
    title: 'Peer Tutoring Marketplace',
    abstract: 'A platform connecting students who need help with specific subjects to peer tutors who excel in those areas. Includes scheduling, video conferencing, payment processing, and a rating system to ensure quality tutoring sessions.',
    technologies: ['React', 'Express', 'MongoDB', 'Stripe', 'WebRTC'],
    status: 'approved',
    submittedBy: 'David Lee',
    submittedAt: '2024-02-10',
    type: 'abstract',
  },
  {
    id: '8',
    title: 'Smart Waste Management System',
    abstract: 'IoT-enabled waste bins with sensors that monitor fill levels and optimize collection routes. The dashboard provides analytics on waste generation patterns and helps universities meet sustainability goals through data-driven decisions.',
    technologies: ['Arduino', 'Python', 'React', 'AWS IoT', 'Machine Learning'],
    githubLink: 'https://github.com/example/smart-waste',
    status: 'approved',
    submittedBy: 'Rachel Green',
    submittedAt: '2024-01-05',
    type: 'abstract',
  },
  {
    id: '9',
    title: 'Attendance Tracking with Face Recognition',
    abstract: 'An automated attendance system using facial recognition technology. Students are automatically marked present when they enter the classroom, eliminating manual roll calls and reducing time wastage. Privacy-preserving techniques ensure data protection.',
    technologies: ['Python', 'OpenCV', 'TensorFlow', 'Flask', 'SQLite'],
    status: 'pending',
    submittedBy: 'Tom Wilson',
    submittedAt: '2024-09-01',
    type: 'abstract',
  },
  {
    id: '10',
    title: 'Campus Event Discovery App',
    abstract: 'A social platform for discovering and organizing campus events. Features include event recommendations based on interests, RSVP tracking, social sharing, and integration with campus calendars. Clubs can manage their events and track attendance.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Push Notifications'],
    status: 'pending',
    submittedBy: 'Lisa Anderson',
    submittedAt: '2024-09-05',
    type: 'abstract',
  },
  {
    id: '11',
    title: 'Code Plagiarism Detection Tool',
    abstract: 'A sophisticated tool for detecting code plagiarism in programming assignments. Uses abstract syntax tree analysis and machine learning to identify similar code structures even when variable names and formatting are changed.',
    technologies: ['Python', 'ANTLR', 'scikit-learn', 'Django'],
    githubLink: 'https://github.com/example/code-check',
    status: 'approved',
    submittedBy: 'Chris Martin',
    submittedAt: '2023-12-15',
    type: 'abstract',
  },
  {
    id: '12',
    title: 'Student Budget Tracker',
    abstract: 'A financial management app designed specifically for students. Tracks expenses, income from part-time jobs, and financial aid. Provides insights on spending habits and tips for saving money on a student budget.',
    technologies: ['Flutter', 'Firebase', 'Dart', 'Charts.js'],
    status: 'approved',
    submittedBy: 'Amy Taylor',
    submittedAt: '2023-11-20',
    type: 'abstract',
  },
];

export const aiSuggestions: Record<string, string[]> = {
  '1': [
    'Implement AR navigation overlay for enhanced wayfinding experience',
    'Add voice-guided navigation for visually impaired users',
    'Integrate with university bus tracking for multi-modal navigation',
    'Add crowdsourcing feature for real-time obstacle reporting',
  ],
  '2': [
    'Add support for multiple languages to help international students',
    'Implement spaced repetition algorithm for better memory retention',
    'Create collaborative study rooms with shared AI assistance',
    'Add integration with popular LMS platforms like Canvas or Moodle',
  ],
  '3': [
    'Extend to support professional certifications beyond academia',
    'Add QR code scanning for quick verification at career fairs',
    'Implement cross-chain compatibility for wider adoption',
    'Create a mobile wallet app for students to manage their credentials',
  ],
  '4': [
    'Add multilingual support for diverse student populations',
    'Implement anonymous peer support matching features',
    'Create integration with wearables for stress detection',
    'Add journaling features with sentiment tracking over time',
  ],
  '5': [
    'Implement gamification with eco-points and rewards',
    'Add group ordering feature to reduce delivery trips',
    'Partner with campus dining halls for late-night options',
    'Create a carbon offset marketplace for conscious consumers',
  ],
  '6': [
    'Add multiplayer mode for collaborative experiments',
    'Implement AI lab instructor for real-time guidance',
    'Create assessment mode with graded practical exams',
    'Add support for biology and anatomy virtual dissections',
  ],
  '7': [
    'Add group tutoring sessions for study groups',
    'Implement AI matching algorithm based on learning styles',
    'Create tutor certification and training program',
    'Add whiteboard collaboration tools for math and science',
  ],
  '8': [
    'Add recycling sorting recommendations using image recognition',
    'Implement composting bin monitoring for food waste',
    'Create gamification with department competitions',
    'Add integration with sustainability reporting dashboards',
  ],
  '9': [
    'Add mask detection and temperature screening integration',
    'Implement student consent management dashboard',
    'Create attendance analytics for identifying at-risk students',
    'Add integration with learning management systems',
  ],
  '10': [
    'Add virtual event support with streaming integration',
    'Implement event recommendation AI based on past attendance',
    'Create networking features for professional events',
    'Add sponsorship and ticketing for paid events',
  ],
  '11': [
    'Add support for more programming languages and frameworks',
    'Implement explanation generation for detected similarities',
    'Create integration with popular IDEs as plugins',
    'Add self-check feature for students before submission',
  ],
  '12': [
    'Add scholarship and financial aid tracking features',
    'Implement bill splitting for shared housing expenses',
    'Create textbook price comparison and rental suggestions',
    'Add meal planning with budget-friendly recipes',
  ],
};

export const allTechnologies = [
  'React', 'React Native', 'Vue.js', 'Angular', 'Node.js', 'Express',
  'Python', 'Django', 'Flask', 'TensorFlow', 'PyTorch', 'scikit-learn',
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Firebase', 'AWS',
  'Unity', 'C#', 'Java', 'Kotlin', 'Swift', 'Flutter', 'Dart',
  'Solidity', 'Ethereum', 'Web3.js', 'Blockchain',
  'Machine Learning', 'AI', 'NLP', 'Computer Vision', 'IoT', 'Arduino',
  'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'WebRTC', 'WebGL',
];
