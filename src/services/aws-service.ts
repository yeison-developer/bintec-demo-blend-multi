const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const sendEmail = async (userData: any, question: string) => {
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

export const generatePDF = async (userData: any, question: string) => {
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