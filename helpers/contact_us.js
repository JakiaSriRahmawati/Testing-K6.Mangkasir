export function createPayload() {
    return JSON.stringify({
      name: 'hady',
      businessName: 'peralatan dapur',
      message: 'Alat alat untuk di dapur.',
      email: 'hady@example.com',
    });
  }
  
  export function checkResponse(res) {
    return {
      'status is 200': (r) => r.status === 200,
      'response has success message': (r) => {
        const responseBody = JSON.parse(r.body);
        return responseBody.message && responseBody.message.trim() === 'Data terkirim';
      },
    };
  }
  