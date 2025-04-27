const { Op } = require('sequelize');

module.exports = (Reservation, Machine, User) => {
    const addReservation = async (req, res) => {
        const { startDate, endDate } = req.body;
        const machineId = req.params.id;
        const userId = req.user.id;
        
        const today = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(today.getMonth() + 3);

        if (new Date(startDate) > threeMonthsFromNow) {
          return res.status(400).send('Nie możesz dokonać rezerwacji na więcej niż 3 miesiące do przodu.');
        }

        const overlappingReservations = await Reservation.findAll({
          where: {
            machine_id: machineId,
            [Op.or]: [
              { start_date: { [Op.between]: [startDate, endDate] } },
              { end_date: { [Op.between]: [startDate, endDate] } },
              { [Op.and]: [{ start_date: { [Op.lte]: startDate } }, { end_date: { [Op.gte]: endDate } }] },
            ],
          },
        });

        if (overlappingReservations.length > 0) {
          return res.status(400).send('Rezerwacja nakłada się na istniejące terminy.');
        }

        const reservationDate = new Date();

        await Reservation.create({
          machine_id: machineId,
          user_id: userId,
          start_date: startDate,
          end_date: endDate,
          reservation_date: reservationDate,
        });

        res.redirect(`/machines/${machineId}`);
      };
  
    const cancelReservation = async (req, res) => {
      const { id } = req.params;
      const machineId = req.params.machineId;

      const reservation = await Reservation.findByPk(id);
      if (!reservation) {
        return res.status(404).send('Rezerwacja nie została znaleziona.');
      }
  
      await reservation.destroy();
      res.redirect(`/machines/${machineId}`);
    };
  
    return {
      addReservation,
      cancelReservation,
    };
  };
  