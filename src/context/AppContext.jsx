import { createContext, useContext, useReducer } from 'react';
import { mockFarmers, mockSoilData, mockRecommendations, mockFertilizerLogs } from '../data/mockData';

const AppContext = createContext();

const initialState = {
  user: null,
  userType: 'farmer', // 'farmer' or 'researcher'
  currentFarmer: mockFarmers[0],
  soilData: mockSoilData,
  recommendations: mockRecommendations,
  fertilizerLogs: mockFertilizerLogs,
  farmers: mockFarmers
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_USER_TYPE':
      return { ...state, userType: action.payload };
    case 'SET_CURRENT_FARMER':
      return { ...state, currentFarmer: action.payload };
    case 'ADD_FERTILIZER_LOG':
      return { 
        ...state, 
        fertilizerLogs: [...state.fertilizerLogs, action.payload] 
      };
    case 'UPDATE_SOIL_DATA':
      return { 
        ...state, 
        soilData: [...state.soilData, action.payload] 
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
