var sanitarios = [
    { 'id': 1, 'nombre': 'Alex',   'apellidos': 'Apolo',   'usuario': 'aa', 'password': 'aa*pass' },
    { 'id': 2, 'nombre': 'Daniel', 'apellidos': 'Davila',  'usuario': 'dd', 'password': 'dd*pass' },
    { 'id': 3, 'nombre': 'Manuel', 'apellidos': 'Campos',  'usuario': 'mc', 'password': 'mc*pass' },
    { 'id': 4, 'nombre': 'Ana',    'apellidos': 'López',   'usuario': 'al', 'password': 'al*pass' },
    { 'id': 5, 'nombre': 'Sergio', 'apellidos': 'Delgado', 'usuario': 'sd', 'password': 'sd*pass' }
];

var gestores = [
    { 'id': 1, 'nombre': 'Naroa',     'apellidos': 'Erviti',  'usuario': 'ne', 'password': 'ne*pass' },
    { 'id': 2, 'nombre': 'Guillermo', 'apellidos': 'Diaz',    'usuario': 'gd', 'password': 'gd*pass' },
    { 'id': 3, 'nombre': 'Daniel',    'apellidos': 'Sánchez', 'usuario': 'ds', 'password': 'ds*pass' },
    { 'id': 4, 'nombre': 'Lucia',     'apellidos': 'Selles',  'usuario': 'ls', 'password': 'ls*pass' }
];

var ubicaciones = [
    { 'id': 1, 'nombre': 'Salas' },
    { 'id': 2, 'nombre': 'Almacenes' },
    { 'id': 3, 'nombre': 'Laboratorios' },
    { 'id': 4, 'nombre': 'UCI' }
];

var categorias = [
    { 'id': 1,  'nombre': 'Termómetros' },
    { 'id': 2,  'nombre': 'Estetoscopios' },
    { 'id': 3,  'nombre': 'Sillas de ruedas' },
    { 'id': 4,  'nombre': 'Camas hospitalarias' },
    { 'id': 5,  'nombre': 'Monitores de constantes vitales' },
    { 'id': 6,  'nombre': 'Respiradores' },
    { 'id': 7,  'nombre': 'Bombas de infusión' },
    { 'id': 8,  'nombre': 'Equipos de imagen médica' },
    { 'id': 9,  'nombre': 'Instrumental quirúrgico' },
    { 'id': 10, 'nombre': 'Material de laboratorio' }
];

var modelos = [
    { 'id': 1,  'nombre': 'Termómetro digital Omron MC-246',              'categoria': 1,  'horas_maximas': 24 },
    { 'id': 2,  'nombre': 'Termómetro infrarrojo Braun ThermoScan 7',     'categoria': 1,  'horas_maximas': 24 },
    { 'id': 3,  'nombre': 'Estetoscopio Littmann Classic III',             'categoria': 2,  'horas_maximas': 12 },
    { 'id': 4,  'nombre': 'Estetoscopio Littmann Cardiology IV',           'categoria': 2,  'horas_maximas': 12 },
    { 'id': 5,  'nombre': 'Silla de ruedas Invacare Action 3',             'categoria': 3,  'horas_maximas': 72 },
    { 'id': 6,  'nombre': 'Silla de ruedas Breezy RubiX',                 'categoria': 3,  'horas_maximas': 72 },
    { 'id': 7,  'nombre': 'Cama hospitalaria Hillrom VersaCare',           'categoria': 4,  'horas_maximas': 168 },
    { 'id': 8,  'nombre': 'Cama hospitalaria Stryker InTouch',             'categoria': 4,  'horas_maximas': 168 },
    { 'id': 9,  'nombre': 'Monitor Philips IntelliVue MX700',              'categoria': 5,  'horas_maximas': 24 },
    { 'id': 10, 'nombre': 'Monitor GE Healthcare CARESCAPE B450',          'categoria': 5,  'horas_maximas': 24 },
    { 'id': 11, 'nombre': 'Respirador Dräger Evita Infinity V500',         'categoria': 6,  'horas_maximas': 48 },
    { 'id': 12, 'nombre': 'Respirador Hamilton C6',                        'categoria': 6,  'horas_maximas': 48 },
    { 'id': 13, 'nombre': 'Bomba de infusión Baxter Sigma Spectrum',       'categoria': 7,  'horas_maximas': 24 },
    { 'id': 14, 'nombre': 'Bomba de infusión Fresenius Kabi Agilia',       'categoria': 7,  'horas_maximas': 24 },
    { 'id': 15, 'nombre': 'Equipo de rayos X Siemens Multix Impact',       'categoria': 8,  'horas_maximas': 8 },
    { 'id': 16, 'nombre': 'Ecógrafo GE Logiq P9',                          'categoria': 8,  'horas_maximas': 8 },
    { 'id': 17, 'nombre': 'Set quirúrgico Aesculap estándar',              'categoria': 9,  'horas_maximas': 6 },
    { 'id': 18, 'nombre': 'Set laparoscopia Karl Storz',                   'categoria': 9,  'horas_maximas': 6 },
    { 'id': 19, 'nombre': 'Analizador bioquímico Roche Cobas c311',        'categoria': 10, 'horas_maximas': 12 },
    { 'id': 20, 'nombre': 'Centrífuga Eppendorf 5810R',                    'categoria': 10, 'horas_maximas': 12 }
];

var recurso = [
    { 'id': 1,  'modelo': 1,  'ubicacion': 1, 'numero_serie': 'OMR-2023-0001', 'estado': 0 },
    { 'id': 2,  'modelo': 1,  'ubicacion': 2, 'numero_serie': 'OMR-2023-0002', 'estado': 0 },
    { 'id': 3,  'modelo': 3,  'ubicacion': 1, 'numero_serie': 'LTM-CL3-3342',  'estado': 0 },  
    { 'id': 4,  'modelo': 4,  'ubicacion': 2, 'numero_serie': 'LTM-CIV-2211',  'estado': 2 },  
    { 'id': 5,  'modelo': 5,  'ubicacion': 3, 'numero_serie': 'INV-ACT3-8812', 'estado': 0 },
    { 'id': 6,  'modelo': 6,  'ubicacion': 4, 'numero_serie': 'BRZ-RBX-1129',  'estado': 1 },  
    { 'id': 7,  'modelo': 11, 'ubicacion': 3, 'numero_serie': 'DRG-V500-9001', 'estado': 0 },
    { 'id': 8,  'modelo': 12, 'ubicacion': 3, 'numero_serie': 'HAM-C6-4410',   'estado': 0 },
    { 'id': 9,  'modelo': 15, 'ubicacion': 1, 'numero_serie': 'SIE-RX-7721',   'estado': 0 },  
    { 'id': 10, 'modelo': 19, 'ubicacion': 4, 'numero_serie': 'RCH-C311-5533', 'estado': 2 }
];

var reservas = [
    {
        'id': 1,
        'recurso': 7,
        'sanitario': 1,
        'horas_estimadas': 12,
        'fecha_peticion': new Date('2026-02-09T08:30:00Z'),
        'fecha_inicio':   new Date('2026-02-09T09:00:00Z'),
        'fecha_fin': null
    },
    {
        'id': 2,
        'recurso': 9,
        'sanitario': 2,
        'horas_estimadas': 4,
        'fecha_peticion': new Date('2026-02-08T10:00:00Z'),
        'fecha_inicio':   new Date('2026-02-08T11:00:00Z'),
        'fecha_fin':      new Date('2026-02-08T15:00:00Z')
    },
    {
        'id': 3,
        'recurso': 3,
        'sanitario': 3,
        'horas_estimadas': 2,
        'fecha_peticion': new Date('2026-02-09T07:15:00Z'),
        'fecha_inicio': null,
        'fecha_fin': null
    },
    {
        'id': 4,
        'recurso': 8,
        'sanitario': 4,
        'horas_estimadas': 24,
        'fecha_peticion': new Date('2026-02-07T22:00:00Z'),
        'fecha_inicio':   new Date('2026-02-07T23:00:00Z'),
        'fecha_fin': null
    }
];

var resenyas = [
    {
        'id': 1,
        'recurso': 6,
        'sanitario': 5,
        'fecha': new Date('2026-02-09'),
        'valor': 4,
        'descripcion': 'Un artículo muy interesante, a pesar de la mala fama de la marca.'
    },
    {
        'id': 2,
        'recurso': 9,
        'sanitario': 1,
        'fecha': new Date('2026-02-11'),
        'valor': 2,
        'descripcion': 'Este equipo de rayos X no está funcionando correctamente. No se ajusta el voltaje y tiene ruidos extraños.'
    }
];

module.exports.san   = sanitarios;
module.exports.ges   = gestores;
module.exports.ubi   = ubicaciones;
module.exports.cat   = categorias;
module.exports.mod   = modelos;
module.exports.rec   = recurso;
module.exports.reserv  = reservas;
module.exports.reseny  = resenyas;