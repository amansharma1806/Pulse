const bloodGroups = [
{ value: "A_POSITIVE", label: "A+" },
{ value: "A_NEGATIVE", label: "A-" },
{ value: "B_POSITIVE", label: "B+" },
{ value: "B_NEGATIVE", label: "B-" },
{ value: "O_POSITIVE", label: "0+" },
{ value: "O_NEGATIVE", label: "0-" },
{ value: "AB_POSITIVE", label: "AB+" },
{ value: "AB_NEGATIVE", label: "AB-" }
];
const bloodGroupH: Record<string, string> = {
A_POSITIVE: "A+",
A_NEGATIVE: "A-",
B_POSITIVE: "B+",
B_NEGATIVE: "B-",
O_POSITIVE: "0+",
O_NEGATIVE: "0-",
AB_POSITIVE: "AB+",
AB_NEGATIVE: "AB-"
};
const specializations = ["Cardiologist", "Dermatologist", "Neurologist", "Orthopedic", "Pediatrician","Gynecologist","Oncologist", "Radiologist", "Gastroenterologist", "Psychiatrist","ENT Specialist", "Ophthalmologist", "Anesthesiologist", "Urologist", "Nephrologist", "Endocrinologist", "Pulmonologist", "Hematologist", "Rheumatologist", "General Physician", "General Surgeon", "Plastic Surgeon", "Dentist", "Pathologist"];
const departments = [
  "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics",
  "Gynecology", "Oncology", "Radiology", "Gastroenterology", "Psychiatry",
  "ENT", "Ophthalmology", "Anesthesiology", "Urology", "Nephrology",
  "Endocrinology", "Pulmonology", "Hematology", "Rheumatology", "General Medicine",
  "General Surgery", "Plastic Surgery", "Dentistry", "Pathology"
];
const appointmentReasons = [
  "General Consultation",
  "Follow-up Visit",
  "Prescription Refill",
  "Lab Test Results Discussion",
  "Vaccination",
  "Routine Health Checkup",
  "Skin Allergy or Rash",
  "Mental Health Counseling",
  "Chronic Disease Management",
  "Diabetes or Blood Pressure Review",
  "Pre-surgery Assessment",
  "Post-surgery Follow-up",
  "Fever or Infection Symptoms",
  "Joint or Muscle Pain",
  "Request for Medical Certificate"
];
const symptoms = [
  "Fever",
  "Cough",
  "Sore Throat",
  "Headache",
  "Fatigue",
  "Shortness of Breath",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Muscle Pain",
  "Joint Pain",
  "Loss of Taste",
  "Loss of Smell",
  "Runny Nose",
  "Congestion",
  "Chest Pain",
  "Dizziness",
  "Chills",
  "Sweating",
  "Abdominal Pain",
  "Back Pain",
  "Skin Rash",
  "Swollen Lymph Nodes",
  "Eye Irritation",
  "Sneezing",
  "Blurred Vision",
  "Itching",
  "Tingling",
  "Difficulty Swallowing",
  "Palpitations",
  "Insomnia",
  "Night Sweats",
  "Weight Loss",
  "Weight Gain",
  "Anxiety",
  "Depression"
];
const tests = [
  "Complete Blood Count (CBC)",
  "Blood Sugar (Fasting)",
  "Blood Sugar (Postprandial)",
  "HbA1c",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Lipid Profile",
  "Urine Routine",
  "X-Ray",
  "ECG",
  "MRI",
  "CT Scan",
  "Thyroid Profile (T3, T4, TSH)",
  "Vitamin D",
  "Vitamin B12",
  "COVID-19 RT-PCR",
  "Dengue NS1 Antigen",
  "Malaria Smear",
  "CRP",
  "ESR"
];

const dosageFrequencies = [
  "1-0-0", // Once daily (morning)
  "0-1-0", // Once daily (afternoon)
  "0-0-1", // Once daily (night)
  "1-0-1", // Morning & night
  "1-1-0", // Morning & afternoon
  "0-1-1", // Afternoon & night
  "1-1-1", // Thrice a day
  "2-0-2", // Two tabs morning & night
  "1-1-2", // Custom high night dose
  "0-0-1 SOS", // Night only when needed
  "1-0-1 x 5 days", // For 5 days
  "1-0-1 after food", // With food
  "1-0-1 before food" // Before meals
];
///
///self
const medicineCategories= [
  "ANTIBIOTIC",
  "ANALGESIC",
  "ANTIHISTAMINE",
  "ANTISEPTIC",
  "VITAMIN",
  "MINERAL",
  "HERBAL",
  "HOMEOPATHIC",
  "OTHER"
];
const medicineType = [
  "SYRUP",
  "TABLET",
  "CAPSULE",
  "INJECTION",
  "OINTMENT",
  "LIQUID",
  "POWDER",
  "CREAM",
  "SPRAY",
  "DROPS"
];

///self

export {bloodGroups,specializations,departments,bloodGroupH,appointmentReasons,symptoms,tests,dosageFrequencies,medicineType,medicineCategories};