// Comprehensive Mock Database for Siddharth School Bus & Travels (Nashik)

export const INITIAL_SCHOOLS = [
  {
    id: "SCH01",
    name: "Shree Chatrapati Shivaji Maharaj Vidhaylay Makhamalabad.",
    code: "SCSMV",
    location: "Makhamalabad, Nashik",
    contact: "+91 84463 91127",
    activeStudents: 48,
    busAssigned: ["MH-15-RN-4501", "MH-15-RN-4504"]
  },
  {
    id: "SCH02",
    name: "New Grace Academy, Akta Nagar,Borgad Nashik",
    code: "NGA",
    location: "Akta Nagar, Borgad, Nashik",
    contact: "+91 84463 91127",
    activeStudents: 42,
    busAssigned: ["MH-15-RN-4502"]
  },
  {
    id: "SCH03",
    name: "Kaka Saheb Deodhar English Medium School, Reliance Pump Dindori Road.Nashik",
    code: "KSDEMS",
    location: "Reliance Pump, Dindori Road, Nashik",
    contact: "+91 84463 91127",
    activeStudents: 56,
    busAssigned: ["MH-15-RN-4503"]
  }
];

export const INITIAL_FLEET = [
  {
    busNo: "Bus #1",
    plate: "MH-15-RN-4501",
    model: "Tata Winger Executive (22 Seater)",
    driverName: "Siddharth Kailas Shardul",
    driverPhone: "8446391127",
    routeId: "R1",
    routeName: "Route 1: Borgad - Adarsh Nagar - Omkar Nagar - Swami Vivekanand Nagar",
    status: "On Route",
    speed: "32 km/h",
    currentLocation: "Near Swami Vivekanand Nagar Stop",
    etaNextStop: "4 mins"
  },
  {
    busNo: "Bus #2",
    plate: "MH-15-RN-4502",
    model: "Tata Winger Deluxe (20 Seater)",
    driverName: "Ramesh Shinde",
    driverPhone: "9823567890",
    routeId: "R2",
    routeName: "Route 2: Makhamalabad - Swami Vivekanand Nagar - Adarsh Nagar",
    status: "On Route",
    speed: "28 km/h",
    currentLocation: "Near Adarsh Nagar Corner",
    etaNextStop: "6 mins"
  },
  {
    busNo: "Bus #3",
    plate: "MH-15-RN-4503",
    model: "Eicher Starline (32 Seater)",
    driverName: "Dnyaneshwar Shinde",
    driverPhone: "9823876543",
    routeId: "R3",
    routeName: "Route 3: Dindori Road - Akta Nagar - Borgad",
    status: "On Route",
    speed: "24 km/h",
    currentLocation: "Akta Nagar Signal",
    etaNextStop: "8 mins"
  },
  {
    busNo: "Bus #4",
    plate: "MH-15-RN-4504",
    model: "Force Traveller Royale (26 Seater)",
    driverName: "Vijay Jadhav",
    driverPhone: "9823987123",
    routeId: "R4",
    routeName: "Route 4: Omkar Nagar - Makhamalabad Road - Borgad",
    status: "School Bay",
    speed: "0 km/h",
    currentLocation: "Makhamalabad School Bus Bay",
    etaNextStop: "Next Trip 01:45 PM"
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "STU-1001",
    rollNo: "SCSMV-7A-14",
    studentName: "Aarav Sharma",
    parentName: "Rajesh Sharma",
    parentPhone: "9876543210", // Multi-child parent demo
    alternatePhone: "9876543211",
    email: "rajesh.sharma@example.com",
    schoolName: "Shree Chatrapati Shivaji Maharaj Vidhaylay Makhamalabad.",
    schoolId: "SCH01",
    busNo: "Bus #1",
    busPlate: "MH-15-RN-4501",
    routeId: "R1",
    routeName: "Route 1: Borgad - Adarsh Nagar - Omkar Nagar - Swami Vivekanand Nagar",
    stopName: "Swami Vivekanand Nagar Gate",
    pickupTime: "07:15 AM",
    dropTime: "02:45 PM",
    liveStatus: {
      morningStatus: "Boarded (07:18 AM)",
      eveningStatus: "Expected Boarding (02:30 PM)",
      isLiveOnBus: true
    },
    feeDetails: {
      totalAnnualFee: 33000,
      monthlyFee: 3000,
      paidAmount: 33000,
      dueAmount: 0,
      status: "PAID",
      lastPaymentDate: "2026-06-15",
      lastReceiptNo: "REC-2026-0891",
      nextDueDate: "Fully Paid (June–April)",
      paymentMode: "UPI / PhonePe",
      paymentsHistory: [
        { receiptNo: "REC-2026-0891", amount: 16500, date: "2026-06-15", mode: "UPI", term: "Academic Transport Fee (Term 2)" },
        { receiptNo: "REC-2026-0122", amount: 16500, date: "2026-04-10", mode: "Bank Transfer", term: "Academic Transport Fee (Term 1)" }
      ]
    }
  },
  {
    id: "STU-1002",
    rollNo: "SCSMV-3B-08",
    studentName: "Ananya Sharma",
    parentName: "Rajesh Sharma",
    parentPhone: "9876543210", // Sibling of Aarav
    alternatePhone: "9876543211",
    email: "rajesh.sharma@example.com",
    schoolName: "Shree Chatrapati Shivaji Maharaj Vidhaylay Makhamalabad.",
    schoolId: "SCH01",
    busNo: "Bus #1",
    busPlate: "MH-15-RN-4501",
    routeId: "R1",
    routeName: "Route 1: Borgad - Adarsh Nagar - Omkar Nagar - Swami Vivekanand Nagar",
    stopName: "Swami Vivekanand Nagar Gate",
    pickupTime: "07:15 AM",
    dropTime: "02:45 PM",
    liveStatus: {
      morningStatus: "Boarded (07:18 AM)",
      eveningStatus: "Expected Boarding (02:30 PM)",
      isLiveOnBus: true
    },
    feeDetails: {
      totalAnnualFee: 33000,
      monthlyFee: 3000,
      paidAmount: 16500,
      dueAmount: 16500,
      status: "DUE",
      lastPaymentDate: "2026-04-10",
      lastReceiptNo: "REC-2026-0123",
      nextDueDate: "2026-10-15",
      paymentMode: "Net Banking",
      paymentsHistory: [
        { receiptNo: "REC-2026-0123", amount: 16500, date: "2026-04-10", mode: "Net Banking", term: "First Half Academic Fee" }
      ]
    }
  },
  {
    id: "STU-1003",
    rollNo: "NGA-9C-22",
    studentName: "Vihaan Deshmukh",
    parentName: "Makarand Deshmukh",
    parentPhone: "9823012345",
    alternatePhone: "9823012346",
    email: "m.deshmukh@tcs.com",
    schoolName: "New Grace Academy, Akta Nagar,Borgad Nashik",
    schoolId: "SCH02",
    busNo: "Bus #2",
    busPlate: "MH-15-RN-4502",
    routeId: "R2",
    routeName: "Route 2: Makhamalabad - Swami Vivekanand Nagar - Adarsh Nagar",
    stopName: "Adarsh Nagar Corner",
    pickupTime: "06:50 AM",
    dropTime: "03:15 PM",
    liveStatus: {
      morningStatus: "Dropped at School (07:42 AM)",
      eveningStatus: "Waiting at School",
      isLiveOnBus: false
    },
    feeDetails: {
      totalAnnualFee: 33000,
      monthlyFee: 3000,
      paidAmount: 33000,
      dueAmount: 0,
      status: "PAID",
      lastPaymentDate: "2026-07-02",
      lastReceiptNo: "REC-2026-1104",
      nextDueDate: "Fully Paid (June–April)",
      paymentMode: "Google Pay",
      paymentsHistory: [
        { receiptNo: "REC-2026-1104", amount: 33000, date: "2026-07-02", mode: "Google Pay", term: "Full Academic Year (June to April)" }
      ]
    }
  },
  {
    id: "STU-1004",
    rollNo: "KSDEMS-5A-11",
    studentName: "Aditi Kulkarni",
    parentName: "Sunil Kulkarni",
    parentPhone: "9988776655",
    alternatePhone: "9988776656",
    email: "sunil.kulkarni@infosys.com",
    schoolName: "Kaka Saheb Deodhar English Medium School, Reliance Pump Dindori Road.Nashik",
    schoolId: "SCH03",
    busNo: "Bus #3",
    busPlate: "MH-15-RN-4503",
    routeId: "R3",
    routeName: "Route 3: Dindori Road - Akta Nagar - Borgad",
    stopName: "Omkar Nagar Chowk",
    pickupTime: "07:30 AM",
    dropTime: "02:15 PM",
    liveStatus: {
      morningStatus: "Boarded (07:32 AM)",
      eveningStatus: "In Transit",
      isLiveOnBus: true
    },
    feeDetails: {
      totalAnnualFee: 33000,
      monthlyFee: 3000,
      paidAmount: 11000,
      dueAmount: 22000,
      status: "DUE",
      lastPaymentDate: "2026-04-05",
      lastReceiptNo: "REC-2026-0044",
      nextDueDate: "2026-10-15",
      paymentMode: "Cash Receipt",
      paymentsHistory: [
        { receiptNo: "REC-2026-0044", amount: 11000, date: "2026-04-05", mode: "Cash", term: "Monthly Transport Fee (3 Months Cleared)" }
      ]
    }
  },
  {
    id: "STU-1008",
    rollNo: "SCSMV-10A-02",
    studentName: "Tanvi More",
    parentName: "Prashant More",
    parentPhone: "8446391127",
    alternatePhone: "9890123456",
    email: "prashant.more@siddharth.com",
    schoolName: "Shree Chatrapati Shivaji Maharaj Vidhaylay Makhamalabad.",
    schoolId: "SCH01",
    busNo: "Bus #1",
    busPlate: "MH-15-RN-4501",
    routeId: "R1",
    routeName: "Route 1: Borgad - Adarsh Nagar - Omkar Nagar - Swami Vivekanand Nagar",
    stopName: "Plot No 49, Swami Vivekanand Nagar",
    pickupTime: "07:30 AM",
    dropTime: "02:30 PM",
    liveStatus: {
      morningStatus: "Dropped at School (07:50 AM)",
      eveningStatus: "En Route to Stop",
      isLiveOnBus: true
    },
    feeDetails: {
      totalAnnualFee: 33000,
      monthlyFee: 3000,
      paidAmount: 33000,
      dueAmount: 0,
      status: "PAID",
      lastPaymentDate: "2026-05-10",
      lastReceiptNo: "REC-2026-0399",
      nextDueDate: "Fully Paid (June–April)",
      paymentMode: "UPI / PhonePe",
      paymentsHistory: [
        { receiptNo: "REC-2026-0399", amount: 33000, date: "2026-05-10", mode: "UPI", term: "Annual Full (June to April)" }
      ]
    }
  }
];

export const INITIAL_NOTICES = [
  {
    id: "NOT-101",
    title: "Route Operations Status: On Schedule",
    content: "All morning & evening bus routes across Borgad, Adarsh Nagar, Omkar Nagar, and Swami Vivekanand Nagar are operating on schedule. For urgent assistance, contact Mr. Siddharth Kailas Shardul (+91 84463 91127).",
    target: "All Parents",
    type: "INFO",
    date: "2026-08-30",
    time: "07:30 AM",
    urgent: false
  }
];

export const INITIAL_PENDING_LINKS = [
  {
    id: "REQ-501",
    parentName: "Vikram Malhotra",
    phone: "9822998877",
    requestedStudentName: "Devansh Malhotra",
    schoolName: "Shree Chatrapati Shivaji Maharaj Vidhaylay Makhamalabad.",
    grade: "Grade 6-B",
    routeInterested: "Route 1: Borgad - Adarsh Nagar - Omkar Nagar - Swami Vivekanand Nagar",
    stopName: "Swami Vivekanand Nagar",
    requestDate: "2026-08-19 18:30",
    status: "PENDING"
  }
];

export const OWNER_CONFIG = {
  name: "Siddharth Kailas Shardul",
  businessName: "Siddharth School Bus & Travels",
  primaryPhone: "8446391127",
  whatsappNumber: "918446391127",
  email: "siddharthshardul96@gmail.com",
  instagram: "https://www.instagram.com/siddhshardul2?igsi=MWRnaTM5aWF0c25hdg==",
  instagramHandle: "@siddhshardul2",
  officeAddress: "Plot No 49, Vithu Mauli Colony Lane No 1, Swami Vivekanand Nagar, Makhamalabad, Nashik",
  estYear: "2017",
  city: "Nashik"
};
