const pool = require('../config/database');

// 모든 세미나 정보 조회
const getAllSeminars = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [seminars] = await connection.query(
      'SELECT * FROM seminars ORDER BY date DESC'
    );
    connection.release();

    res.status(200).json({
      success: true,
      data: seminars,
      count: seminars.length,
    });
  } catch (error) {
    console.error('Error fetching seminars:', error);
    res.status(500).json({
      success: false,
      message: '세미나 정보 조회 실패',
      error: error.message,
    });
  }
};

// 특정 세미나 정보 조회 (ID로)
const getSeminarById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [seminars] = await connection.query(
      'SELECT * FROM seminars WHERE id = ?',
      [id]
    );
    connection.release();

    if (seminars.length === 0) {
      return res.status(404).json({
        success: false,
        message: '해당 세미나를 찾을 수 없습니다.',
      });
    }

    res.status(200).json({
      success: true,
      data: seminars[0],
    });
  } catch (error) {
    console.error('Error fetching seminar:', error);
    res.status(500).json({
      success: false,
      message: '세미나 정보 조회 실패',
      error: error.message,
    });
  }
};

// 새로운 세미나 추가
const createSeminar = async (req, res) => {
  try {
    const { title, description, date, location, speaker, capacity } = req.body;

    if (!title || !description || !date || !location || !speaker) {
      return res.status(400).json({
        success: false,
        message: '필수 정보가 누락되었습니다.',
      });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO seminars (title, description, date, location, speaker, capacity, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [title, description, date, location, speaker, capacity || 100]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: '세미나가 등록되었습니다.',
      id: result.insertId,
    });
  } catch (error) {
    console.error('Error creating seminar:', error);
    res.status(500).json({
      success: false,
      message: '세미나 등록 실패',
      error: error.message,
    });
  }
};

// 세미나 정보 수정
const updateSeminar = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, speaker, capacity } = req.body;

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE seminars SET title = ?, description = ?, date = ?, location = ?, speaker = ?, capacity = ?, updated_at = NOW() WHERE id = ?',
      [title, description, date, location, speaker, capacity, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '해당 세미나를 찾을 수 없습니다.',
      });
    }

    res.status(200).json({
      success: true,
      message: '세미나 정보가 수정되었습니다.',
    });
  } catch (error) {
    console.error('Error updating seminar:', error);
    res.status(500).json({
      success: false,
      message: '세미나 수정 실패',
      error: error.message,
    });
  }
};

// 세미나 삭제
const deleteSeminar = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE FROM seminars WHERE id = ?',
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '해당 세미나를 찾을 수 없습니다.',
      });
    }

    res.status(200).json({
      success: true,
      message: '세미나가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Error deleting seminar:', error);
    res.status(500).json({
      success: false,
      message: '세미나 삭제 실패',
      error: error.message,
    });
  }
};

// 세미나 검색
const searchSeminars = async (req, res) => {
  try {
    const { keyword, speaker, location, startDate, endDate } = req.query;
    let query = 'SELECT * FROM seminars WHERE 1=1';
    let params = [];

    // 키워드 검색 (제목, 설명)
    if (keyword) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchKeyword = `%${keyword}%`;
      params.push(searchKeyword, searchKeyword);
    }

    // 강사 이름으로 검색
    if (speaker) {
      query += ' AND speaker LIKE ?';
      params.push(`%${speaker}%`);
    }

    // 장소로 검색
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    // 날짜 범위 검색
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    // 정렬
    query += ' ORDER BY date DESC';

    const connection = await pool.getConnection();
    const [seminars] = await connection.query(query, params);
    connection.release();

    res.status(200).json({
      success: true,
      data: seminars,
      count: seminars.length,
      searchParams: {
        keyword: keyword || null,
        speaker: speaker || null,
        location: location || null,
        startDate: startDate || null,
        endDate: endDate || null,
      },
    });
  } catch (error) {
    console.error('Error searching seminars:', error);
    res.status(500).json({
      success: false,
      message: '세미나 검색 실패',
      error: error.message,
    });
  }
};

module.exports = {
  getAllSeminars,
  getSeminarById,
  createSeminar,
  updateSeminar,
  deleteSeminar,
  searchSeminars,
};
