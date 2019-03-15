const express = require('express')
const dataController = require('../controllers/data')

const router = express.Router()

// GET /data/merge
router.get(
  '/merge', 
  dataController.mergeJsonFiles
)

// POST /data/push
router.post(
  '/push', 
  dataController.pushToServer
)

// GET /data/read
router.get(
  '/read/:fileName', 
  dataController.readSavedJson
)

// GET /data/master
router.get(
  '/master',
  dataController.getMasterFile
)

router.delete(
  '/master',
  dataController.deleteMasterFile
)

module.exports = router;
