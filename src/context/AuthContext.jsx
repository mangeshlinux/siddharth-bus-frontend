import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, studentsAPI, noticesAPI, schoolsAPI, fleetAPI, paymentsAPI } from '../services/api';
import BusLoader from '../components/BusLoader';
import {
  INITIAL_SCHOOLS,
  INITIAL_FLEET
} from '../services/mockData';

export function calculateFeeBreakdown(student) {
  const fee = student?.feeDetails || {};
  const totalAnnualFee = Number(fee.totalAnnualFee || 33000);
  const paidAmount = Number(fee.paidAmount || 0);
  const dueAmount = fee.dueAmount !== undefined ? Number(fee.dueAmount) : Math.max(0, totalAnnualFee - paidAmount);
  
  // 11-month Academic Session standard (June to April)
  const monthlyFee = fee.monthlyFee ? Number(fee.monthlyFee) : Math.round(totalAnnualFee / 11);
  const monthlyDue = Math.round(dueAmount / 11);
  
  // 11 Academic Months: Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar, Apr
  const academicMonths = [
    { month: 'Jun', fullName: 'June 2026', monthIndex: 1, targetAmount: monthlyFee },
    { month: 'Jul', fullName: 'July 2026', monthIndex: 2, targetAmount: monthlyFee },
    { month: 'Aug', fullName: 'August 2026', monthIndex: 3, targetAmount: monthlyFee },
    { month: 'Sep', fullName: 'September 2026', monthIndex: 4, targetAmount: monthlyFee },
    { month: 'Oct', fullName: 'October 2026', monthIndex: 5, targetAmount: monthlyFee },
    { month: 'Nov', fullName: 'November 2026', monthIndex: 6, targetAmount: monthlyFee },
    { month: 'Dec', fullName: 'December 2026', monthIndex: 7, targetAmount: monthlyFee },
    { month: 'Jan', fullName: 'January 2027', monthIndex: 8, targetAmount: monthlyFee },
    { month: 'Feb', fullName: 'February 2027', monthIndex: 9, targetAmount: monthlyFee },
    { month: 'Mar', fullName: 'March 2027', monthIndex: 10, targetAmount: monthlyFee },
    { month: 'Apr', fullName: 'April 2027', monthIndex: 11, targetAmount: monthlyFee }
  ];

  const clearedMonthsCount = dueAmount === 0 ? 11 : Math.min(11, Math.floor((paidAmount / (monthlyFee || 1)) + 0.05));

  const monthsList = academicMonths.map((m, idx) => ({
    ...m,
    isCleared: idx < clearedMonthsCount,
    isPartial: idx === clearedMonthsCount && (paidAmount % (monthlyFee || 1) > 0) && dueAmount > 0
  }));

  return {
    totalAnnualFee,
    paidAmount,
    dueAmount,
    monthlyFee,
    monthlyDue,
    status: dueAmount === 0 ? 'PAID' : (paidAmount > 0 ? 'PARTIAL' : 'DUE'),
    clearedMonthsCount,
    monthsList,
    nextDueDate: fee.nextDueDate || (dueAmount > 0 ? "Next Month 10th" : "Fully Paid (June–April)"),
    lastPaymentDate: fee.lastPaymentDate,
    lastReceiptNo: fee.lastReceiptNo,
    paymentMode: fee.paymentMode,
    paymentsHistory: fee.paymentsHistory || []
  };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [schools, setSchools] = useState(INITIAL_SCHOOLS);
  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Restore Session on Mount ───
  useEffect(() => {
    const restoreSession = async () => {
      if (!authAPI.hasToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await authAPI.getMe();
        if (data && data.user) {
          setUser(data.user);
          if (data.students) {
            setStudents(data.students);
          }
        }
      } catch {
        // Token invalid or expired — stay logged out
        authAPI.logout();
      }

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  // ─── Load Reference Data on Mount ───
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [schoolsData, fleetData, noticesData] = await Promise.all([
          schoolsAPI.getAll().catch(() => null),
          fleetAPI.getAll().catch(() => null),
          noticesAPI.getAll().catch(() => null)
        ]);

        if (schoolsData && schoolsData.length > 0) setSchools(schoolsData);
        if (fleetData && fleetData.length > 0) setFleet(fleetData);
        if (noticesData) setNotices(noticesData);
      } catch {
        // Fallback: keep mock data if backend is unavailable
        console.warn('Backend unavailable — using local fallback data.');
      }
    };

    loadReferenceData();
  }, []);

  // ─── Auth Methods ───
  const loginParent = useCallback(async (phone) => {
    try {
      const data = await authAPI.parentLogin(phone);
      if (data.success) {
        setUser(data.user);
        if (data.students) setStudents(data.students);
        return { success: true, count: data.count, user: data.user, students: data.students };
      }
      return { success: false, error: data.error };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'No student records found for this mobile number. Please check the number or contact Siddharth Travels.'
      };
    }
  }, []);

  const loginOwner = useCallback(async (pinOrPass) => {
    try {
      const data = await authAPI.ownerLogin(pinOrPass);
      if (data.success) {
        setUser(data.user);
        // Load all students for owner
        try {
          const allStudents = await studentsAPI.getAll();
          setStudents(allStudents);
        } catch { /* ignore */ }
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Invalid Owner Access PIN / Password.'
      };
    }
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setStudents([]);
  }, []);

  // ─── Student CRUD ───
  const addStudent = useCallback(async (studentData) => {
    try {
      const newStudent = await studentsAPI.add(studentData);
      setStudents(prev => [newStudent, ...prev]);
      return newStudent;
    } catch (error) {
      console.error('Add student failed:', error);
      return null;
    }
  }, []);

  const updateStudent = useCallback(async (id, updatedFields) => {
    try {
      const updated = await studentsAPI.update(id, updatedFields);
      setStudents(prev => prev.map(s => (s.id === id || s._id === id) ? updated : s));
      return updated;
    } catch (error) {
      console.error('Update student failed:', error);
    }
  }, []);

  const deleteStudent = useCallback(async (id) => {
    try {
      await studentsAPI.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id && s._id !== id));
    } catch (error) {
      console.error('Delete student failed:', error);
    }
  }, []);

  const recordPayment = useCallback(async (studentId, { amount, mode = "UPI", term = "School Bus Term Fee", notes = "" }) => {
    try {
      const result = await paymentsAPI.record(studentId, { amount, mode, term, notes });
      if (result.student) {
        setStudents(prev => prev.map(s =>
          (s.id === studentId || s._id === studentId) ? result.student : s
        ));
      }
      // Refresh notices (payment creates an auto-notice)
      try {
        const updatedNotices = await noticesAPI.getAll();
        setNotices(updatedNotices);
      } catch { /* ignore */ }

      return { receiptNo: result.receiptNo, date: result.date, amount: result.amount };
    } catch (error) {
      console.error('Record payment failed:', error);
      return null;
    }
  }, []);

  const bulkImportStudents = useCallback(async (newStudentsList) => {
    try {
      const result = await studentsAPI.bulkImport(newStudentsList);
      if (result.students) {
        setStudents(prev => [...result.students, ...prev]);
      }
      return result;
    } catch (error) {
      console.error('Bulk import failed:', error);
      return null;
    }
  }, []);

  const bulkSetFee = useCallback(async (studentIds, newTotalFee) => {
    try {
      await studentsAPI.bulkSetFee(studentIds, newTotalFee);
      // Refresh students list
      const refreshed = await studentsAPI.getAll();
      setStudents(refreshed);
    } catch (error) {
      console.error('Bulk set fee failed:', error);
    }
  }, []);

  const bulkSetPickupStop = useCallback(async (studentIds, newStop) => {
    try {
      await studentsAPI.bulkSetStop(studentIds, newStop);
      setStudents(prev => prev.map(s =>
        studentIds.includes(s.id) || studentIds.includes(s._id)
          ? { ...s, stopName: newStop }
          : s
      ));
    } catch (error) {
      console.error('Bulk set stop failed:', error);
    }
  }, []);

  // ─── Notice Broadcasting ───
  const broadcastNotice = useCallback(async (noticeData) => {
    const localNotice = {
      id: `NOT-${Date.now()}`,
      _id: `NOT-${Date.now()}`,
      title: noticeData.title,
      content: noticeData.content,
      target: noticeData.target || 'All Parents',
      type: noticeData.type || (noticeData.urgent ? 'URGENT' : 'INFO'),
      date: noticeData.date || new Date().toISOString().split('T')[0],
      time: noticeData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      urgent: !!noticeData.urgent,
      sentVia: noticeData.sentVia || ['In-App Broadcast']
    };

    try {
      const newNotice = await noticesAPI.broadcast(noticeData);
      const savedNotice = newNotice || localNotice;
      setNotices(prev => [savedNotice, ...prev.filter(n => n.id !== savedNotice.id && n._id !== savedNotice._id)]);
      return savedNotice;
    } catch (error) {
      console.warn('Backend broadcast notice unavailable, publishing locally:', error);
      setNotices(prev => [localNotice, ...prev]);
      return localNotice;
    }
  }, []);

  const deleteNotice = useCallback(async (id) => {
    setNotices(prev => prev.filter(n => n.id !== id && n._id !== id));
    try {
      await noticesAPI.delete(id);
    } catch (error) {
      console.warn('Backend delete notice failed or offline mode:', error);
    }
  }, []);

  const clearAllNotices = useCallback(async () => {
    setNotices([]);
    try {
      await noticesAPI.clearAll();
    } catch (error) {
      console.warn('Backend clear all notices failed or offline mode:', error);
    }
  }, []);

  // ─── Reset Demo Data (reloads from backend seed) ───
  const resetDemoData = useCallback(async () => {
    try {
      const [studentsData, noticesData, schoolsData, fleetData] = await Promise.all([
        studentsAPI.getAll(),
        noticesAPI.getAll(),
        schoolsAPI.getAll(),
        fleetAPI.getAll()
      ]);
      setStudents(studentsData || []);
      setNotices(noticesData || []);
      if (schoolsData?.length) setSchools(schoolsData);
      if (fleetData?.length) setFleet(fleetData);
    } catch (error) {
      console.error('Reset demo data failed:', error);
    }
  }, []);

  // Show animated bus loader while restoring session / waking up server
  if (isLoading) {
    return (
      <BusLoader 
        message="Connecting & Waking Up Server..."
        subtext="Backend services on Render may take a moment to spin up from sleep mode. Please stay on page!"
        fullScreen={true}
      />
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      students,
      notices,
      schools,
      fleet,
      loginParent,
      loginOwner,
      logout,
      addStudent,
      updateStudent,
      deleteStudent,
      recordPayment,
      bulkImportStudents,
      bulkSetFee,
      bulkSetPickupStop,
      broadcastNotice,
      deleteNotice,
      clearAllNotices,
      resetDemoData,
      calculateFeeBreakdown
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
