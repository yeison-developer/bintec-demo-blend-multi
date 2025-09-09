const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

interface UserData {
  name: string;
  email: string;
  position: string;
}

export const sendEmail = async (userData: UserData, question: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        question: question,
        reportData: {}
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const generatePDF = async (userData: UserData, question: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        position: userData.position,
        question: question
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const analyzeWithBedrock = async (userData: UserData, question: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/bedrock-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        userData: userData
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error with Bedrock analysis:', error);
    throw error;
  }
};

export const orchestrateAgents = async (userData: UserData, question: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/agent-orchestrator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userData,
        question
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error orchestrating agents:', error);
    throw error;
  }
};

export const invokeAgent = async (agentType: string, userData: UserData, question: string) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/agent-${agentType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userData,
        question
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error(`Error invoking ${agentType} agent:`, error);
    throw error;
  }
};