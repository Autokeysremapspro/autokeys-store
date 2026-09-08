'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { generateRepairQuotePdf } = require('../lib/repair-quote-pdf');

test('genera un PDF de presupuesto con referencia, desglose y total', () => {
  const pdf = generateRepairQuotePdf({
    numero: 'REP-2026-001', nombre: 'Cliente de prueba', marca: 'Opel', modelo: 'Corsa', anio: 2018,
    tipo_unidad: 'airbag_srs', trabajo_solicitado: 'Clonación', presupuesto_total: 105,
    plazo_estimado: '3 días laborables', presupuesto_validez_dias: 15,
    presupuesto_lineas: [
      { concepto: 'Centralita de sustitución', cantidad: 1, precio_unitario: 55, total: 55 },
      { concepto: 'Clonación y comprobación', cantidad: 1, precio_unitario: 42, total: 42 },
      { concepto: 'Envío', cantidad: 1, precio_unitario: 8, total: 8 },
    ],
  });
  const raw = pdf.toString('latin1');
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.match(raw, /REP-2026-001/);
  assert.match(raw, /Centralita de sustitucion|Centralita de sustitución/);
  assert.match(raw, /105,00 EUR/);
  assert.match(raw, /startxref/);
  assert.ok(pdf.length > 1500);
});

test('crea varias páginas cuando el presupuesto tiene muchas líneas', () => {
  const pdf = generateRepairQuotePdf({
    numero: 'REP-LARGO', nombre: 'Cliente', marca: 'Audi', modelo: 'A4',
    tipo_unidad: 'ECU', trabajo_solicitado: 'Reparación', presupuesto_total: 200,
    presupuesto_lineas: Array.from({ length: 10 }, (_, index) => ({ concepto: `Concepto ${index + 1}`, cantidad: 1, precio_unitario: 20, total: 20 })),
  });
  assert.match(pdf.toString('latin1'), /\/Count 2/);
});
