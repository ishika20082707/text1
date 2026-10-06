export interface Course {
  id: string;
  name: string;
  duration: string;
  eligibility: string;
  seats: number;
  fees: string;
  description: string;
}

export interface AcademicDetails {
  previousSchool: string;
  board: string;
  marksPercentage: number;
  yearOfPassing: string;
}

export interface PersonalDetails {
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface Application {
  id: string;
  studentId: string; // matches student email
  personalDetails: PersonalDetails;
  academicDetails: AcademicDetails;
  coursePreference1: string; // course ID
  coursePreference2: string; // course ID
  documents: {
    photoName: string;
    photoUrl: string;
    marksheetName: string;
    marksheetUrl: string;
    idProofName: string;
    idProofUrl: string;
  };
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Waitlisted';
  submittedDate: string;
  remarks: string;
}

export interface User {
  email: string;
  role: 'admin' | 'student';
  fullName: string;
}

export const INITIAL_COURSES: Course[] = [
  {
    id: 'cse',
    name: 'B.Tech in Computer Science & Engineering',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 or equivalent with Physics, Chemistry, and Mathematics (Min 60%)',
    seats: 120,
    fees: '$4,500 / year',
    description: 'A comprehensive program covering software engineering, artificial intelligence, data structures, and computer networks.'
  },
  {
    id: 'bba',
    name: 'Bachelor of Business Administration (BBA)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 or equivalent in any stream with minimum 50% marks',
    seats: 80,
    fees: '$3,200 / year',
    description: 'Focuses on leadership, marketing, human resource management, financial accounting, and business strategy.'
  },
  {
    id: 'dsa',
    name: 'B.Sc in Data Science & Analytics',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with Mathematics as a mandatory subject (Min 55%)',
    seats: 60,
    fees: '$3,800 / year',
    description: 'Designed to equip students with statistical methods, data visualization, machine learning, and database management.'
  },
  {
    id: 'bdes',
    name: 'Bachelor of Design (B.Des)',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 or equivalent in any stream (Min 50%) and creative aptitude',
    seats: 45,
    fees: '$3,500 / year',
    description: 'Covers user experience design, communication design, product modeling, and digital media creation.'
  },
  {
    id: 'econ',
    name: 'B.A. (Hons) in Economics & Finance',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 or equivalent with Mathematics or Economics (Min 55%)',
    seats: 50,
    fees: '$3,000 / year',
    description: 'Provides in-depth understanding of macroeconomic policies, financial systems, microeconomics, and econometrics.'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'APP-1001',
    studentId: 'student@school.com',
    personalDetails: {
      fullName: 'Alex Carter',
      dob: '2008-04-12',
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      email: 'student@school.com',
      address: '742 Evergreen Terrace, Springfield'
    },
    academicDetails: {
      previousSchool: 'Springfield High School',
      board: 'State Board',
      marksPercentage: 88.5,
      yearOfPassing: '2026'
    },
    coursePreference1: 'cse',
    coursePreference2: 'dsa',
    documents: {
      photoName: 'alex_carter_avatar.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'highschool_transcript.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'driver_license_copy.jpg',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Under Review',
    submittedDate: '2026-10-01',
    remarks: 'Awaiting verification of official physics and chemistry transcripts. High overall score.'
  },
  {
    id: 'APP-1002',
    studentId: 'emma.watson@gmail.com',
    personalDetails: {
      fullName: 'Emma Watson',
      dob: '2008-05-15',
      gender: 'Female',
      phone: '+1 (555) 987-6543',
      email: 'emma.watson@gmail.com',
      address: '10 Downing Street, London'
    },
    academicDetails: {
      previousSchool: 'Hogwarts Academy',
      board: 'CIE A-Levels',
      marksPercentage: 97.2,
      yearOfPassing: '2026'
    },
    coursePreference1: 'cse',
    coursePreference2: 'econ',
    documents: {
      photoName: 'emma_photo.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'alevels_marksheet.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'passport_scan.jpg',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Approved',
    submittedDate: '2026-09-28',
    remarks: 'Exceptional academic record. Highly recommended for immediate approval.'
  },
  {
    id: 'APP-1003',
    studentId: 'marcus.vance@yahoo.com',
    personalDetails: {
      fullName: 'Marcus Vance',
      dob: '2007-11-20',
      gender: 'Male',
      phone: '+1 (555) 444-5555',
      email: 'marcus.vance@yahoo.com',
      address: '124 Conch Street, Bikini Bottom'
    },
    academicDetails: {
      previousSchool: 'Coral High School',
      board: 'IB Diploma',
      marksPercentage: 74.0,
      yearOfPassing: '2025'
    },
    coursePreference1: 'bba',
    coursePreference2: 'bdes',
    documents: {
      photoName: 'marcus_vance.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'ib_diploma_marks.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'national_id.pdf',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Waitlisted',
    submittedDate: '2026-09-30',
    remarks: 'Seat limit reached for BBA. Waitlisted in position #4.'
  },
  {
    id: 'APP-1004',
    studentId: 'sophia.choi@outlook.com',
    personalDetails: {
      fullName: 'Sophia Choi',
      dob: '2008-01-30',
      gender: 'Female',
      phone: '+1 (555) 234-5678',
      email: 'sophia.choi@outlook.com',
      address: '88 Gangnam-daero, Seoul'
    },
    academicDetails: {
      previousSchool: 'Seoul International High',
      board: 'AP Curriculum',
      marksPercentage: 92.0,
      yearOfPassing: '2026'
    },
    coursePreference1: 'bdes',
    coursePreference2: 'cse',
    documents: {
      photoName: 'sophia_pic.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'transcript_final.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'id_card.pdf',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Approved',
    submittedDate: '2026-09-25',
    remarks: 'Excellent portfolio and high AP scores. Approved for first preference (B.Des).'
  },
  {
    id: 'APP-1005',
    studentId: 'liam.neeson@live.com',
    personalDetails: {
      fullName: 'Liam Neeson',
      dob: '2006-06-07',
      gender: 'Male',
      phone: '+1 (555) 839-2018',
      email: 'liam.neeson@live.com',
      address: '55 Cliffside Road, Dublin'
    },
    academicDetails: {
      previousSchool: 'St. Patrick\'s College',
      board: 'State Board',
      marksPercentage: 54.5,
      yearOfPassing: '2024'
    },
    coursePreference1: 'cse',
    coursePreference2: 'dsa',
    documents: {
      photoName: 'liam_profile.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'marks_sheet.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'passport_ireland.pdf',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Rejected',
    submittedDate: '2026-09-15',
    remarks: 'Does not meet the eligibility requirement of minimum 60% in Science/Math for B.Tech in CSE.'
  },
  {
    id: 'APP-1006',
    studentId: 'chloe.tan@gmail.com',
    personalDetails: {
      fullName: 'Chloe Tan',
      dob: '2007-09-02',
      gender: 'Female',
      phone: '+65 9123 4567',
      email: 'chloe.tan@gmail.com',
      address: '25 Orchard Road, Singapore'
    },
    academicDetails: {
      previousSchool: 'Raffles Institution',
      board: 'Cambridge A-Levels',
      marksPercentage: 91.0,
      yearOfPassing: '2026'
    },
    coursePreference1: 'econ',
    coursePreference2: 'bba',
    documents: {
      photoName: 'chloe_t.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'alevel_cambridge.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'nric_card.png',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Submitted',
    submittedDate: '2026-10-04',
    remarks: ''
  },
  {
    id: 'APP-1007',
    studentId: 'amit.patel@rediff.com',
    personalDetails: {
      fullName: 'Amit Patel',
      dob: '2008-02-14',
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'amit.patel@rediff.com',
      address: 'Sector 21, Gandhinagar, Gujarat'
    },
    academicDetails: {
      previousSchool: 'Gyan Mandir School',
      board: 'CBSE Board',
      marksPercentage: 85.6,
      yearOfPassing: '2026'
    },
    coursePreference1: 'cse',
    coursePreference2: 'dsa',
    documents: {
      photoName: 'amit_p.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'cbse_grade_sheet.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'aadhaar_card.png',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Under Review',
    submittedDate: '2026-10-02',
    remarks: 'Reviewing transcripts. Initial academic verification passed.'
  },
  {
    id: 'APP-1008',
    studentId: 'isabella.gomez@gmail.com',
    personalDetails: {
      fullName: 'Isabella Gomez',
      dob: '2007-08-19',
      gender: 'Female',
      phone: '+1 (555) 765-4321',
      email: 'isabella.gomez@gmail.com',
      address: '42 Pine Avenue, Miami, FL'
    },
    academicDetails: {
      previousSchool: 'Miami Heights High',
      board: 'State Board',
      marksPercentage: 79.8,
      yearOfPassing: '2026'
    },
    coursePreference1: 'bba',
    coursePreference2: 'econ',
    documents: {
      photoName: 'isabella_g.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'transcript_hs.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'passport_photo.pdf',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Submitted',
    submittedDate: '2026-10-05',
    remarks: ''
  },
  {
    id: 'APP-1009',
    studentId: 'ryan.reynolds@gmail.com',
    personalDetails: {
      fullName: 'Ryan Reynolds',
      dob: '2007-10-23',
      gender: 'Male',
      phone: '+1 (555) 345-6789',
      email: 'ryan.reynolds@gmail.com',
      address: '100 Sunset Boulevard, Vancouver'
    },
    academicDetails: {
      previousSchool: 'Kitsilano Secondary School',
      board: 'BC Graduation Program',
      marksPercentage: 82.3,
      yearOfPassing: '2026'
    },
    coursePreference1: 'bba',
    coursePreference2: 'cse',
    documents: {
      photoName: 'ryan_r.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'transcript.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'bc_services_card.png',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Submitted',
    submittedDate: '2026-10-03',
    remarks: ''
  },
  {
    id: 'APP-1010',
    studentId: 'taylor.swift@hotmail.com',
    personalDetails: {
      fullName: 'Taylor Swift',
      dob: '2007-12-13',
      gender: 'Female',
      phone: '+1 (555) 131-3131',
      email: 'taylor.swift@hotmail.com',
      address: '242 West End Ave, Nashville, TN'
    },
    academicDetails: {
      previousSchool: 'Hendersonville High School',
      board: 'State Board',
      marksPercentage: 94.0,
      yearOfPassing: '2025'
    },
    coursePreference1: 'bdes',
    coursePreference2: 'econ',
    documents: {
      photoName: 'taylor_s.jpg',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      marksheetName: 'grades_nashville.pdf',
      marksheetUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
      idProofName: 'driver_lic.jpg',
      idProofUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
    },
    status: 'Approved',
    submittedDate: '2026-09-20',
    remarks: 'Approved for Admission. Student has been sent an acceptance letter.'
  }
];

export const getStoredCourses = (): Course[] => {
  const data = localStorage.getItem('beacon_courses');
  if (!data) {
    localStorage.setItem('beacon_courses', JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }
  return JSON.parse(data);
};

export const saveStoredCourses = (courses: Course[]) => {
  localStorage.setItem('beacon_courses', JSON.stringify(courses));
};

export const getStoredApplications = (): Application[] => {
  const data = localStorage.getItem('beacon_applications');
  if (!data) {
    localStorage.setItem('beacon_applications', JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  return JSON.parse(data);
};

export const saveStoredApplications = (applications: Application[]) => {
  localStorage.setItem('beacon_applications', JSON.stringify(applications));
};

export const getActiveUser = (): User | null => {
  const data = localStorage.getItem('beacon_active_user');
  return data ? JSON.parse(data) : null;
};

export const setActiveUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('beacon_active_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('beacon_active_user');
  }
};
