function errorHandler(err, req, res, _next) {
  console.error('[Error]', err.message);

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'El recurso ya existe' });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
  });
}

module.exports = { errorHandler };
