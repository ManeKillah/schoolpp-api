const { getItems, replaceItems } = require('feathers-hooks-common');

module.exports = () => {
  return async (context) => {
    let { user } = context.params;
    let records = getItems(context);

    // console.log(66, 88);

    // if (!records.reference) records.reference = generateReference(7);
    if (records.store_leader_id) {
      const usersService = await context.app.service('users');
      const user = await usersService.get(Number(records.store_leader_id));
      records.store_leader = user.first_name;
    }

    if (records.container_id) {
      const containerService = await context.app.service('container');
      const container = await containerService.get(
        Number(records.container_id)
      );
      records.container_name = container.reference;
      // console.log(records, records.container_name);
    }
    if (records.project_id) {
      const containerService = await context.app.service('project');
      const project = await containerService.get(Number(records.project_id));
      records.project_name = project.reference;
      // console.log(records, records.container_name);
    }
    if (records.equipment_id) {
      const containerService = await context.app.service('equipment');
      const equipment = await containerService.get(
        Number(records.container_id)
      );
      records.equipment_name = equipment.reference;
      // console.log(records, records.container_name);
    }

    if (records.observations) {
      const currentDate = new Date();
      const observationsService = await context.app.service('observations');
      const createObservaData = {
        message: records.observations,
        creation_date: currentDate.toISOString(),
        reference: records.reference,
      };
      await observationsService.create(createObservaData);
    }
    delete records.observations;
    if (records.fileImage) delete records.fileImage;

    // console.log(55, records?.fileImage['0']);
    replaceItems(context, records);
    return context;
  };
};
