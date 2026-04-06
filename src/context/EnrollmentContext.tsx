import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EnrollmentData {
  fullName: string;
  dob: string;
  age: number | null;
  gender: string;
  relativeName: string;
  relationType: string;
  mobile: string;
  email: string;
  houseNo: string;
  street: string;
  city: string;
  pincode: string;
  state: string;
  district: string;
  constituency: string;
  parliamentaryConstituency: string;
  pollingBooth: string;
  aadhaarFormatted: string;
  aadhaarHashed: boolean;
  photoUploaded: boolean;
  aadhaarDocUploaded: boolean;
  fingerprintCaptured: boolean;
  fingerprintQuality: number;
  declarationChecked: boolean;
}

export interface DashboardStats {
  enrollmentsToday: number;
  pendingVerification: number;
  rejectedToday: number;
  totalThisWeek: number;
}

const defaultEnrollment: EnrollmentData = {
  fullName: '', dob: '', age: null, gender: '', relativeName: '', relationType: '',
  mobile: '', email: '', houseNo: '', street: '', city: '', pincode: '',
  state: 'Karnataka', district: '', constituency: '', parliamentaryConstituency: '',
  pollingBooth: '', aadhaarFormatted: '', aadhaarHashed: false, photoUploaded: false,
  aadhaarDocUploaded: false, fingerprintCaptured: false, fingerprintQuality: 0,
  declarationChecked: false,
};

interface ContextType {
  currentPage: string;
  setCurrentPage: (p: string) => void;
  enrollmentData: EnrollmentData;
  setEnrollmentData: React.Dispatch<React.SetStateAction<EnrollmentData>>;
  resetEnrollment: () => void;
  dashboardStats: DashboardStats;
  setDashboardStats: React.Dispatch<React.SetStateAction<DashboardStats>>;
}

const EnrollmentContext = createContext<ContextType | null>(null);

export const useEnrollment = () => {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error('useEnrollment must be used within provider');
  return ctx;
};

export const EnrollmentProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState('login');
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>(defaultEnrollment);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    enrollmentsToday: 24, pendingVerification: 6, rejectedToday: 2, totalThisWeek: 147,
  });

  const resetEnrollment = () => setEnrollmentData({ ...defaultEnrollment });

  return (
    <EnrollmentContext.Provider value={{
      currentPage, setCurrentPage, enrollmentData, setEnrollmentData,
      resetEnrollment, dashboardStats, setDashboardStats,
    }}>
      {children}
    </EnrollmentContext.Provider>
  );
};
