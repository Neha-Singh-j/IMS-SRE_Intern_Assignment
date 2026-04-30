const API_BASE_URL = 'http://localhost:5000';

export const fetchIncidents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return await response.json();
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return { incidents: [], count: 0 };
  }
};

export const fetchIncidentSignals = async (incidentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}/signals`);
    if (!response.ok) throw new Error('Failed to fetch signals');
    return await response.json();
  } catch (error) {
    console.error('Error fetching signals:', error);
    return [];
  }
};

export const createSignal = async (signalData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signalData)
    });
    if (!response.ok) throw new Error('Failed to create signal');
    return await response.json();
  } catch (error) {
    console.error('Error creating signal:', error);
    throw error;
  }
};

export const startRCA = async (incidentId, rcaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}/rca`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rcaData)
    });
    if (!response.ok) throw new Error('Failed to start RCA');
    return await response.json();
  } catch (error) {
    console.error('Error starting RCA:', error);
    throw error;
  }
};

export const updateIncidentStatus = async (incidentId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};
