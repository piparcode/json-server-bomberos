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

// ==================== ENDPOINT DE LOGIN DE CLIENTES ====================
server.post('/api/auth', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  // Buscar cliente por email (case insensitive)
  const client = db.get('clientes').find(c => c.email && c.email.toLowerCase() === email.toLowerCase()).value();
  if (client && client.password === password) {
    const token = 'mock-token-' + Math.random().toString(36).substring(2, 18);
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      client: {
        id: client.id || client.client_id,
        legal_representative: client.legal_representative,
        email: client.email
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas. Verifica email y contraseña.'
    });
  }
});

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

// ==================== ENDPOINTS BÁSICOS PARA requestRisk ====================
// Obtener todas las solicitudes de riesgo por client_id
server.get('/api/requestRisk/client/:client_id', (req, res) => {
  const db = router.db;
  const client_id = req.params.client_id;
  // Filtrar usando función para evitar problemas de tipo o espacios
  const requests = db.get('requestRisk')
    .filter(r => r.client_id && r.client_id.toString().trim() === client_id.toString().trim())
    .value();
  res.status(200).json({
    success: true,
    data: requests,
    total: requests.length,
    message: requests.length > 0
      ? 'Solicitudes de riesgo para el cliente obtenidas exitosamente'
      : 'No existen solicitudes de riesgo para el cliente'
  });
});

// Obtener todas las solicitudes de riesgo
server.get('/api/requestRisk', (req, res) => {
  const db = router.db;
  const requests = db.get('requestRisk').value();
  res.json({
    success: true,
    data: requests,
    total: requests.length,
    message: 'Solicitudes de riesgo obtenidas exitosamente'
  });
});

// Obtener solicitud de riesgo por ID
server.get('/api/requestRisk/:id', (req, res) => {
  const db = router.db;
  const id = req.params.id;
  const request = db.get('requestRisk').find({ id }).value();
  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Solicitud de riesgo no encontrada'
    });
  }
  res.json({
    success: true,
    data: request,
    message: 'Solicitud de riesgo encontrada'
  });
});

// Actualizar solicitud de riesgo completa (PUT)
server.put('/api/requestRisk/:id', (req, res) => {
  const db = router.db;
  const id = req.params.id;
  const updates = req.body;
  const request = db.get('requestRisk').find({ id }).value();
  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Solicitud de riesgo no encontrada'
    });
  }
  const updatedRequest = db.get('requestRisk')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedRequest,
    message: 'Solicitud de riesgo actualizada exitosamente'
  });
});

// Editar solicitud de riesgo parcialmente (PATCH)
server.patch('/api/requestRisk/:id', (req, res) => {
  const db = router.db;
  const id = req.params.id;
  const updates = req.body;
  const request = db.get('requestRisk').find({ id }).value();
  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Solicitud de riesgo no encontrada'
    });
  }
  const updatedRequest = db.get('requestRisk')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedRequest,
    message: 'Solicitud de riesgo editada exitosamente'
  });
});

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

// ==================== ENDPOINTS BÁSICOS PARA MUNICIPALITIES ====================

// Obtener todos los municipios
server.get('/api/municipalities', (req, res) => {
  const db = router.db;
  const municipalities = db.get('municipalities').value();
  res.json({
    success: true,
    data: municipalities,
    total: municipalities.length,
    message: 'Municipios obtenidos exitosamente'
  });
});

// Obtener municipio por ID
server.get('/api/municipalities/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const municipality = db.get('municipalities').find({ id }).value();
  if (!municipality) {
    return res.status(404).json({
      success: false,
      message: 'Municipio no encontrado'
    });
  }
  res.json({
    success: true,
    data: municipality,
    message: 'Municipio encontrado'
  });
});

// Actualizar municipio completo (PUT)
server.put('/api/municipalities/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const municipality = db.get('municipalities').find({ id }).value();
  if (!municipality) {
    return res.status(404).json({
      success: false,
      message: 'Municipio no encontrado'
    });
  }
  const updatedMunicipality = db.get('municipalities')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedMunicipality,
    message: 'Municipio actualizado exitosamente'
  });
});

// Editar municipio parcialmente (PATCH)
server.patch('/api/municipalities/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const municipality = db.get('municipalities').find({ id }).value();
  if (!municipality) {
    return res.status(404).json({
      success: false,
      message: 'Municipio no encontrado'
    });
  }
  const updatedMunicipality = db.get('municipalities')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedMunicipality,
    message: 'Municipio editado exitosamente'
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

// ==================== ENDPOINTS BÁSICOS PARA UNITTERRITORIALS ====================

// Obtener todas las unidades territoriales
server.get('/api/unitTerritorials', (req, res) => {
  const db = router.db;
  const unitTerritorials = db.get('unitTerritorials').value();
  res.json({
    success: true,
    data: unitTerritorials,
    total: unitTerritorials.length,
    message: 'Unidades territoriales obtenidas exitosamente'
  });
});

// Obtener unidad territorial por ID
server.get('/api/unitTerritorials/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const unitTerritorial = db.get('unitTerritorials').find({ id }).value();
  if (!unitTerritorial) {
    return res.status(404).json({
      success: false,
      message: 'Unidad territorial no encontrada'
    });
  }
  res.json({
    success: true,
    data: unitTerritorial,
    message: 'Unidad territorial encontrada'
  });
});

// Actualizar unidad territorial completa (PUT)
server.put('/api/unitTerritorials/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const unitTerritorial = db.get('unitTerritorials').find({ id }).value();
  if (!unitTerritorial) {
    return res.status(404).json({
      success: false,
      message: 'Unidad territorial no encontrada'
    });
  }
  const updatedUnitTerritorial = db.get('unitTerritorials')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedUnitTerritorial,
    message: 'Unidad territorial actualizada exitosamente'
  });
});

// Editar unidad territorial parcialmente (PATCH)
server.patch('/api/unitTerritorials/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const unitTerritorial = db.get('unitTerritorials').find({ id }).value();
  if (!unitTerritorial) {
    return res.status(404).json({
      success: false,
      message: 'Unidad territorial no encontrada'
    });
  }
  const updatedUnitTerritorial = db.get('unitTerritorials')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedUnitTerritorial,
    message: 'Unidad territorial editada exitosamente'
  });
});

// ==================== ENDPOINTS BÁSICOS PARA UNITTYPES ====================

// Obtener todos los tipos de unidad
server.get('/api/unitTypes', (req, res) => {
  const db = router.db;
  const unitTypes = db.get('unitTypes').value();
  res.json({
    success: true,
    data: unitTypes,
    total: unitTypes.length,
    message: 'Tipos de unidad obtenidos exitosamente'
  });
});

// Obtener tipo de unidad por ID
server.get('/api/unitTypes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const unitType = db.get('unitTypes').find({ id }).value();
  if (!unitType) {
    return res.status(404).json({
      success: false,
      message: 'Tipo de unidad no encontrado'
    });
  }
  res.json({
    success: true,
    data: unitType,
    message: 'Tipo de unidad encontrado'
  });
});

// Actualizar tipo de unidad completo (PUT)
server.put('/api/unitTypes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const unitType = db.get('unitTypes').find({ id }).value();
  if (!unitType) {
    return res.status(404).json({
      success: false,
      message: 'Tipo de unidad no encontrado'
    });
  }
  const updatedUnitType = db.get('unitTypes')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedUnitType,
    message: 'Tipo de unidad actualizado exitosamente'
  });
});

// Editar tipo de unidad parcialmente (PATCH)
server.patch('/api/unitTypes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const unitType = db.get('unitTypes').find({ id }).value();
  if (!unitType) {
    return res.status(404).json({
      success: false,
      message: 'Tipo de unidad no encontrado'
    });
  }
  const updatedUnitType = db.get('unitTypes')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedUnitType,
    message: 'Tipo de unidad editado exitosamente'
  });
});

// ==================== ENDPOINTS BÁSICOS PARA SECTORES ====================

// Obtener todos los sectores
server.get('/api/sectores', (req, res) => {
  const db = router.db;
  const sectores = db.get('sectores').value();
  res.json({
    success: true,
    data: sectores,
    total: sectores.length,
    message: 'Sectores obtenidos exitosamente'
  });
});

// Obtener sector por ID
server.get('/api/sectores/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const sector = db.get('sectores').find({ id }).value();
  if (!sector) {
    return res.status(404).json({
      success: false,
      message: 'Sector no encontrado'
    });
  }
  res.json({
    success: true,
    data: sector,
    message: 'Sector encontrado'
  });
});

// Actualizar sector completo (PUT)
server.put('/api/sectores/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const sector = db.get('sectores').find({ id }).value();
  if (!sector) {
    return res.status(404).json({
      success: false,
      message: 'Sector no encontrado'
    });
  }
  const updatedSector = db.get('sectores')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedSector,
    message: 'Sector actualizado exitosamente'
  });
});

// Editar sector parcialmente (PATCH)
server.patch('/api/sectores/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const sector = db.get('sectores').find({ id }).value();
  if (!sector) {
    return res.status(404).json({
      success: false,
      message: 'Sector no encontrado'
    });
  }
  const updatedSector = db.get('sectores')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedSector,
    message: 'Sector editado exitosamente'
  });
});

// ==================== ENDPOINTS BÁSICOS PARA SECTORTYPES ====================

// Obtener todos los tipos de sector
server.get('/api/sectorTypes', (req, res) => {
  const db = router.db;
  const sectorTypes = db.get('sectorTypes').value();
  res.json({
    success: true,
    data: sectorTypes,
    total: sectorTypes.length,
    message: 'Tipos de sector obtenidos exitosamente'
  });
});

// Obtener tipo de sector por ID
server.get('/api/sectorTypes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const sectorType = db.get('sectorTypes').find({ id }).value();
  if (!sectorType) {
    return res.status(404).json({
      success: false,
      message: 'Tipo de sector no encontrado'
    });
  }
  res.json({
    success: true,
    data: sectorType,
    message: 'Tipo de sector encontrado'
  });
});

// Actualizar tipo de sector completo (PUT)
server.put('/api/sectorTypes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const sectorType = db.get('sectorTypes').find({ id }).value();
  if (!sectorType) {
    return res.status(404).json({
      success: false,
      message: 'Tipo de sector no encontrado'
    });
  }
  const updatedSectorType = db.get('sectorTypes')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedSectorType,
    message: 'Tipo de sector actualizado exitosamente'
  });
});

// Editar tipo de sector parcialmente (PATCH)
server.patch('/api/sectorTypes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const sectorType = db.get('sectorTypes').find({ id }).value();
  if (!sectorType) {
    return res.status(404).json({
      success: false,
      message: 'Tipo de sector no encontrado'
    });
  }
  const updatedSectorType = db.get('sectorTypes')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedSectorType,
    message: 'Tipo de sector editado exitosamente'
  });
});

// ==================== ENDPOINTS BÁSICOS PARA ZONETYPES ====================

// Obtener todos los tipos de zona
server.get('/api/zoneTypes', (req, res) => {
  const db = router.db;
  const zoneTypes = db.get('zoneTypes').value();
  res.json({
    success: true,
    data: zoneTypes,
    total: zoneTypes.length,
    message: 'Tipos de zona obtenidos exitosamente'
  });
});

// Obtener tipo de zona por ID
server.get('/api/zoneTypes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const zoneType = db.get('zoneTypes').find({ id }).value();
  if (!zoneType) {
    return res.status(404).json({
      success: false,
      message: 'Tipo de zona no encontrado'
    });
  }
  res.json({
    success: true,
    data: zoneType,
    message: 'Tipo de zona encontrado'
  });
});

// Actualizar tipo de zona completo (PUT)
server.put('/api/zoneTypes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const zoneType = db.get('zoneTypes').find({ id }).value();
  if (!zoneType) {
    return res.status(404).json({
      success: false,
      message: 'Tipo de zona no encontrado'
    });
  }
  const updatedZoneType = db.get('zoneTypes')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedZoneType,
    message: 'Tipo de zona actualizado exitosamente'
  });
});

// Editar tipo de zona parcialmente (PATCH)
server.patch('/api/zoneTypes/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const zoneType = db.get('zoneTypes').find({ id }).value();
  if (!zoneType) {
    return res.status(404).json({
      success: false,
      message: 'Tipo de zona no encontrado'
    });
  }
  const updatedZoneType = db.get('zoneTypes')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedZoneType,
    message: 'Tipo de zona editado exitosamente'
  });
});

// ==================== ENDPOINTS BÁSICOS PARA MACHINES ====================

// Obtener todas las máquinas
server.get('/api/machines', (req, res) => {
  const db = router.db;
  const machines = db.get('machines').value();
  res.json({
    success: true,
    data: machines,
    total: machines.length,
    message: 'Máquinas obtenidas exitosamente'
  });
});

// Obtener máquina por ID
server.get('/api/machines/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const machine = db.get('machines').find({ id }).value();
  if (!machine) {
    return res.status(404).json({
      success: false,
      message: 'Máquina no encontrada'
    });
  }
  res.json({
    success: true,
    data: machine,
    message: 'Máquina encontrada exitosamente'
  });
});

// Actualizar máquina completa (PUT)
server.put('/api/machines/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const machine = db.get('machines').find({ id }).value();
  if (!machine) {
    return res.status(404).json({
      success: false,
      message: 'Máquina no encontrada'
    });
  }
  const updatedMachine = db.get('machines')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedMachine,
    message: 'Máquina actualizada exitosamente'
  });
});

// Editar máquina parcialmente (PATCH)
server.patch('/api/machines/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const updates = req.body;
  const machine = db.get('machines').find({ id }).value();
  if (!machine) {
    return res.status(404).json({
      success: false,
      message: 'Máquina no encontrada'
    });
  }
  const updatedMachine = db.get('machines')
    .find({ id })
    .assign(updates)
    .write();
  res.json({
    success: true,
    data: updatedMachine,
    message: 'Máquina editada exitosamente'
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
  console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
});

module.exports = server;
