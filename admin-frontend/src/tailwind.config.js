// tailwind.config.js
module.exports = {
    theme: {
      extend: {
        colors: {
          neutral: {
            600: '#111112',
            500: '#1A1A1C',
            450: '#302E31',
            400: '#232325',
            300: '#5A5A5C',
            200: '#909091',
            150: '#BFBFBB',
            100: '#E9E9EA',
          },
          primary: {
            300: '#1D4780',
            200: '#275FEB',
            100: '#5D87FF',
          },
          states: {
            overdue: '#D40000', 
            error: '#CC0202', 
            completed: '#287475', 
            ok: '#4CAF50', 
            scheduled: '#007BFF', 
            inProgress: '#17A2B8', 
            upcoming: '#FFB400', 
            canceled: '#6C757D', 
           
          },
        },
      },
    },
  };