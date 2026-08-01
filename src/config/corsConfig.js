const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Dominios autorizados de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;