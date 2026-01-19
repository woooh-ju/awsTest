const express = require('express');
const router = express.Router();
const seminarController = require('../controllers/seminarController');

// 모든 세미나 조회
router.get('/', seminarController.getAllSeminars);

// 특정 세미나 조회
router.get('/:id', seminarController.getSeminarById);

// 새로운 세미나 추가
router.post('/', seminarController.createSeminar);

// 세미나 정보 수정
router.put('/:id', seminarController.updateSeminar);

// 세미나 삭제
router.delete('/:id', seminarController.deleteSeminar);

module.exports = router;
