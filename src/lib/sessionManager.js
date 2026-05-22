const SESSION_KEY = 'quotation_session_id';

export const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

export const getSessionId = () => localStorage.getItem(SESSION_KEY);
