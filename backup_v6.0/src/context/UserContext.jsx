import { createContext, useContext } from 'react';

const userData = {
  name: '小鹿',
  xp: 340,
  level: 12,
  title: '恋爱学徒',
  streak: 23,
  achievements: 12,
  isVip: true,
};

const UserContext = createContext(userData);

export function UserProvider({ children }) {
  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
