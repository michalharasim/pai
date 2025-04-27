module.exports = (Machine, Reservation) => {
    const getMachines = async (req, res) => {
      try {
        const machines = await Machine.findAll();
        res.render('machine', { machines });
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
    };
  
    const addMachine = async (req, res) => {
      const { name, description, image } = req.body;
  
      try {
        const newMachine = await Machine.create({
          name,
          description,
          image
        });
        res.redirect('/machines');
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
    };

    const getMachineById = async (req, res) => {
        const machineId = req.params.id;
    
        try {
          const machine = await Machine.findByPk(machineId);
          if (machine) {
            const reservations = await Reservation.findAll({
              where: { machine_id: machineId },
            });
    
            res.render('machineDetail', { machine, reservations });
          } else {
            res.status(404).send('Maszyna nie znaleziona');
          }
        } catch (error) {
          res.status(500).send('Internal Server Error');
        }
      };

      const editMachine = async (req, res) => {
        const { name, description, image } = req.body;
        const machineId = req.params.id;
    
        try {
          const machine = await Machine.findByPk(machineId);
          if (!machine) {
            return res.status(404).send('Maszyna nie znaleziona');
          }
    
          machine.name = name;
          machine.description = description;
          machine.image = image;
    
          await machine.save();
    
          res.redirect(`/machines/${machineId}`);
        } catch (error) {
          res.status(500).send('Internal Server Error');
        }
      };

      const deleteMachine = async (req, res) => {
        const machineId = req.params.id;
    
        try {
          const machine = await Machine.findByPk(machineId);
          if (machine) {
            await machine.destroy();
            res.redirect('/machines');
          } else {
            res.status(404).send('Maszyna nie znaleziona');
          }
        } catch (error) {
          res.status(500).send('Internal Server Error');
        }
      };
  
    return {
      getMachines,
      addMachine,
      getMachineById,
      deleteMachine,
      editMachine,
    };
  };
  