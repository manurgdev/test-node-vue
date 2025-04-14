const express = require('express')
const router = express.Router()
const Item = require('../models/Item')
const mongoose = require('mongoose')

// Middleware de conexión a MongoDB
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Base de datos no disponible',
      details: 'La conexión a MongoDB no está activa. Verifica la configuración en el archivo .env'
    })
  }
  next()
}

router.use(checkDbConnection)

router.get('/', async (req, res) => {
  try {
    const items = await Item.find()
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const newItem = new Item(req.body)
    const savedItem = await newItem.save()
    res.status(201).json(savedItem)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    )
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item no encontrado' })
    }
    res.json(updatedItem)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id)
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item no encontrado' })
    }
    res.json({ message: 'Item eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router 