/**
 * Table model
 */
const Templates = {
  "/x/Table/demo.pet": {
    data: [
      {
        name: "Cookie",
        type: "cat",
        status: "checked",
        mode: "enabled",
        stay: 200,
        cost: 100,
        doctor_id: 1,
      },
    ],
    explain: `
    - The above content is the JSON template.
    - The JSON template is used to generate the table data.
    - The JSON template is an array, each element is a row of data.
    - The field "name" of the template is a pet name.
    - The field "type" of the template is the type of pet, should be one of "cat", "dog", "others".
    - The field "status" of the template is the status of pet, should be one of "checked", "curing", "cured".
    - The field "mode" of the template is the mode of pet, should be one of "enabled", "disabled".
    - The field "stay" of the template is the stay time of pet, should be a Datetime, the format Unix TIMESTAMP in seconds.
    - The field "cost" of the template is the cost of pet, should be a integer, the unit is dollar.
    - The field "doctor_id" of the template is the doctor id of pet, should be 1 always.
    `,
  },
};

/**
 * Command neo.table.data
 * Prepare Hook: Before
 * @param {*} context
 * @param {*} messages
 */
function DataBefore(context, messages) {
  console.log("DataBefore:", context, messages);
  context = context || { stack: "-", path: "-" };
  messages = messages || [];
  const { path } = context;
  if (path === undefined) {
    done("出错啦: 未找到有效路径\n");
    return false;
  }

  const tpl = Templates[path];
  if (tpl === undefined) {
    done("出错啦: 当前页没有可生成的测试数据\n");
    return false;
  }

  // ssWrite(`Found the ${path} generate rules\n`);
  return { template: tpl.data, explain: tpl.explain };
}

/**
 * Command neo.table.data
 * Prepare Hook: After
 * @param {*} content
 */
function DataAfter(content, context) {
  console.log("DataAfter:", content, context);
  const response = JSON.parse(content);
  const data = response.data || [];
  if (data.length > 0) {
    // Print data preview
    ssWrite(`\r\n`);
    ssWrite(`| name | type | status | mode | stay | cost | doctor_id |\n`);
    ssWrite(`| ---- | ---- | ------ | ---- | ---- | ---- | --------- |\n`);
    data.forEach((item) => {
      let stay = new Date().toISOString().split("T")[0];
      try {
        stay =
          new Date(item.stay * 1000).toISOString().split("T")[0] + " 08:00:00";
      } catch (e) {
        stay = new Date().toISOString().split("T")[0] + " 08:00:00";
      }
      message = `| ${item.name} |  ${item.type} |  ${item.status} | ${item.mode} | ${stay} | ${item.cost} | ${item.doctor_id}|\n`;
      ssWrite(message);
    });
    ssWrite(`  \n\n`);

    return response;
  }

  throw new Exception("Error: data is empty.", 500);
}

/**
 * Run the command
 * @param {*} payload
 */
function Data(payload, context) {
  console.log(payload, context);
  payload.forEach((item) => {
    try {
      item.stay =
        new Date(item.stay * 1000).toISOString().split("T")[0] + " 08:00:00";
    } catch (e) {
      item.stay = new Date().toISOString().split("T")[0] + " 08:00:00";
    }
    Process("models.pet.Save", item);
  });
  return true;
}
