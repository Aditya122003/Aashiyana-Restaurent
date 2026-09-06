const storage = require('../services/storage');

function getTodayAndMax15Days() {
  const now = new Date();
  
  // Format YYYY-MM-DD
  const formatYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const minDateStr = formatYMD(now);
  
  const maxDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const maxDateStr = formatYMD(maxDate);

  return { minDateStr, maxDateStr, now };
}

exports.getReservationWindow = (req, res) => {
  const { minDateStr, maxDateStr } = getTodayAndMax15Days();
  return res.json({
    success: true,
    minDate: minDateStr,
    maxDate: maxDateStr,
    maxDaysWindow: 15,
    allowedTimeSlots: [
      "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
      "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
      "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
      "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
      "09:00 PM", "09:30 PM", "10:00 PM"
    ]
  });
};

exports.createReservation = (req, res) => {
  try {
    const {
      branchId,
      customerName,
      customerPhone,
      customerEmail,
      date,
      timeSlot,
      guests,
      seatingPreference,
      specialRequests
    } = req.body;

    if (!branchId || !customerName || !customerPhone || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Branch, name, phone, date, and time slot are required.'
      });
    }

    const { minDateStr, maxDateStr } = getTodayAndMax15Days();

    // Check date boundaries
    if (date < minDateStr) {
      return res.status(400).json({
        success: false,
        message: `Reservation date cannot be in the past. Earliest allowed date is today (${minDateStr}).`
      });
    }

    if (date > maxDateStr) {
      return res.status(400).json({
        success: false,
        message: `Reservations are only accepted within the next 15 days window (up to ${maxDateStr}).`
      });
    }

    const branch = storage.getBranchById(branchId);
    const branchName = branch ? branch.name : branchId;

    const reservation = storage.addReservation({
      branchId,
      branchName,
      customerName,
      customerPhone,
      customerEmail,
      date,
      timeSlot,
      guests: Number(guests) || 2,
      seatingPreference,
      specialRequests
    });

    return res.status(201).json({
      success: true,
      message: 'Table reserved successfully! Our team at Ashiana looks forward to hosting you.',
      reservation
    });
  } catch (err) {
    console.error('Reservation error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error while reserving table.' });
  }
};

exports.getAllReservations = (req, res) => {
  const { branchId, date } = req.query;
  const reservations = storage.getReservations(branchId, date);
  return res.json({ success: true, count: reservations.length, reservations });
};

exports.getTodayReservations = (req, res) => {
  const { branchId } = req.query;
  const reservations = storage.getTodayReservations(branchId);
  return res.json({ success: true, count: reservations.length, reservations });
};

exports.updateStatus = (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const updated = storage.updateReservationStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Reservation not found' });
  }
  return res.json({ success: true, reservation: updated, message: 'Reservation status updated' });
};
