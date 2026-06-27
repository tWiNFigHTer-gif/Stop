import React, { createContext, useState, useEffect } from 'react';
import { initialPlaces, initialBusinesses, initialAlerts, initialComplaints, initialMaintenance } from '../data/mockData';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // Load state from localStorage or fallback to initial mock data
  const [places, setPlaces] = useState(() => {
    const saved = localStorage.getItem('stop_places');
    return saved ? JSON.parse(saved) : initialPlaces;
  });

  const [businesses, setBusinesses] = useState(() => {
    const saved = localStorage.getItem('stop_businesses');
    return saved ? JSON.parse(saved) : initialBusinesses;
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('stop_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('stop_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [maintenance, setMaintenance] = useState(() => {
    const saved = localStorage.getItem('stop_maintenance');
    return saved ? JSON.parse(saved) : initialMaintenance;
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('stop_is_logged_in') === 'true';
  });

  const loginUser = (username, password) => {
    if (username.toLowerCase() === 'chakkittaparapanchayat' && password === 'admin@123') {
      setIsLoggedIn(true);
      localStorage.setItem('stop_is_logged_in', 'true');
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('stop_is_logged_in');
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('stop_places', JSON.stringify(places));
  }, [places]);

  useEffect(() => {
    localStorage.setItem('stop_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('stop_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('stop_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('stop_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  // --- ACTIONS ---

  // Places Actions
  const addPlace = (place) => {
    setPlaces(prev => [...prev, {
      ...place,
      id: `place-${Date.now()}`,
      feedback: [],
      maintenanceHistory: [],
      currentOccupancy: 0,
      visitorsToday: 0
    }]);
  };

  const editPlace = (updatedPlace) => {
    setPlaces(prev => prev.map(p => p.id === updatedPlace.id ? { ...p, ...updatedPlace } : p));
  };

  const deletePlace = (id) => {
    setPlaces(prev => prev.filter(p => p.id !== id));
    if (selectedPlaceId === id) {
      setSelectedPlaceId(null);
      setActiveTab('places');
    }
  };

  const togglePlaceStatus = (id) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.currentStatus === 'Open' ? 'Closed' : 'Open';
        return {
          ...p,
          currentStatus: newStatus,
          currentOccupancy: newStatus === 'Closed' ? 0 : p.currentOccupancy
        };
      }
      return p;
    }));
  };

  // Business Actions
  const updateBusinessVerification = (id, newStatus) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          verificationStatus: newStatus,
          licenseStatus: newStatus === 'Approved' ? 'Active' : 'Suspended'
        };
      }
      return b;
    }));
  };

  // Alerts Actions
  const addAlert = (alertData) => {
    setAlerts(prev => [
      {
        id: `alert-${Date.now()}`,
        publishedAt: new Date().toISOString(),
        isActive: true,
        ...alertData
      },
      ...prev
    ]);
  };

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isActive: false } : a));
  };

  // Complaints Actions
  const addComplaint = (complaintData) => {
    setComplaints(prev => [
      {
        id: `comp-${Date.now()}`,
        reportedAt: new Date().toISOString(),
        status: 'Pending',
        ...complaintData
      },
      ...prev
    ]);
  };

  const updateComplaintStatus = (id, status, department, resolutionNotes = '') => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          department,
          resolutionNotes: status === 'Resolved' ? resolutionNotes : c.resolutionNotes
        };
      }
      return c;
    }));
  };

  // Maintenance Actions
  const addMaintenance = (maintData) => {
    setMaintenance(prev => [
      {
        id: `maint-${Date.now()}`,
        status: 'Pending',
        reportedDate: new Date().toISOString().split('T')[0],
        ...maintData
      },
      ...prev
    ]);
  };

  const updateMaintenanceStatus = (id, status) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === id) {
        const completedDate = status === 'Completed' ? new Date().toISOString().split('T')[0] : undefined;
        // If completed, append to tourist place's maintenance history
        if (status === 'Completed' && m.destinationId) {
          setPlaces(prevPlaces => prevPlaces.map(p => {
            if (p.id === m.destinationId) {
              const updatedHistory = [
                { date: completedDate, task: m.item, status: 'Completed' },
                ...(p.maintenanceHistory || [])
              ];
              return { ...p, maintenanceHistory: updatedHistory };
            }
            return p;
          }));
        }
        return { ...m, status, completedDate };
      }
      return m;
    }));
  };

  return (
    <DashboardContext.Provider
      value={{
        places,
        businesses,
        alerts,
        complaints,
        maintenance,
        activeTab,
        setActiveTab,
        selectedPlaceId,
        setSelectedPlaceId,
        isLoggedIn,
        loginUser,
        logoutUser,
        addPlace,
        editPlace,
        deletePlace,
        togglePlaceStatus,
        updateBusinessVerification,
        addAlert,
        resolveAlert,
        addComplaint,
        updateComplaintStatus,
        addMaintenance,
        updateMaintenanceStatus
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
