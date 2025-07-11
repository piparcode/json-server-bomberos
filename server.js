const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middleware para CORS personalizado
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Usar middlewares por defecto
server.use(middlewares);

// Middleware para parsear JSON
server.use(jsonServer.bodyParser);

// ==================== ENDPOINTS BÁSICOS PARA HYDRANTS ====================

// Endpoint: Obtener todos los hidrantes
server.get('/api/hydrants', (req, res) => {
  const db = router.db;
  const hydrants = db.get('hydrants').value();
  
  res.json({
    success: true,
    data: hydrants,
    total: hydrants.length,
    message: 'Hidrantes obtenidos exitosamente'
  });
});

// Endpoint: Obtener hidrante por ID
server.get('/api/hydrants/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const hydrant = db.get('hydrants').find({ id }).value();
  
  if (!hydrant) {
    return res.status(404).json({
      success: false,
      message: 'Hidrante no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: hydrant,
    message: 'Hidrante encontrado'
  });
});

// Endpoint: Actualizar hidrante completo (PUT)
server.put('/api/hydrants/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const hydrant = db.get('hydrants').find({ id }).value();
  
  if (!hydrant) {
    return res.status(404).json({
      success: false,
      message: 'Hidrante no encontrado'
    });
  }
  
  const updatedHydrant = db.get('hydrants')
    .find({ id })
    .assign(updates)
    .write();
  
  res.json({
    success: true,
    data: updatedHydrant,
    message: 'Hidrante actualizado exitosamente'
  });
});

// Endpoint: Editar hidrante parcialmente (PATCH)
server.patch('/api/hydrants/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const hydrant = db.get('hydrants').find({ id }).value();
  
  if (!hydrant) {
    return res.status(404).json({
      success: false,
      message: 'Hidrante no encontrado'
    });
  }
  
  const updatedHydrant = db.get('hydrants')
    .find({ id })
    .assign(updates)
    .write();
  
  res.json({
    success: true,
    data: updatedHydrant,
    message: 'Hidrante editado exitosamente'
  });
});

// ==================== ENDPOINTS BÁSICOS PARA EMERGENCIES ====================

// Endpoint: Obtener todas las emergencias
server.get('/api/emergencies', (req, res) => {
  const db = router.db;
  const emergencies = db.get('emergencies').value();
  
  res.json({
    success: true,
    data: emergencies,
    total: emergencies.length,
    message: 'Emergencias obtenidas exitosamente'
  });
});

// Endpoint: Obtener emergencia por ID
server.get('/api/emergencies/:id', (req, res) => {
  const db = router.db;
  const id = req.params.id;
  const emergency = db.get('emergencies').find({ id }).value();
  
  if (!emergency) {
    return res.status(404).json({
      success: false,
      message: 'Emergencia no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: emergency,
    message: 'Emergencia encontrada'
  });
});

// Endpoint: Actualizar emergencia completa (PUT)
server.put('/api/emergencies/:id', (req, res) => {
  const db = router.db;
  const id = req.params.id;
  const updates = req.body;
  
  const emergency = db.get('emergencies').find({ id }).value();
  
  if (!emergency) {
    return res.status(404).json({
      success: false,
      message: 'Emergencia no encontrada'
    });
  }
  
  const updatedEmergency = db.get('emergencies')
    .find({ id })
    .assign(updates)
    .write();
  
  res.json({
    success: true,
    data: updatedEmergency,
    message: 'Emergencia actualizada exitosamente'
  });
});

// Endpoint: Editar emergencia parcialmente (PATCH)
server.patch('/api/emergencies/:id', (req, res) => {
  const db = router.db;
  const id = req.params.id;
  const updates = req.body;
  
  const emergency = db.get('emergencies').find({ id }).value();
  
  if (!emergency) {
    return res.status(404).json({
      success: false,
      message: 'Emergencia no encontrada'
    });
  }
  
  const updatedEmergency = db.get('emergencies')
    .find({ id })
    .assign(updates)
    .write();
  
  res.json({
    success: true,
    data: updatedEmergency,
    message: 'Emergencia editada exitosamente'
  });
});

// ==================== ENDPOINTS BÁSICOS PARA DEPARTAMENTS ====================

// Obtener todos los departamentos
server.get('/api/departaments', (req, res) => {
  const db = router.db;
  const departaments = db.get('departaments').value();
  res.json({
    success: true,
    data: departaments,
    total: departaments.length,
    message: 'Departamentos obtenidos exitosamente'
  });
});

// Obtener departamento por ID
server.get('/api/departaments/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const departament = db.get('departaments').find({ id }).value();
  if (!departament) {
    return res.status(404).json({
      success: false,
      message: 'Departamento no encontrado'
    });
  }
  res.json({
    success: true,
    data: departament,
    message: 'Departamento encontrado'
  });
});

// Actualizar departamento completo (PUT)
server.put('/api/departaments/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const departament = db.get('departaments').find({ id }).value();
  if (!departament) {
    return res.status(404).json({
      success: false,
      message: 'Departamento no encontrado'
    });
  }
  const updatedDepartament = db.get('departaments')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedDepartament,
    message: 'Departamento actualizado exitosamente'
  });
});

// Editar departamento parcialmente (PATCH)
server.patch('/api/departaments/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const departament = db.get('departaments').find({ id }).value();
  if (!departament) {
    return res.status(404).json({
      success: false,
      message: 'Departamento no encontrado'
    });
  }
  const updatedDepartament = db.get('departaments')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedDepartament,
    message: 'Departamento editado exitosamente'
  });
});

// ==================== ENDPOINT PARA EMERGENCY (OBJETO ÚNICO) ====================

// Obtener el objeto emergency único
server.get('/api/emergency', (req, res) => {
  const db = router.db;
  const emergency = db.get('emergency').value();
  if (!emergency) {
    return res.status(404).json({
      success: false,
      message: 'Objeto emergency no encontrado'
    });
  }
  res.json({
    success: true,
    data: emergency,
    message: 'Objeto emergency obtenido exitosamente'
  });
});

// Endpoint de información de la API
server.get('/api/info', (req, res) => {
  res.json({
    success: true,
    data: {
      nombre: 'API Sistema de Bomberos - Hydrants & Emergencies',
      version: '1.0.0',
      descripcion: 'API básica para gestión de hidrantes y emergencias',
      endpoints: [
        'GET /api/hydrants - Obtener todos los hidrantes',
        'GET /api/hydrants/:id - Obtener hidrante por ID',
        'PUT /api/hydrants/:id - Actualizar hidrante completo',
        'PATCH /api/hydrants/:id - Editar hidrante parcialmente',
        'GET /api/emergencies - Obtener todas las emergencias',
        'GET /api/emergencies/:id - Obtener emergencia por ID',
        'PUT /api/emergencies/:id - Actualizar emergencia completa',
        'PATCH /api/emergencies/:id - Editar emergencia parcialmente',
        'GET /api/departaments - Obtener todos los departamentos',
        'GET /api/departaments/:id - Obtener departamento por ID',
        'PUT /api/departaments/:id - Actualizar departamento completo',
        'PATCH /api/departaments/:id - Editar departamento parcialmente',
        'GET /api/emergency - Obtener objeto emergency único'
      ]
    },
    message: 'API funcionando correctamente'
  });
});

// Usar el router de json-server para endpoints adicionales (opcional)
server.use('/hydrants', router);
server.use('/emergencies', router);

// Manejo de errores
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log('🚒 ===============================================');
  console.log('   API SISTEMA DE BOMBEROS - HYDRANTS & EMERGENCIES');
  console.log('🚒 ===============================================');
  console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Endpoints de Hidrantes:');
  console.log(`   GET    http://localhost:${PORT}/api/hydrants`);
  console.log(`   GET    http://localhost:${PORT}/api/hydrants/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/hydrants/:id`);
  console.log(`   PATCH  http://localhost:${PORT}/api/hydrants/:id`);
  console.log('');
  console.log('🚨 Endpoints de Emergencias:');
  console.log(`   GET    http://localhost:${PORT}/api/emergencies`);
  console.log(`   GET    http://localhost:${PORT}/api/emergencies/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/emergencies/:id`);
  console.log(`   PATCH  http://localhost:${PORT}/api/emergencies/:id`);
  console.log('');
  console.log('🏢 Endpoints de Departamentos:');
  console.log(`   GET    http://localhost:${PORT}/api/departaments`);
  console.log(`   GET    http://localhost:${PORT}/api/departaments/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/departaments/:id`);
  console.log(`   PATCH  http://localhost:${PORT}/api/departaments/:id`);
  console.log('');
  console.log('📖 Documentación: http://localhost:' + PORT + '/api/info');
  console.log('🔥 Presiona Ctrl+C para detener el servidor');
  console.log('===============================================');
});

module.exports = server;
