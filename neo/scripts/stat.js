/**
 * before:data hook
 * @cmd  yao run scripts.stat.BeforeData '::{}'
 * @param {*} params
 * @returns
 */
function BeforeData(params) {
  log.Info("[chart] before data hook: %s", JSON.stringify(params));
  console.log("[chart] before data hook: %s", params);
  return [params];
}

/**
 * after:data hook
 * @cmd  yao run scripts.stat.AfterData '::{"foo":"bar"}'
 * @param {*} data
 * @returns
 */
function AfterData(data) {
  log.Info("[chart] after data hook: %s", JSON.stringify(data));
  console.log("[chart] after data hook: %s", data);
  return data;
}

/**
 * Compute out
 * @param {*} field
 * @param {*} value
 * @param {*} data
 * @returns
 */
function Income(field, value, data) {
  log.Info(
    "[chart] Income Compute: %s",
    JSON.stringify({ field: field, value: value, data: data })
  );
  return value;
}

function OnChange(query) {
  // 进入onchange事件
  query = query || {};
  field = query.key;
  newVal = query.value;
  oldVal = query.old;

  let data = { query: query };
  if (newVal == "cat") {
    data.cost = 1000;
  } else {
    data.cost = 2000;
  }

  let setting = Process("yao.form.Setting", "demo.pet");

  if (setting && setting.code && setting.message) {
    throw new Exception(setting.message, 500);
  }

  return {
    data: data,
    setting: setting,
  };
}
