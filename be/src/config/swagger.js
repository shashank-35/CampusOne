const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CampusOne API',
      version: '1.0.0',
      description: 'CampusOne Backend API - Campus Management System',
    },
    servers: [
      { url: '/api', description: 'API server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            mobileNumber: { type: 'string' },
            addressLine1: { type: 'string' },
            addressLine2: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            pincode: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'head', 'staff', 'student'] },
            status: { type: 'string', enum: ['active', 'inactive'] },
          },
        },
        Student: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            mobileNumber: { type: 'string' },
            address: { type: 'string' },
            landmark: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            pincode: { type: 'string' },
            background: { type: 'string', enum: ['tech', 'non-tech'] },
            educationList: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  qualification: { type: 'string' },
                  stream: { type: 'string' },
                  year: { type: 'string' },
                },
              },
            },
            parentName: { type: 'string' },
            parentPhone: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
          },
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            duration: { type: 'string' },
            fees: { type: 'string' },
            handbook: { type: 'string' },
            topicSheet: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'draft'] },
          },
        },
        Event: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            detail: { type: 'string' },
            host: { type: 'string' },
            coordinator: { type: 'string' },
            date: { type: 'string', format: 'date' },
            timing: { type: 'string' },
            place: { type: 'string' },
            type: { type: 'string', enum: ['seminar', 'workshop', 'webinar', 'cultural', 'sports'] },
            description: { type: 'string' },
            locationLink: { type: 'string' },
            status: { type: 'string', enum: ['upcoming', 'ongoing', 'completed', 'cancelled'] },
          },
        },
        Inquiry: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            sourceOfInquiry: { type: 'string', enum: ['website', 'reference', 'social'] },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            mobile: { type: 'string' },
            addressLine1: { type: 'string' },
            addressLine2: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            pincode: { type: 'string' },
            techBackground: { type: 'string', enum: ['tech', 'non-tech'] },
            qualification: { type: 'string' },
            specialization: { type: 'string' },
            passingYear: { type: 'string' },
            interestedArea: { type: 'string' },
            assignTo: { type: 'string' },
            status: { type: 'string', enum: ['new', 'contacted', 'resolved', 'closed'] },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            productName: { type: 'string' },
            receiveCount: { type: 'number' },
            missing: { type: 'number' },
            availableCount: { type: 'number' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['in-stock', 'low-stock', 'out-of-stock'] },
          },
        },
        Todo: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            todo: { type: 'string' },
            important: { type: 'boolean' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            category: { type: 'string', enum: ['work', 'personal', 'study'] },
            status: { type: 'string', enum: ['pending', 'completed'] },
            user: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
