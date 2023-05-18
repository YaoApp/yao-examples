/**
 * Table model
 */
const Template = {
  data: { width: 512, height: 512, prompt: "maltese puppy" },
  explain: `
        - The above content is the reply JSON template.
        - Please generate a data based on my description and reply to me in the format of the template I provided you.
        - The "prompt" field is the "Summary" of my question as possible without losing valid information. "
        - The "height" field is the photo's height, help me extract it and convert it into pixels and keep the type as Integer.
        - The "width" field is the photo's width, help me extract it and convert it into pixels and keep the type as Integer.
        `,
};

/**
 * Commandneo.image.Draw
 * Prepare Hook: Before
 * @param {*} context
 * @param {*} messages
 */
function DrawBefore(context, messages) {
  return { template: Template.data, explain: Template.explain };
}

/**
 * Command neo.image.Draw
 * Prepare Hook: After
 * @param {*} context
 * @param {*} messages
 */
function DrawAfter(content) {
  try {
    const response = JSON.parse(content);
    if (response.prompt) {
      return response;
    }
  } catch (e) {
    throw new Exception("Describing something further?", 500);
  }

  throw new Exception("Error: data is empty.", 500);
}

/**
 * Run the command
 * yao studio run html.Page 'test' '<h1>hello</h1>' '.body{ color:"red"}' 'console.log("hello")'
 * @param {*} payload
 */
function Draw(prompt, width, height) {
  let payload = {
    prompt: prompt || "maltese puppy",
    width: width || 512,
    height: height || 512,
    steps: 20,
  };
  console.log(payload);

  let file = DrawAsync(payload, (progress, err) => {
    if (err) {
      console.log(`Error: ${err}`);
      return false;
    }
    if (progress == 0) {
      ssWrite(`\rLoading...`);
      return true;
    }

    ssWrite(`\r\rProgress: ${parseFloat(progress * 100).toFixed(2)}%\n`);
    return true;
  });

  ssWrite(`\r\n\n![Preview](/api/image${file})`);
  return { file: file };
}

/**
 * Draw picture
 * yao run scripts.image.DrawAsync '::{"width":512,"height":512,"steps":5,"prompt":"maltese puppy"}'
 * @param {*} payload
 * @returns
 */
function DrawAsync(payload, cb) {
  payload = payload || {};
  payload.width = parseInt(payload.width) || 512;
  payload.height = parseInt(payload.height) || 512;
  payload.width = payload.width > 512 ? 512 : payload.width;
  payload.height = payload.height > 512 ? 512 : payload.height;

  let image = PostAsync("/sdapi/v1/txt2img", payload, cb);
  return saveImage(image);
}

/**
 * yao run scripts.image.PostAsync /sdapi/v1/txt2img '::{"width":512,"height":512,"steps":5,"prompt":"maltese puppy"}'
 * @param {*} api
 * @param {*} payload
 * @param {*} cb
 */
function PostAsync(api, payload, cb) {
  let cfg = setting();
  let headers = { Authorization: `Basic ${btoa(cfg.user + ":" + cfg.pass)}` };
  let url = `${cfg.host}${api}`;
  let job = new Job("scripts.image.Post", url, payload, headers);
  cb =
    cb ||
    function (progress, err) {
      if (err) {
        console.log(`Error: ${err}`);
        return false;
      }
      console.log(progress);
    };

  url = `${cfg.host}/sdapi/v1/progress`;
  job.Pending(() => {
    time.Sleep(200);
    let response = http.Get(url, null, headers);
    if (response.code != 200) {
      let err = newException(response.data, response.code);
      cb(null, err.message);
      return false;
    }
    cb(response.data.progress);
  });

  let image = job.Data();
  return image;
}

function Post(url, payload, headers) {
  let response = http.Post(url, payload, null, null, headers);
  if (response.code != 200) {
    throw newException(response.data, response.code);
  }

  let images = response.data.images || [];
  if (images.length == 0) {
    log.Error(`SD API response error`);
    throw new Exception(`SD API response error`, response.code || 500);
  }

  return images[0];
}

function saveImage(image) {
  let file = `/sd/images/${Process("utils.str.UUID")}.png`;
  let fs = new FS("system");
  fs.WriteFileBase64(file, image);
  return file;
}

function newException(data, code) {
  data = data || {};
  let detail = data.detail || [];
  let message = "unknown error";
  if (typeof detail == "string") {
    message = detail;
  } else {
    let err = detail[0] || {};
    message = err.msg || "unknown error";
  }

  log.Error(`SD API error ${message}`);
  return new Exception(`${message}`, code || 500);
}

/**
 * Get stable-diffusion settings
 * @returns {Map}
 */
function setting() {
  let vars = Process("utils.env.GetMany", "SD_HOST", "SD_USER", "SD_PASS");
  return {
    user: vars["SD_USER"],
    pass: vars["SD_PASS"],
    host: vars["SD_HOST"] ? vars["SD_HOST"] : "http://127.0.0.1:7861",
  };
}
